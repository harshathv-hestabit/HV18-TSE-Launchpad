import asyncio
import json
from autogen_core import SingleThreadedAgentRuntime, MessageContext, CancellationToken
from autogen_agentchat.messages import TextMessage
from agents.analyst import Analyst
from agents.coder import Coder
from agents.critic import Critic
from agents.optimizer import Optimizer
from agents.planner import Planner
from agents.reporter import Reporter
from agents.researcher import Researcher
from agents.validator import Validator
from domains import ExecutionPlan
from subscriptions import PLANNED_SUBSCRIPTIONS
from orchestrator import Orchestrator

import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, message="Event loop is closed")

results = []

async def collect_results(ctx, message: TextMessage, _ctx: MessageContext) -> None:
    """Collector that preserves task_id and publishes to agent topics"""
    print(f"\n=== {message.source} RESULT ===")
    print(message.content)
    results.append(message.content)
    
    try:
        data = json.loads(message.content)
        if isinstance(data, dict) and "task_id" in data:
            pass
    except (json.JSONDecodeError, AttributeError):
        pass

async def main():
    runtime = SingleThreadedAgentRuntime()
    
    await Analyst.register(runtime, type="ANALYST", factory=lambda: Analyst())
    await Coder.register(runtime, type="CODER", factory=lambda: Coder())
    await Critic.register(runtime, type="CRITIC", factory=lambda: Critic())
    await Optimizer.register(runtime, type="OPTIMIZER", factory=lambda: Optimizer())
    await Planner.register(runtime, type="PLANNER", factory=lambda: Planner())
    await Reporter.register(runtime, type="REPORTER", factory=lambda: Reporter())
    await Researcher.register(runtime, type="RESEARCHER", factory=lambda: Researcher())
    await Validator.register(runtime, type="VALIDATOR", factory=lambda: Validator())
    
    for subscription in PLANNED_SUBSCRIPTIONS:
        await runtime.add_subscription(subscription)
    

    user_query = input("How can i help you? \n") 
    
    # user_query = ''''''
       
    runtime.start()
    
    planner = Planner()
    ct = CancellationToken()
    
    planner_response = await planner.assistant.on_messages(
        [TextMessage(content=user_query, source="user")], 
        ct
    )
    plan: ExecutionPlan = planner_response.chat_message.content
    orchestrator = Orchestrator(runtime,plan)
    await orchestrator.start()
    completed = await orchestrator.run()
    
    print("\n=== FINAL RESULTS ===")
    for task_id, result in completed.items():
        print(f"Task {task_id}: {result}")
    
    # await runtime.stop()
if __name__ == "__main__":
    asyncio.run(main())