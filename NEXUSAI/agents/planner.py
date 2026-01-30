import json
from autogen_core import RoutedAgent,MessageContext,message_handler,TopicId
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from config.hosted import openai_client
from config.ollama_client import OLLAMA_CLIENT
from domains import ExecutionPlan

client = OLLAMA_CLIENT(options={"verbose":False,"n_ctx":2048}).build()

PLAN_INSTRUCTIONS = '''
You are the Planner.

Responsibilities:
 - Decompose the user goal into a directed acyclic graph of tasks
 - Assign exactly one topic to each task
 - Define task dependencies using task IDs
 - Tasks can also be assigned without dependencies if not required,

Available topics (use only these): [ analysis, coding, critic, optimizer, reporting, research, validated]

Rules:
 - Each task MUST specify exactly one department from the list above
 - Do NOT invent new topic
 - Dependencies refer only to task IDs, never to topics
 - Do NOT execute tasks
 - Do NOT analyze data
 - Do NOT reason about message routing or system mechanics

Output:
 - Return ONLY a valid ExecutionPlan object
 - No commentary, no markdown, no explanations'''

planner = AssistantAgent(
    name="PLANNER",
    model_client=openai_client,
    # model_client=client,
    system_message=(PLAN_INSTRUCTIONS),
    output_content_type=ExecutionPlan
)

class Planner(RoutedAgent):
    def __init__(self):
        super().__init__("Planner")
        self.assistant = planner
        
    async def handle_message(self, message: TextMessage, ctx: MessageContext) -> ExecutionPlan:
        payload = message.content
        
        llm_response = await self.assistant.on_messages(
            messages=[TextMessage(content=json.dumps(payload), source="user")],cancellation_token=ctx.cancellation_token
        )
        
        plan = llm_response.chat_message.content
        return plan