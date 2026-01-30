import json
from autogen_core import RoutedAgent,MessageContext,message_handler,TopicId
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from config.hosted import openai_client

validator = AssistantAgent(
    name="VALIDATOR",
    model_client=openai_client,
    system_message="""
You are the Validator.

Responsibilities:
- Check data, computations, and results for correctness.
- Ensure tasks follow specified rules and constraints.
- Report any inconsistencies or errors.

Rules:
- Return JSON with {valid: bool, issues: []}.
- Do not perform new analysis.
""",
)

class Validator(RoutedAgent):
    def __init__(self):
        super().__init__("Validator")
        self.assistant = validator
    
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
            message=TextMessage(content=json.dumps(result), source="validator")
        )