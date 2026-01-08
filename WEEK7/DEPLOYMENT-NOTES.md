# Deployment Notes

## System Architecture

**Backend:** FastAPI (`deployment/app.py`)

**Frontend:** Streamlit (`deployment/streamlit_ui.py`)

**Vector DB:** Qdrant (Docker container on port 6333)

**LLM:** Configurable (local/API via `config/model.yaml`)

## Prerequisites

### 1. Environment Setup

```bash
DATA_PATH="src/data/raw"
CLEAN_PATH="src/data/cleaned"
CHUNKS_PATH="src/data/chunks"
EMBEDDING_MODEL="BAAI/bge-small-en-v1.5"
VECTORSTORE_PATH="src/vectorstore/qdrant"
HF_TOKEN="huggingface_token"
```

### 2. Model Configuration

```yaml
provider: api                          
model_name: MistralAI/Mistral-7B-Instruct-v0.2 
```

### 3. Qdrant Setup

```bash
docker run -p 6333:6333 qdrant/qdrant
```

## API Endpoints

### 1. `/ask` - Text RAG

**Purpose:** Answer questions from document corpus

**Implementation Details:**
```python
1. Add question to memory (last 5 turns)
2. Hybrid retrieval (top_k=5)
3. Build context from retrieved docs
4. Generate draft answer
5. Refine answer (hallucination check)
6. Calculate confidence score
7. Store in memory + log to file
```

### 2. `/ask-image` - Multimodal RAG

**Purpose:** Query images using text or image input

**Request:**
```python
question: str
mode: "text" | "image" | "image_to_text"
file: Optional[UploadFile]
```

**Modes:**

| Mode | Input | Search Vector | Output |
|------|-------|---------------|--------|
| text | Question text | image_text_dense | Matching images |
| image | Uploaded image | image_dense | Similar images |
| image_to_text | Uploaded image | image_text_dense | Related images (cross-modal) |

**Response:**
```json
{
    "answer": "This image shows...",
    "confidence": 0.9,
    "matches": [
        {
            "id": "uuid",
            "score": 0.95,
            "image_path": "src/data/cleaned/images/figure-1-1.jpg",
            "caption": "logo for downer",
            "ocr": "Downer\nRelationships creating success",
            "source": "...",
            "page": 1
        }
    ]
}
```

**Context Building:**
```python
def build_context(results):
```
- Aggregates: page_content, caption, OCR, source
- Filters empty fields
- Joins with " | " separator

### 3. `/ask-sql` - SQL QA

**Purpose:** Natural language → SQL → Answer

**Pipeline:**
```python
1. Generate SQL from question + schema
2. Validate SQL (safety checks)
3. Execute query safely
4. Summarize results
5. LLM generates natural language answer
6. Calculate confidence score
```

## Memory Management (`memory/memory_store.py`)

### Implementation

```python
class MemoryStore:
    def __init__(self, k: int = 5):
        self.k = k
        self.buffer = deque(maxlen=k * 2)
```

**Methods:**
```python
add_user(text: str)       
add_assistant(text: str)  
get() -> List[Dict]       
clear()                  
```

**Window Behavior:**
- Stores last 5 exchanges (10 messages total)
- FIFO eviction (oldest removed first)
- Per-session, in-memory only

## Evaluation Metrics (`evaluation/rag_eval.py`)

### 1. Context Coverage

**Purpose:** Measure answer grounding in retrieved context

```python
def context_coverage(answer: str, docs: List[Document]) -> float:
    answer_tokens = set(re.findall(r"\b\w+\b", answer.lower()))
    context_text = " ".join(d.page_content for d in docs).lower()
    hits = sum(1 for token in answer_tokens if token in context_text)
    return hits / len(answer_tokens)
```

**Interpretation:**
- 1.0 = All answer tokens found in context (perfect grounding)
- 0.5 = Half the answer tokens in context
- 0.0 = No overlap (likely hallucination)

### 2. Hallucination Score

```python
def hallucination_score(answer: str, docs: List[Document]) -> float:
    coverage = context_coverage(answer, docs)
    return 1.0 - coverage
```

**Example:**
- Coverage 0.85 → Hallucination 0.15 (15% unsupported)
- Coverage 0.40 → Hallucination 0.60 (60% unsupported)

### 3. Answer Refinement

**Purpose:** Self-critique and correction

```python
def refine_answer(llm, question: str, draft: str, docs: List[Document]) -> str:
    prompt = f"""
    Review this answer for factual grounding.
    
    Question: {question}
    Context: {context}
    Draft: {draft}
    
    If draft contains unsupported claims, correct them.
    Otherwise, improve clarity without adding facts.
    """
    return llm(prompt)
```

## Logging System

### Chat Logs (`logs/CHAT-LOGS.json`)

**Format:** JSONL (one JSON object per line)

```json
{
    "id": "uuid-v4",
    "endpoint": "/ask",
    "question": "user question",
    "answer": "system response",
    "context": "retrieved context",
    "confidence": 0.85,
    "hallucination_score": 0.15,
    "latency_ms": 5432
}
```

**Usage:**
```python
def log_event(payload: dict):
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(payload) + "\n")
```

### Memory Logs (`logs/memory.json`)

**Purpose:** Track conversation history (for debugging)

```json
{
    "role": "user",
    "content": "What is X?",
    "ts": 1704718800.0
}
```

## Running the System

### 1. Data Ingestion

```bash
python src/pipelines/ingest.py
python src/pipelines/image_ingest.py
```

### 2. Start Qdrant

```bash
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
```

### 3. Start FastAPI Backend

```bash
cd src
uvicorn deployment.app:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Start Streamlit UI

```bash
cd src
streamlit run deployment/streamlit_ui.py
```