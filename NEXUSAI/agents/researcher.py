import json
from autogen_core import RoutedAgent,MessageContext,message_handler,TopicId
from autogen_agentchat.messages import TextMessage
from autogen_agentchat.agents import AssistantAgent
from config.hosted import openai_client
from tools.file_surfer import local_surfer
from tools.web_surfer import web_surfer

researcher = AssistantAgent(
    name="RESEARCHER",
    model_client=openai_client,
    system_message="""
You are the Researcher.

Responsibilities:
- Gather factual information
- Prefer local workspace files when relevant
- Use web sources only if local data is insufficient

Rules:
- No deep analysis
- No recommendations
- Cite information sources

Output:
- ResearchSummary only
""",
    tools=[local_surfer, web_surfer],
    # reflect_on_tool_use=True
)

class Researcher(RoutedAgent):
    def __init__(self):
        super().__init__("Researcher")
        self.assistant = researcher
    
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
            message=TextMessage(content=json.dumps(result), source="researcher")
        )