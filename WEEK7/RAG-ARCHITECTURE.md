# RAG Architecture

Local RAG pipeline for document ingestion, embedding generation, and retrieval using Qdrant vector store.

```
Documents → Load & Clean Documents → Create Chunks (500-800 tokens) → Embed Chunks → Use Qdrant to store vectors → Retrieve documents when query is invoked
```

## File Structure

```
src/
├── config/model.yaml          # Model configuration
├── data/                      # Contains raw data(pdfs), cleaned data, chunks
├── embeddings/embedder.py     # Embedding wrapper funtion
├── generator/llm_client.py    # LLM interface
├── pipelines/ingest.py        # Ingest pipeline
├── retriever/query_engine.py  # Query interface
└── vectorstore/
    ├── vectorstore.py         # Qdrant integration
    └── qdrant/                # Vector DB storage
```

## Core Components

### 1. Ingestion Pipeline (`pipelines/ingest.py`)
- Uses `unstructured` library for PDF parsing
- Extracts text, tables, and images
- Image extraction to `data/cleaned/images/`

**Chunking Strategy:**
- Preserves document structure
- Handles headers, paragraphs separately
- Token-based splitting: 690 tokens/chunk, 0 overlap

- Paragraph-level splitting
- Sub-chunks for large paragraphs (>250 words)

**Document/Chunk ID Generation:**
```python
chunk_id = uuid.uuid5(NAMESPACE, f"{source}|{page}|{text}")
```

### 2. Embedding Generation (`embeddings/embedder.py`)

```python
model_name: from EMBEDDING_MODEL # .env variable
device: cpu (configurable)
normalize_embeddings: True
```

### 3. Vector Store (`vectorstore/vectorstore.py`)
- Qdrant local file storage
- Collection: `embedded_data`
- Distance: COSINE
- Auto-creates collection with dynamic vector dimensions

### 4. Retriever (`retriever/query_engine.py`)
- Similarity search returning top-k chunks (default k=5)
- Returns Document objects with content + metadata

### 5. LLM Client (`generator/llm_client.py`)
- Manages local/API model access
- Provides tokenizer for chunking

## Configuration

**Model Config (config/model.yaml):**
```yaml
provider: local/api
model_name: MistralAI/Mistral-7B-instruct-v0.2
api_key_env: HF_TOKEN
```

## Environment Variables

```env
EMBEDDING_MODEL=<huggingface-model-id>
DATA_PATH=<raw-documents-path>
CLEAN_PATH=<cleaned-output-path>
CHUNKS_PATH=<chunks-output-path>
```

## Usage Example

```python
from src.pipelines.ingest import ingest
from src.retriever.query_engine import get_retriever

ingest()

retriever = get_retriever(k=5)
results = retriever.invoke("your query")