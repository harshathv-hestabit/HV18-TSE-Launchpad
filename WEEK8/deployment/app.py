import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

from .model_loader import load_model
from .config import *

llm = None
SAFETY_MARGIN = 128


@asynccontextmanager
async def lifespan(app: FastAPI):
    global llm
    llm = load_model()
    yield


app = FastAPI(
    title="Local LLM API",
    lifespan=lifespan,
)


def _request_id(req_id: str | None) -> str:
    return req_id or f"req_{uuid.uuid4().hex[:12]}"


def estimate_tokens(text: str) -> int:
    return max(1, len(text) // 4)


def truncate_messages(messages: list[dict], max_prompt_tokens: int) -> list[dict]:
    kept = []
    total = 0

    for msg in reversed(messages):
        tokens = estimate_tokens(msg["content"])
        if total + tokens > max_prompt_tokens:
            break
        kept.append(msg)
        total += tokens

    return list(reversed(kept))


def messages_to_text(system_prompt: str | None, messages: list[dict]) -> str:
    parts = []

    if system_prompt:
        parts.append(system_prompt)

    for m in messages:
        parts.append(m["content"])

    return "\n\n".join(parts)


@app.post("/v1/generate")
async def generate(payload: dict, request: Request):
    rid = _request_id(payload.get("request_id"))

    prompt = payload["prompt"]
    system_prompt = payload.get("system_prompt")

    full_prompt = (
        f"{system_prompt}\n\n{prompt}"
        if system_prompt else prompt
    )

    params = {
        "max_tokens": min(
            payload.get("max_tokens", DEFAULT_MAX_TOKENS),
            MAX_MAX_TOKENS,
        ),
        "temperature": payload.get("temperature", DEFAULT_TEMPERATURE),
        "top_p": payload.get("top_p", DEFAULT_TOP_P),
        "top_k": payload.get("top_k", DEFAULT_TOP_K),
        "stop": payload.get("stop", []),
    }

    if payload.get("stream"):
        def stream():
            for chunk in llm(full_prompt, stream=True, **params):
                yield f"data: {chunk['choices'][0]['text']}\n\n"

        return StreamingResponse(stream(), media_type="text/event-stream")

    out = llm(full_prompt, **params)

    return {
        "id": rid,
        "object": "text_completion",
        "created": int(time.time()),
        "model": "llama.cpp/gguf",
        "output": {
            "text": out["choices"][0]["text"],
            "finish_reason": out["choices"][0]["finish_reason"],
        },
        "usage": out["usage"],
    }


@app.post("/v1/chat")
async def chat(payload: dict):
    rid = _request_id(payload.get("request_id"))

    params = {
        "max_tokens": min(
            payload.get("max_tokens", DEFAULT_MAX_TOKENS),
            MAX_MAX_TOKENS,
        ),
        "temperature": payload.get("temperature", DEFAULT_TEMPERATURE),
        "top_p": payload.get("top_p", DEFAULT_TOP_P),
        "top_k": payload.get("top_k", DEFAULT_TOP_K),
        "stop": payload.get("stop", []),
    }

    messages = payload["messages"]

    max_prompt_tokens = (
        N_CTX
        - params["max_tokens"]
        - SAFETY_MARGIN
    )

    truncated_messages = truncate_messages(
        messages,
        max_prompt_tokens,
    )

    prompt = messages_to_text(
        payload.get("system_prompt"),
        truncated_messages,
    )

    if payload.get("stream"):
        def stream():
            for chunk in llm(prompt, stream=True, **params):
                yield f"data: {chunk['choices'][0]['text']}\n\n"

        return StreamingResponse(stream(), media_type="text/event-stream")

    out = llm(prompt, **params)

    return {
        "id": rid,
        "object": "chat_completion",
        "model": "llama.cpp/gguf",
        "message": {
            "role": "assistant",
            "content": out["choices"][0]["text"],
        },
        "finish_reason": out["choices"][0]["finish_reason"],
        "usage": out["usage"],
    }
