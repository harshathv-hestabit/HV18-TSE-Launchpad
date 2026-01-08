# Retrieval Strategies

## Hybrid Retrieval Implementation

### Core Architecture (`retriever/hybrid_retriever.py`)

**Multi-stage Retrieval:**
```python
1. Vector Search (Qdrant)
   → Semantic similarity (dense vectors)
   → Keyword matching (BM25 sparse vectors)
   
2. Metadata Filtering
   → Qdrant filter conditions
   → Fallback to unfiltered search if no results
   
3. Cross-Encoder Reranking
   → Page-level scoring
   → Returns top-N pages worth of chunks
```

### Qdrant Hybrid Search

**Configuration:**
```python
RetrievalMode: HYBRID

Vectors used:
- dense: HuggingFace embeddings (semantic)
- sparse: BM25 embeddings (keyword)

Automatic fusion of both scores by QdrantVectorStore
```

### Metadata Filtering

**Dynamic Filter Construction:**
```python
def build_qdrant_filter(filters: Dict[str, Any]) -> Filter:
    filters = {
        "year": "2024",
        "element_type": "Table"
    }
```

**Fallback Strategy:**
```python
if not results:
    fallback_retriever = get_hybrid_retriever(top_k=top_k, filters=None)
    results = fallback_retriever.invoke(query)
```

## Reranking Strategy (`retriever/reranker.py`)

### Cross-Encoder Reranking

**Page-Level Scoring:**

```python
pages = defaultdict(list)
for doc in docs:
    key = (doc.metadata["source"], doc.metadata["page"])
    pages[key].append(doc)

page_text = "\n".join(chunk.page_content for chunk in page_chunks)
scores = cross_encoder.predict([(query, page_text) for page in pages])
top_chunks = [chunk for page in top_N_pages for chunk in page.chunks]
```

- Preserves context across chunk boundaries
- Reduces noise from irrelevant chunks in same page

## Context Building (`pipelines/context_builder.py`)

### Text Processing Pipeline

**Noise Removal:**
```python
- Strip page numbers (^\d+\s*$)
- Normalize excessive newlines (\n{3,} → \n\n)
```

### Output Format

```python
separator: "\n\n---\n\n"

[SOURCE: file.pdf | PAGE: 5]
<formatted text>
```

## Deduplication
- Page-level grouping in reranker
- UUID5-based chunk IDs prevent duplicate ingestion
- Cross-encoder naturally ranks relevant pages higher
- Chunk IDs also used to prevent deduplication in retrieved results

## Query Engine (`retriever/query_engine.py`)

**Basic Retriever:**
```python
def get_retriever(k: int = 5):
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k}
    )
```

## Usage Example

```python
from retriever.hybrid_retriever import hybrid_retrieve
from pipelines.context_builder import ContextBuilder

docs = hybrid_retrieve(
    query="Explain Downer's safety policies",
    top_k=5
)

builder = ContextBuilder(
    max_pages=5,
    max_chars_per_page=1500
)
context = builder.build(docs)
```

## Response Details
All retrieved documents include:
- `source`: Original file path
- `page`: Page number
- `element_type`: Content type (Text, Table, etc.)
- Full chunk content preserved after reranking