from autogen_agentchat.tools import AgentTool
from autogen_ext.agents.file_surfer import FileSurfer
from config.hosted import openai_client

agent = FileSurfer(name="Local_Surfer",model_client=openai_client,base_path="./workspace")
local_surfer = AgentTool(agent,return_value_as_last_message=True)