from autogen_agentchat.tools import AgentTool
from autogen_ext.agents.web_surfer import MultimodalWebSurfer
from config.hosted import openai_client

agent = MultimodalWebSurfer(name="web_surfer",model_client=openai_client)
web_surfer = AgentTool(agent,return_value_as_last_message=True)