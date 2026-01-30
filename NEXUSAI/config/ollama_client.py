from autogen_ext.models.ollama import OllamaChatCompletionClient
from dotenv import load_dotenv
import os

load_dotenv()

MODEL_NAME = os.getenv("OLLAMA_MODEL")

class OLLAMA_CLIENT:
    def __init__(self, options: dict):
        self._client = OllamaChatCompletionClient(model=MODEL_NAME,options=options)

    def build(self):
        return self._client