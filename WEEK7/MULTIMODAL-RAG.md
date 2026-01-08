# Multimodal RAG

## Image Pipeline Architecture

### Image Ingestion (`pipelines/image_ingest.py`)

**Processing Flow:**
```
Image File → OCR (Tesseract) + Caption (BLIP) → CLIP Embeddings → Qdrant
```

**Components:**
- **OCR**: pytesseract for text extraction
- **Captioning**: BLIP (`blip-image-captioning-base`)
- **Embeddings**: CLIP (`clip-vit-base-patch32`)

### CLIP Embeddings (`embeddings/clip_embedder.py`)

**Model Configuration:**
```python
model_name: "openai/clip-vit-base-patch32"
device: auto (cuda if available, else cpu)
projection_dim: 512 (CLIP output dimension)
```

**Dual Embedding Generation:**

```python
embed_image(image: Union[str, Path, Image.Image]) -> List[float]
embed_text(text: str) -> List[float] # for OCR and caption
```

### Image Processing Pipeline

**Filename Parsing:**
```python
element_type: "Table"
page: 66
index: 47
```

**Canonical Text Construction:**
```python
def build_canonical_text(caption: str, ocr_text: str) -> str:
    parts = []
    if caption:
        parts.append(f"Caption: {caption}")
    if ocr_text:
        parts.append(f"OCR: {ocr_text}")
    return "\n".join(parts)
```

**Vector Storage:**
```python
vectors = {
    "image_dense": clip.embed_image(img),        # Raw image embedding
    "image_text_dense": clip.embed_text(text)    # Text (caption+OCR) embedding
}
```

**Metadata Stored:**
```python
# Example Metadata
{
    "source": "src/data/cleaned/images/table-66-47.jpg",
    "page": 66,
    "element_type": "Table",
    "image_path": "src/data/cleaned/images/table-66-47.jpg",
    "index": 47,
    "caption": "a diagram showing financial metrics",
    "ocr": "Revenue $500M\nProfit $50M",
    "modality": "image"
}
```

### Batch Processing

```python
batch_size: 50
```

- Processes images in batches
- Upserts to Qdrant after each batch
- Memory efficient for large image sets

## Image Search Modes (`retriever/image_search.py`)

### 1. Text → Image Search

**Use Case:** Find images matching text description

```python
searcher.search_by_text(
    query="organizational hierarchy chart",
    limit=5
)

```
- Uses: image_text_dense vector
- Searches against: Caption + OCR text embeddings

**Implementation:**
```python
query_vec = clip.embed_text(query)
qdrant.query_points(
    query=query_vec,
    using="image_text_dense",  # Search text-based image embeddings
    limit=limit
)
```

### 2. Image → Image Search

**Use Case:** Find similar images (visual similarity)

```python
searcher.search_by_image(
    image=Path("logo.jpg"),
    limit=15
)
```
- Uses: image_dense vector
- Searches against: Raw image embeddings


**Implementation:**
```python
query_vec = clip.embed_image(img)
qdrant.query_points(
    query=query_vec,
    using="image_dense",  # Search image embeddings
    limit=limit
)
```

### 3. Image → Text Search

**Use Case:** Find images and retrieve associated text/context

```python
searcher.search_image_to_text(
    image=Path("image.jpg"),
    limit=15
)
```
- Uses: image_dense vector
- Searches against: image_text_dense (caption+OCR embeddings)
- Cross-modal retrieval: image query → text results

## Multimodal Vector Store

**Qdrant Collection Schema:**
```python
Collection: "embedded_data"

vectors_config = {
    "dense": text embeddings (document chunks),
    "image_dense": CLIP image embeddings,
    "image_text_dense": CLIP text embeddings (caption+OCR)
}
```

**Search Strategy by Mode:**
| Mode | Query Type | Vector Used | Results |
|------|-----------|-------------|---------|
| Text→Image | Text | image_text_dense | Images with matching captions/OCR |
| Image→Image | Image | image_dense | Visually similar images |
| Image→Text | Image | image_text_dense | Images (cross-modal) |


## Usage Examples

### Ingest Images

```python
from pipelines.image_ingest import ingest_images
ingest_images()
```

### Search Operations

```python
from retriever.image_search import ImageSearcher
from PIL import Image

searcher = ImageSearcher()
results = searcher.search_by_text("financial table", limit=5)

img = Image.open("test.jpg")
results = searcher.search_by_image(img, limit=10)

results = searcher.search_image_to_text(img, limit=10)

for r in results:
    print(f"Score: {r['score']}")
    print(f"Caption: {r['caption']}")
    print(f"OCR: {r['ocr']}")
    print(f"Source: {r['source']}")
```