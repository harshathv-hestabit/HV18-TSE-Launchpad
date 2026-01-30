import json
from autogen_core import RoutedAgent,MessageContext,message_handler,TopicId
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
from autogen_ext.tools.code_execution import PythonCodeExecutionTool
from config.hosted import openai_client

executor = LocalCommandLineCodeExecutor(work_dir="workspace")
python_tool = PythonCodeExecutionTool(executor=executor)

code_assistant = AssistantAgent(
    name="CODER",
    model_client=openai_client,
    system_message="""
You are the Coder.

Tool: Python Code Executor, can execute code on the local command line.

Responsibilities:
- Load and process data
- Compute metrics
- Produce structured outputs
- create and save scripts to workspace using tools if asked

Rules:
- No interpretation
- No business language
- No prose explanations

Output:
- If files are asked to be saved, then .py, .txt and .md
- otherwise, Markdown file
""",
    tools=[python_tool]
)

class Coder(RoutedAgent):
    def __init__(self):
        super().__init__("Coder")
        self.assistant = code_assistant
    
    @message_handler
    async def handle_message(self, message: TextMessage, ctx: MessageContext) -> None:
        payload = json.loads(message.content)
        task_id = payload["task_id"]
        instruction = payload["instruction"]
        context = payload["context"]
        input = {"input":instruction,"context":context}
        
        llm_response = await self.assistant.on_messages(
            messages=[TextMessage(content=json.dumps(input), source="orchestrator")],cancellation_token=ctx.cancellation_token
        )
        result = {"task_id":task_id, "result":llm_response.chat_message.content}
        await self.publish_message(
            topic_id=TopicId("results","default"),
            message=TextMessage(content=json.dumps(result), source="coder")
        )
        
# import json
# import asyncio
# import contextlib
# from autogen_core import RoutedAgent, MessageContext, message_handler, TopicId
# from autogen_agentchat.messages import TextMessage
# from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
# from autogen_ext.tools.code_execution import PythonCodeExecutionTool


# class Coder(RoutedAgent):
#     MAX_EXEC_RETRIES = 1

#     def __init__(self):
#         super().__init__("Coder")
#         self.assistant = code_assistant

#     @message_handler
#     async def handle_message(self, message: TextMessage, ctx: MessageContext) -> None:
#         payload = json.loads(message.content)
#         task_id = payload["task_id"]

#         input_msg = {
#             "input": payload["instruction"],
#             "context": payload["context"]
#         }

#         last_error = None

#         for attempt in range(self.MAX_EXEC_RETRIES + 1):
#             executor = None
#             try:
#                 # task-scoped workspace
#                 work_dir = f"workspace/task_{task_id}_attempt_{attempt}"

#                 executor = LocalCommandLineCodeExecutor(work_dir=work_dir)
#                 tool = PythonCodeExecutionTool(executor=executor)

#                 # clone assistant tools per attempt
#                 self.assistant.tools = [tool]

#                 llm_response = await self.assistant.on_messages(
#                     messages=[
#                         TextMessage(
#                             content=json.dumps(input_msg),
#                             source="orchestrator"
#                         )
#                     ],
#                     cancellation_token=ctx.cancellation_token
#                 )

#                 await self._publish_success(task_id, llm_response.chat_message.content)
#                 return

#             except Exception as e:
#                 last_error = e

#                 # retry only on executor/tool-related failures
#                 if attempt < self.MAX_EXEC_RETRIES:
#                     continue

#                 await self._publish_failure(task_id, e)
#                 return

#             finally:
#                 if executor:
#                     # cancellation-safe cleanup
#                     with contextlib.suppress(Exception, asyncio.CancelledError):
#                         await executor.shutdown()

#         # absolute fallback (should never hit)
#         await self._publish_failure(task_id, last_error)

#     async def _publish_success(self, task_id, content):
#         await self.publish_message(
#             topic_id=TopicId("results", "default"),
#             message=TextMessage(
#                 content=json.dumps({
#                     "task_id": task_id,
#                     "status": "SUCCESS",
#                     "result": content
#                 }),
#                 source="coder"
#             )
#         )

#     async def _publish_failure(self, task_id, error):
#         await self.publish_message(
#             topic_id=TopicId("results", "default"),
#             message=TextMessage(
#                 content=json.dumps({
#                     "task_id": task_id,
#                     "status": "FAILED",
#                     "error": str(error)
#                 }),
#                 source="coder"
#             )
#         )
