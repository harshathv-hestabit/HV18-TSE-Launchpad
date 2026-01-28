from llama_cpp import Llama
from .config import (
    MODEL_PATH,
    N_CTX,
    N_THREADS,
)

_llm = None

def load_model():
    global _llm
    if _llm is None:
        _llm = Llama(
            model_path=str(MODEL_PATH),
            n_ctx=N_CTX,
            n_threads=N_THREADS,
            verbose=False,
        )
    return _llm
