import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

class DataCleaner:
    def __init__(self):
        self.html_tags = re.compile(r"<.*?>")
        self.multispace = re.compile(r"\s+")
        self.quote_normalize = lambda text: text.replace("“", '"').replace("”", '"').replace("’", "'")

    def load_data(self, file_path: str) -> List[Dict[str, Any]]:
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File {file_path} not found")

        articles = []
        if file_path.suffix == ".jsonl":
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    articles.append(json.loads(line))
        else:
            with open(file_path, "r", encoding="utf-8") as f:
                articles = json.load(f)
        return articles

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        text = self.html_tags.sub("", text)
        text = self.quote_normalize(text)
        text = self.multispace.sub(" ", text)
        text = text.strip()
        return text

    def clean_article(self, article: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        article["title"] = self.clean_text(article.get("title", ""))
        article["definition"] = self.clean_text(article.get("definition", ""))
        article["paragraphs"] = [self.clean_text(p) for p in article.get("paragraphs", []) if self.clean_text(p)]
        article["key_takeaways"] = [self.clean_text(k) for k in article.get("key_takeaways", []) if self.clean_text(k)]
        article["faqs"] = [
            {"question": self.clean_text(f.get("question", "")), "answer": self.clean_text(f.get("answer", ""))}
            for f in article.get("faqs", [])
            if self.clean_text(f.get("question", "")) and self.clean_text(f.get("answer", ""))
        ]
        article["full_text"] = " ".join(article["paragraphs"])

        if not article["full_text"]:
            return None

        return article

    def clean_dataset(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        cleaned = []
        removed_count = 0
        for a in articles:
            cleaned_article = self.clean_article(a)
            if cleaned_article:
                cleaned.append(cleaned_article)
            else:
                removed_count += 1

        print(f"Total articles: {len(articles)}, Removed: {removed_count}, Cleaned: {len(cleaned)}")
        return cleaned

    def save_cleaned_data(self, articles: List[Dict[str, Any]], output_path: str):
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            for article in articles:
                f.write(json.dumps(article, ensure_ascii=False) + "\n")
        print(f"Saved {len(articles)} cleaned articles to {output_path}")

    def summary_report(self, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        total_paragraphs = sum(len(a.get("paragraphs", [])) for a in articles)
        total_faqs = sum(len(a.get("faqs", [])) for a in articles)
        total_takeaways = sum(len(a.get("key_takeaways", [])) for a in articles)

        report = {
            "total_articles": len(articles),
            "average_paragraphs": total_paragraphs / len(articles) if articles else 0,
            "average_faqs": total_faqs / len(articles) if articles else 0,
            "average_key_takeaways": total_takeaways / len(articles) if articles else 0
        }
        return report

if __name__ == "__main__":
    cleaner = DataCleaner()
    articles = cleaner.load_data("data/raw/hestabit.jsonl")
    cleaned = cleaner.clean_dataset(articles)
    cleaner.save_cleaned_data(cleaned, "data/clean/hestabit_cleaned.jsonl")
    report = cleaner.summary_report(cleaned)
    print("Summary:", report)