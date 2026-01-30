import json
from autogen_core import RoutedAgent, MessageContext, message_handler, TopicId
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from config.hosted import openai_client

analyst_assistant = AssistantAgent(
    name="ANALYST",
    model_client=openai_client,
    system_message="""
You are the Analyst.

Responsibilities:
- Analyze structured data, metrics, and intermediate results.
- Identify trends, anomalies, and patterns.
- Prepare structured analysis output.

Rules:
- Return structured JSON.
- No prose explanations, only insights in JSON.
""",

)

class Analyst(RoutedAgent):
    def __init__(self):
        super().__init__("Analyst")
        self.assistant = analyst_assistant
    
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
            message=TextMessage(content=json.dumps(result), source="analyst")
        )