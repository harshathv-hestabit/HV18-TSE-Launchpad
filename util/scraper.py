import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path
from typing import List, Dict, Any
from urllib.parse import urljoin
import random


class Scraper:
    def __init__(self, delay: float = 1.0):
        self.base_url = "https://www.hestabit.com/"
        self.delay = delay
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def get_page(self, url: str) -> BeautifulSoup:
        try:
            time.sleep(self.delay)
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def scrape_term_article(self, url: str) -> Dict[str, Any]:
        soup = self.get_page(url)
        if not soup:
            return None

        try:
            title_tag = soup.find('h1')
            title = title_tag.get_text().strip() if title_tag else ""

            article_body = soup.find('div', {'id': 'mntl-sc-page_1-0'})
            if not article_body:
                article_body = soup.find('article')

            if not article_body:
                print(f"Could not find article body for {url}")
                return None

            paragraphs = []
            for p in article_body.find_all('p'):
                text = p.get_text().strip()
                if text and len(text) > 20:
                    paragraphs.append(text)

            key_takeaways = []
            takeaway_section = soup.find('div',{'class': 'comp mntl-sc-block finance-sc-block-callout mntl-block'})
            if takeaway_section:
                for li in takeaway_section.find_all('li'):
                    key_takeaways.append(li.get_text().strip())

            definition = paragraphs[0] if paragraphs else ""

            faqs = []
            faq_section = soup.find_all('div', {'class': 'mntl-sc-block-questionandanswer'})
            for faq in faq_section[:3]:
                question = faq.find('span',{'class': 'mntl-sc-block-questionandanswer__question'})
                answer = faq.find('div',{'class': 'mntl-sc-block-questionandanswer__answer'})
                if question and answer:
                    faqs.append({'question': question.get_text().strip(),'answer': answer.get_text().strip()})

            return {
                'url': url,
                'title': title,
                'definition': definition,
                'paragraphs': paragraphs,
                'key_takeaways': key_takeaways,
                'faqs': faqs,
                'full_text': ' '.join(paragraphs)
            }

        except Exception as e:
            print(f"Error parsing article {url}: {e}")
            return None

    def get_term_urls(self, category: str = 's', limit: int = 50) -> List[str]:
        terms_url = f"{self.base_url}/terms/{category}/"
        soup = self.get_page(terms_url)
        if not soup:
            return []

        urls = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/terms/' in href and href.endswith('.asp'):
                full_url = urljoin(self.base_url, href)
                if full_url not in urls:
                    urls.append(full_url)
                    if len(urls) >= limit:
                        break

        print(f"Found {len(urls)} term URLs in category '{category}'")
        return urls

    def scrape_multiple_terms(self,categories: List[str],articles_per_category: int = 20) -> List[Dict[str, Any]]:
        all_articles = []

        for category in categories:
            print(f"\n--- Scraping category '{category}' ---")
            urls = self.get_term_urls(category, limit=articles_per_category)

            for url in urls:
                article = self.scrape_term_article(url)
                if article:
                    all_articles.append(article)
                time.sleep(self.delay + random.uniform(0, 0.5))

        print(f"\nTotal articles scraped: {len(all_articles)}")
        return all_articles

    def save_raw_data_jsonl(self, articles: List[Dict[str, Any]], output_path: str) -> None:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            for article in articles:
                f.write(json.dumps(article, ensure_ascii=False) + '\n')

        print(f"Saved {len(articles)} articles to {output_path}")


def main():
    print("SCRAPER")
    scraper = Scraper(delay=2)

    categories = ['s', 'b', 'o', 'i', 'r', 'c', 'd', 'e', 'f', 'm']
    articles = scraper.scrape_multiple_terms(categories=categories,articles_per_category=15)
    scraper.save_raw_data_jsonl(articles,'data/raw/hestabit.jsonl')

    if articles:
        sample = articles[0]
        print("\nSAMPLE ARTICLE")
        print(f"Title: {sample['title']}")
        print(f"URL: {sample['url']}")
        print(f"Definition: {sample['definition'][:200]}...")
        print(f"Paragraphs: {len(sample['paragraphs'])}")
        print(f"Key Takeaways: {len(sample['key_takeaways'])}")
        print(f"FAQs: {len(sample['faqs'])}")

if __name__ == "__main__":
    main()