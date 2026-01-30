import json
import asyncio
from collections import defaultdict, deque
from autogen_core import (
    AgentId, TopicId, SingleThreadedAgentRuntime,
    RoutedAgent, message_handler, default_subscription,
    MessageContext, TypeSubscription
)
from autogen_agentchat.messages import TextMessage

@default_subscription
class ResultPoller(RoutedAgent):
    def __init__(self, orchestrator, agent_id: AgentId):
        super().__init__(description="Central result poller")
        self.orchestrator = orchestrator
        self.agent_id = agent_id

    @message_handler
    async def handle_result(self, message: TextMessage, context: MessageContext) -> None:
        try:
            data = json.loads(message.content)

            task_id = data.get("task_id")
            result = data.get("result")

            if not task_id:
                return

            # print(f"[RESULT POLLER] Received result for {task_id}")
            self.orchestrator.signal_task_complete(task_id, result)

        except Exception as e:
            print(f"[RESULT POLLER] Error: {e}")
            
class Orchestrator:
    def __init__(self, runtime: SingleThreadedAgentRuntime, plan):
        self.runtime = runtime
        self.plan = plan

        self.task_events: dict[str, asyncio.Event] = {}
        self.task_results: dict[str, dict] = {}

        for task in plan.tasks:
            self.task_events[task.id] = asyncio.Event()

        self.result_poller_id = AgentId("result_poller", "default")
        self.result_poller = ResultPoller(self, self.result_poller_id)

    async def start(self):
        await self.runtime.register_agent_instance(
            self.result_poller, self.result_poller_id
        )

        await self.runtime.add_subscription(
            TypeSubscription(
                agent_type="result_poller",
                topic_type="results"
            )
        )

    def signal_task_complete(self, task_id: str, result: dict):
        if task_id in self.task_results:
            return

        self.task_results[task_id] = result

        event = self.task_events.get(task_id)
        if event and not event.is_set():
            event.set()
            # print(f"[ORCHESTRATOR] Event set for {task_id}")

    async def run(self):
        ordered_tasks = self._toposort(self.plan.tasks)
        for task in ordered_tasks:
            print(task)
        # print("[TOPOSORT]", [t.id for t in ordered_tasks])

        for task in ordered_tasks:
            await self._wait_for_dependencies(task.depends_on)
            dependency_context = self._build_dependency_context(task.depends_on)
            payload = {
                "task_id": task.id,
                "instruction": task.instruction,
                "context": dependency_context
            }

            await self.runtime.publish_message(
                TextMessage(
                    content=json.dumps(payload),
                    source="orchestrator"
                ),
                TopicId(task.topic, "default")
            )

            await self.task_events[task.id].wait()

        return self.task_results

    async def _wait_for_dependencies(self, deps: list[str]):
        if not deps:
            return
        await asyncio.gather(
            *[self.task_events[d].wait() for d in deps]
        )

    def _build_dependency_context(self, deps: list[str]) -> dict:
        return {
            dep_id: self.task_results[dep_id]
            for dep_id in deps
            if dep_id in self.task_results
        }

    def _toposort(self, tasks):
        graph = defaultdict(list)
        indegree = defaultdict(int)

        for t in tasks:
            indegree[t.id] = 0

        for t in tasks:
            for d in t.depends_on:
                graph[d].append(t.id)
                indegree[t.id] += 1

        queue = deque([t.id for t in tasks if indegree[t.id] == 0])
        ordered_ids = []

        while queue:
            cur = queue.popleft()
            ordered_ids.append(cur)
            for nxt in graph[cur]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    queue.append(nxt)

        return [t for tid in ordered_ids for t in tasks if t.id == tid]