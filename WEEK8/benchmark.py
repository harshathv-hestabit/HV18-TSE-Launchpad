import os
import time
import psutil
import torch
import pandas as pd
from transformers import AutoModelForCausalLM, AutoTokenizer

BASE_DIR = "quantized"

MODEL_PATHS = {
    "FP16": f"{BASE_DIR}/model fp16",
    "INT8": f"{BASE_DIR}/model-int8",
    "INT4": f"{BASE_DIR}/model-int4",
}

PROMPT = "Explain why quantization affects LLM quality."
MAX_NEW_TOKENS = 256

torch.set_num_threads(os.cpu_count())
DEVICE = "cpu"
DTYPE = torch.float16

def disk_size_gb(path):
    total = 0
    for root, _, files in os.walk(path):
        for f in files:
            total += os.path.getsize(os.path.join(root, f))
    return round(total / (1024 ** 3), 3)


def rss_memory_gb():
    process = psutil.Process(os.getpid())
    return round(process.memory_info().rss / (1024 ** 3), 3)


def benchmark_cpu(name, model_path):
    torch.cuda.empty_cache()

    tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=True)

    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map={"": "cpu"},
        torch_dtype=DTYPE,
        low_cpu_mem_usage=True,
    )
    model.eval()

    inputs = tokenizer(PROMPT, return_tensors="pt")

    with torch.no_grad():
        _ = model.generate(**inputs, max_new_tokens=5)

    start_mem = rss_memory_gb()
    start = time.time()

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=False,
        )

    end = time.time()
    end_mem = rss_memory_gb()

    gen_tokens = outputs.shape[-1] - inputs["input_ids"].shape[-1]
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

for name, path in MODEL_PATHS.items():
    print(f"Running {name} on CPU...")
    stats = benchmark_cpu(name, path)
    results.append(stats)

df = pd.DataFrame(results)

print(df)