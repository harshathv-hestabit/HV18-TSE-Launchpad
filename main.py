'''
Day 1 

Scrapped Data from investopedia. Scrapped over 150 pages, 15 articles over 10 categories
then proceeded to clean the raw data
created a instruction dataset with over 3400 samples

'''


# from pathlib import Path
# import json
# from util.instruction_generator import InstructionGenerator, save_jsonl
# from util.data_cleaner import DataCleaner
# from sklearn.model_selection import train_test_split
# import matplotlib.pyplot as plt
# import pandas as pd
# from tqdm import tqdm

# def compute_token_lengths(dataset):
#     lengths = []
#     for sample in tqdm(dataset, desc="Calculating token lengths"):
#         text = sample["input"] + " " + sample["output"]
#         length = len(text.split())
#         lengths.append(length)
#     return lengths

# raw_path = Path('data/raw/investopedia_articles.jsonl')
# raw_articles = []
# with open(raw_path, 'r', encoding='utf-8') as f:
#     for line in f:
#         raw_articles.append(json.loads(line))
# print(f"Loaded {len(raw_articles)} raw articles from {raw_path}")

# cleaner = DataCleaner()
# cleaned_articles =[]
# for article in raw_articles:
#     cleaned_articles.append(cleaner.clean_article(article))
# clean_path = Path('data/clean/investopedia_articles_clean.jsonl')
# save_jsonl(cleaned_articles, clean_path)
# print(f"Cleaned {len(cleaned_articles)} articles saved to {clean_path}")

# instr_gen = InstructionGenerator()
# dataset = instr_gen.generate_dataset(cleaned_articles)
# print(f"Generated {len(dataset)} instruction samples")

# lengths = compute_token_lengths(dataset)

# plt.figure(figsize=(10,5))
# plt.hist(lengths, bins=50, color='skyblue', edgecolor='black')
# plt.title("Distribution of Input+Output Lengths (word count)")
# plt.xlabel("Word Count")
# plt.ylabel("Number of Samples")
# plt.grid(True, alpha=0.3)
# plt.tight_layout()
# plt.savefig("token_length_distribution.png")

# max_len = int(pd.Series(lengths).quantile(0.99))
# dataset = [d for i, d in enumerate(dataset) if lengths[i] <= max_len]
# print(f"Removed outliers. Dataset now has {len(dataset)} samples")

# train_data, val_data = train_test_split(dataset, test_size=0.1, random_state=42)

# save_jsonl(train_data, 'data/train.jsonl')
# save_jsonl(val_data, 'data/val.jsonl')
# print(f"Saved {len(train_data)} train samples and {len(val_data)} validation samples")

'''
Day 3
'''

# from transformers import AutoTokenizer

# tok = AutoTokenizer.from_pretrained(
#     "results/w8d3_artifacts/merged_model_fp16",
#     trust_remote_code=True
# )

# print(tok.encode("Hello!"))
# print(tok.decode(tok.encode("Hello!")))

'''
Day 4
'''
import openai

openai.base_url = "http://localhost:8081/v1/"
openai.api_key = "sk-no-key-required"

# response = openai.chat.completions.create(
#     model="results/w8d3_artifacts/merged_model_fp16",
#     messages=[
#         {"role": "user", "content": "Hello!"}
#     ],
# )

prompt = """You are an AI assistant.

User: Hello. My name is Harshath. Can I know more about you?
Assistant:"""

response = openai.completions.create(
    model="results/w8d3_artifacts/merged_model_fp16",
    prompt=prompt,
    max_tokens=200,
    temperature=0.2,
)

print(response.choices[0].text)

with open("response.txt", "w", encoding="utf-8") as f:
    f.write(response.choices[0].text)