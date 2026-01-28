import asyncio
import time
import json
import csv
import os
import psutil
import re
import string
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from openai import AsyncOpenAI

POLL_INTERVAL = 0.05
CSV_PATH = "benchmarks.csv"
JSON_PATH = "benchmarks_detailed.json"

@dataclass
class Result:
    model: str
    port: int
    prompt_id: int
    task: str
    latency_sec: float
    tokens_per_sec: float
    peak_mem_mb: float
    prompt_tokens: int
    completion_tokens: int
    scores: Optional[Dict[str, float]]
    response: Optional[str]
    error: Optional[str] = None

def estimate_tokens(text: str) -> int:
    return max(1, len(text) // 4)

def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.translate(str.maketrans("", "", string.punctuation))
    return re.sub(r"\s+", " ", text)

def exact_match(pred: str, gold: str) -> float:
    return float(normalize(pred) == normalize(gold))

def token_f1(pred: str, gold: str) -> float:
    p, g = normalize(pred).split(), normalize(gold).split()
    common = set(p) & set(g)
    if not common:
        return 0.0
    prec = len(common) / len(p)
    rec = len(common) / len(g)
    return 2 * prec * rec / (prec + rec)

from rouge_score import rouge_scorer
_rouge = rouge_scorer.RougeScorer(["rougeL"], use_stemmer=True)

def rouge_l(pred: str, gold: str) -> float:
    return _rouge.score(gold, pred)["rougeL"].fmeasure

from bert_score import score as bert_score

def bert_f1(pred: str, gold: str) -> float:
    _, _, f1 = bert_score([pred], [gold], lang="en", rescale_with_baseline=True)
    return float(f1.mean())

def evaluate(task: str, pred: str, gold: str) -> Dict[str, float]:
    if task == "extraction":
        return {
            "exact_match": exact_match(pred, gold),
            "token_f1": token_f1(pred, gold),
        }
    if task == "qa":
        return {
            "exact_match": exact_match(pred, gold),
            "rouge_l": rouge_l(pred, gold),
        }
    if task == "reasoning":
        return {
            "bertscore_f1": bert_f1(pred, gold),
        }
    raise ValueError(f"Unknown task: {task}")

class MemoryTracker:
    def __init__(self):
        self.proc = psutil.Process()
        self.baseline = 0
        self.peak = 0
        self.running = False

    async def __aenter__(self):
        self.baseline = self.proc.memory_info().rss / 1024**2
        self.peak = self.baseline
        self.running = True
        self.task = asyncio.create_task(self._poll())
        return self

    async def __aexit__(self, *exc):
        self.running = False
        await self.task

    async def _poll(self):
        while self.running:
            rss = self.proc.memory_info().rss / 1024**2
            self.peak = max(self.peak, rss)
            await asyncio.sleep(POLL_INTERVAL)

    @property
    def delta_mb(self):
        return self.peak - self.baseline

async def run_prompt(
    client: AsyncOpenAI,
    model_name: str,
    port: int,
    prompt: str,
    prompt_id: int,
    task: str,
    gold: str,
    model: str = "model",
) -> Result:

    start = time.time()
    completion = ""
    completion_tokens = 0

    try:
        async with MemoryTracker() as mem:
            stream = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                stream=True,
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    completion += delta
                    completion_tokens += estimate_tokens(delta)

        latency = time.time() - start
        prompt_tokens = estimate_tokens(prompt)
        tps = completion_tokens / latency if latency else 0.0
        scores = evaluate(task, completion, gold)

        print(
            f"[{model_name}] P{prompt_id} | "
            f"{tps:.1f} tok/s | {latency:.2f}s | "
            f"{mem.delta_mb:.0f}MB"
        )

        return Result(
            model=model_name,
            port=port,
            prompt_id=prompt_id,
            task=task,
            latency_sec=latency,
            tokens_per_sec=tps,
            peak_mem_mb=mem.delta_mb,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            scores=scores,
            response=completion,
        )

    except Exception as e:
        return Result(
            model=model_name,
            port=port,
            prompt_id=prompt_id,
            task=task,
            latency_sec=0,
            tokens_per_sec=0,
            peak_mem_mb=0,
            prompt_tokens=0,
            completion_tokens=0,
            scores=None,
            response=None,
            error=str(e),
        )

def save_csv(results: List[Result]):
    exists = os.path.isfile(CSV_PATH)
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "model",
                "port",
                "prompt_id",
                "task",
                "latency_sec",
                "tokens_per_sec",
                "peak_mem_mb",
                "prompt_tokens",
                "completion_tokens",
                "scores",
                "error",
            ],
        )
        if not exists:
            writer.writeheader()

        for r in results:
            row = asdict(r)
            row["scores"] = json.dumps(row["scores"]) if row["scores"] else None
            row.pop("response")
            writer.writerow(row)

def save_json(results: List[Result]):
    if os.path.isfile(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            try:
                existing = json.load(f)
            except json.JSONDecodeError:
                existing = []
    else:
        existing = []

    new_entries = [asdict(r) for r in results]
    combined = existing + new_entries

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

def print_summary(results: List[Result]):
    print("\n=== ACCURACY SUMMARY ===\n")
    by_model = {}
    for r in results:
        if r.error or not r.scores:
            continue
        by_model.setdefault(r.model, []).append(r)

    for model, rs in by_model.items():
        print(model)
        metrics = {}
        for r in rs:
            for k, v in r.scores.items():
                metrics.setdefault(k, []).append(v)
        for k, vals in metrics.items():
            print(f"  {k}: {sum(vals)/len(vals):.3f}")
        print()

TASKS = [
    {
        "task": "extraction",
        "gold": "Tenkan-sen, Kijun-sen, Senkou Span A, Senkou Span B, Chikou span",
    },
    {
        "task": "reasoning",
        "gold": (
            "Businesses obtain raw materials, land, and labor in the factor market. "
            "Individuals sell their labor and skills in exchange for compensation, "
            "and economists divide this market into three components."
        ),
    },
    {
        "task": "qa",
        "gold": (
            "A macro environment refers to the overall, broader economy and the external forces that affect it. "
            "Microenvironment, on the other hand, focuses on a specific sector or region."
            "In general, the macro environment includes trends in the gross domestic product (GDP), inflation, employment, spending, and monetary and fiscal policy."
            "The macro-environment is closely linked to the general business cycle as opposed to the performance of an individual business sector."
        ),
    },
]

async def main():
    prompts = [
        """The Ichimoku Kinko Hyo is a comprehensive technical indicator...
        Extract the core components of the Ichimoku indicator.Output as a comma-separated list only.""",
        """Businesses are the buyers in the factor market...
        Explain this concept in your own words using only the information above.""",
        """A macro environment refers to the overall, broader economy...
        What is the macro environment in economics, and what key factors does it include?""",
    ]

    models = [
        # {"name": "Base Model", "port": 8080, "model": "quantized/base"},
        # {"name": "Fine-Tuned Model", "port": 8081, "model": "quantized/model-fp16"},
        # {"name": "Quantized Q4 Model", "port": 8082,"model":"model"}
        ]

    results = []

    for m in models:
        client = AsyncOpenAI(
            base_url=f"http://localhost:{m['port']}/v1",
            api_key="dummy",
        )

        for i, (prompt, meta) in enumerate(zip(prompts, TASKS), 1):
            r = await run_prompt(
                client,
                m["name"],
                m["port"],
                prompt,
                i,
                meta["task"],
                meta["gold"],
                model=m["model"]
            )
            results.append(r)

    save_csv(results)
    save_json(results)
    print_summary(results)

if __name__ == "__main__":
    asyncio.run(main())