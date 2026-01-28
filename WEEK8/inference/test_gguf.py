import os
from typing import List, Optional
from llama_cpp import Llama

MODEL_PATH = "quantized/model-q4_0.gguf" 
N_CTX = 32768  
BATCH_SIZE = 10
MAX_TOKENS = 256
TEMPERATURE = 0.7
TOP_P = 0.9

def load_model(model_path: str, n_ctx: int = 2048) -> Llama:
    return Llama(
        model_path=model_path,
        n_ctx=n_ctx,
        n_threads=os.cpu_count(),
    )

def stream_completion(model: Llama, prompt: str, max_tokens: int = 128):
    for token in model.create_completion(
        prompt,
        max_tokens=max_tokens,
        temperature=TEMPERATURE,
        top_p=TOP_P,
        stream=True
    ):
        print(token, end="", flush=True)

def batch_infer(model: Llama, prompts: List[str], max_tokens: int = 128):
    results = []
    for prompt in prompts:
        output = model.create_completion(
            prompt,
            max_tokens=max_tokens,
            temperature=TEMPERATURE,
            top_p=TOP_P,
        )
        results.append(output)
    return results

if __name__ == "__main__":
    prompts = [
        "Explain the importance of quantum computing in AI.",
        "Summarize the book '1984' by George Orwell.",
        "List the steps to implement batch inference in Python."
    ]

    model = load_model(MODEL_PATH, n_ctx=N_CTX)

    # print("Streaming Mode...")
    # for prompt in prompts:
    #     print(f"\nPrompt: {prompt}\nResponse:")
    #     stream_completion(model, prompt, MAX_TOKENS)

    print("Batch Mode...")
    batches = [prompts[i:i+BATCH_SIZE] for i in range(0, len(prompts), BATCH_SIZE)]
    for idx, batch in enumerate(batches):
        print(f"\nBatch {idx+1}")
        results = batch_infer(model, batch, MAX_TOKENS)
        for prompt, output in zip(batch, results):
            print(f"\nPrompt: {prompt}\nResponse: {output}\n")