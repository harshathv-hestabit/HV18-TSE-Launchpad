import os
import time
import psutil
from llama_cpp import Llama
import pandas as pd

MODELS = {
    "GGUF_Q4": "quantized/model-q4_0.gguf",
    "GGUF_Q8": "quantized/model-q8_0.gguf",
}

PROMPT = "Explain why quantization affects LLM quality."
MAX_NEW_TOKENS = 256

N_CTX = 32768
N_THREADS = os.cpu_count()

def disk_size_gb(path):
    return round(os.path.getsize(path) / (1024 ** 3), 3)


def rss_gb():
    process = psutil.Process(os.getpid())
    return round(process.memory_info().rss / (1024 ** 3), 3)


def benchmark_gguf(name, model_path):
    print(f"Running {name}...")

    llm = Llama(
        model_path=model_path,
        n_ctx=N_CTX,
        n_threads=N_THREADS,
        verbose=False,
    )

    start_mem = rss_gb()

    # warmup
    llm("Hello", max_tokens=8)

    start = time.time()

    output = llm(
        PROMPT,
        max_tokens=MAX_NEW_TOKENS,
        temperature=0.7,
        stop=["</s>"],
    )

    end = time.time()
    end_mem = rss_gb()

    gen_tokens = output["usage"]["completion_tokens"]
    latency = round(end - start, 3)
    tok_per_sec = round(gen_tokens / latency, 3)

    return {
        "Format": name,
        "Disk_GB": disk_size_gb(model_path),
        "RAM_GB": round(end_mem - start_mem, 3),
        "Latency_sec": latency,
        "Tokens_per_sec": tok_per_sec,
        "Generated_tokens": gen_tokens,
    }

results = []

for name, path in MODELS.items():
    stats = benchmark_gguf(name, path)
    results.append(stats)

df = pd.DataFrame(results)
print(df)