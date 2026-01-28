import json
import random
from typing import List, Dict, Any
from pathlib import Path

QA_INSTRUCTION = (
    "You are a financial knowledge assistant. "
    "Answer the question strictly using the provided context."
)

REASONING_INSTRUCTION = (
    "You are a financial reasoning assistant. "
    "Explain the answer using only the information in the context."
)

EXTRACTION_INSTRUCTION = (
    "You are an information extraction assistant. "
    "Extract only what is explicitly requested."
)

class InstructionGenerator:
    def __init__(self, seed: int = 42, max_context_paragraphs: int = 3):
        random.seed(seed)
        self.max_context_paragraphs = max_context_paragraphs

    def generate_qa(self, article: Dict[str, Any]) -> List[Dict]:
        samples = []
        text = article.get("full_text", "")
        title = article.get("title", "this concept")

        if article.get("definition"):
            for template in [
                f"What is {title}?",
                f"Define {title}.",
                f"Give a short description of {title}."
            ]:
                samples.append({
                    "instruction": QA_INSTRUCTION,
                    "input": f"Context:\n{text}\n\nQuestion:\n{template}",
                    "output": article["definition"]
                })

        for faq in article.get("faqs", []):
            samples.append({
                "instruction": QA_INSTRUCTION,
                "input": f"Context:\n{text}\n\nQuestion:\n{faq['question']}",
                "output": faq["answer"]
            })
            samples.append({
                "instruction": QA_INSTRUCTION,
                "input": f"Context:\n{text}\n\nQuestion:\nExplain why: {faq['question']}",
                "output": faq["answer"]
            })

        return samples

    def generate_reasoning(self, article: Dict[str, Any]) -> List[Dict]:
        samples = []
        paragraphs = article.get("paragraphs", [])

        for i in range(len(paragraphs)):
            start = max(0, i - self.max_context_paragraphs + 1)
            context = " ".join(paragraphs[start:i+1])
            samples.append({
                "instruction": REASONING_INSTRUCTION,
                "input": (
                    f"Context:\n{context}\n\n"
                    "Question:\nExplain this concept in your own words."
                ),
                "output": paragraphs[i]
            })

        return samples

    def generate_extraction(self, article: Dict[str, Any]) -> List[Dict]:
        samples = []
        text = article.get("full_text", "")

        if article.get("definition"):
            samples.append({
                "instruction": EXTRACTION_INSTRUCTION,
                "input": f"Text:\n{text}\n\nTask:\nExtract the definition.",
                "output": article["definition"]
            })

        example_paragraphs = [
            p for p in article.get("paragraphs", [])
            if any(k in p.lower() for k in ["for example", "for instance", "such as"])
        ]
        if example_paragraphs:
            samples.append({
                "instruction": EXTRACTION_INSTRUCTION,
                "input": f"Text:\n{text}\n\nTask:\nExtract examples mentioned.",
                "output": "\n".join(f"- {p}" for p in example_paragraphs)
            })

        if article.get("key_takeaways"):
            samples.append({
                "instruction": EXTRACTION_INSTRUCTION,
                "input": f"Text:\n{text}\n\nTask:\nExtract key takeaways.",
                "output": "\n".join(f"- {k}" for k in article["key_takeaways"])
            })

        return samples

    def generate_dataset(self, articles: List[Dict[str, Any]]) -> List[Dict]:
        dataset = []

        for article in articles:
            dataset.extend(self.generate_qa(article))
            dataset.extend(self.generate_reasoning(article))
            dataset.extend(self.generate_extraction(article))

        random.shuffle(dataset)
        return dataset


def save_jsonl(data: List[Dict], path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for row in data:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")