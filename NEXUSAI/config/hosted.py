from autogen_core.models import ChatCompletionClient
from dotenv import load_dotenv
import os
load_dotenv()

key = os.getenv("GROQ_API_KEY")

model_info = {
    "family": "oss",
    "vision": False,
    "function_calling": True,
    "json_output": True,
    "structured_output": True,
    "context_length": 8192,
}

config = {
    "provider":"openai_chat_completion_client",
    "config":{
        "model":"openai/gpt-oss-20b",
        "api_key":key,
        "base_url":"https://api.groq.com/openai/v1",
        "model_info":model_info,
        "temperature":0.3
    }
}

openai_client = ChatCompletionClient.load_component(config)