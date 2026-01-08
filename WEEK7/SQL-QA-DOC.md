# SQL Question Answering System

## Architecture Overview

**Pipeline Flow:**
```
User Query → SQL Generation → Validation → Execution → Summarization → LLM Answer
```

## Components

### 1. Schema Loader (`utils/schema_loader.py`)

**Purpose:** Extract database schema for LLM context

```python
class SchemaLoader:
    def load_schema(self) -> Dict[str, List[str]]:
```

### 2. SQL Generator (`generator/sql_generator.py`)

**LLM-based SQL Generation:**

```python
class SQLGenerator:
    def generate(self, question: str, schema: dict) -> str
```

### 3. SQL Validator
```python
class SQLValidator:
    FORBIDDEN = re.compile(r"\b(drop|delete|update|insert|alter)\b", re.I)
    
    @staticmethod
    def validate(sql: str) -> None:
        if FORBIDDEN.search(sql):
            raise ValueError("Unsafe SQL detected")
        if not sql.lower().startswith("select"):
            raise ValueError("Only SELECT queries are allowed")
```

### 4. Safe Executor
```python
class SafeExecutor:
    def execute(self, sql: str):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(sql)
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
        return columns, rows
```

### 5. Result Summarizer

```python
class ResultSummarizer:
    @staticmethod
    def summarize(columns, rows) -> str:
```

**Empty Results Handling:**
```python
if not rows:
    return "No results found."
```

## SQL Pipeline Integration (`pipelines/sql_pipeline.py`)

```python
class SQLQAPipeline:
    def __init__(self, db_path: str, llm):
        self.schema = SchemaLoader(db_path).load_schema()
        self.generator = SQLGenerator(llm)
        self.executor = SafeExecutor(db_path)
        self.llm = llm
```

### Execution Flow

```python
def run(self, question: str) -> dict:
    sql = self.generator.generate(question, self.schema)
    SQLValidator.validate(sql)
    columns, rows = self.executor.execute(sql)
    
    summarized = ResultSummarizer.summarize(columns, rows)
    
    final_answer = self.llm(f"""
        User question: {question}
        SQL result summary: {summarized}
        
        Provide a clear answer in natural language.
        Do not mention SQL.
    """)
    
    confidence = self._calculate_confidence(question, summarized, final_answer)
    
    return {
        "answer": final_answer,
        "confidence": confidence,
        "context": summarized
    }
```

## Usage Examples

### Setup

```python
from pipelines.sql_pipeline import SQLQAPipeline
from generator.llm_client import LLM, LLMCallable

llm_client = LLM(config).get_model()
llm = LLMCallable(llm_client, config["model_name"])

pipeline = SQLQAPipeline(
    db_path="financial_reports.db",
    llm=llm
)
```

### Queries

```python
result = pipeline.run("What is the total revenue in 2022?")
```

### Debug Output

The pipeline prints detailed logs:

```
============================================================
ORIGINAL QUESTION
============================================================
What is the net assets disposed in 2022?

============================================================
GENERATED SQL
============================================================
SELECT net_assets_disposed FROM financial_reports WHERE year = 2022;

============================================================
RAW RESULTS
============================================================
Columns: ['net_assets_disposed']
Rows:
(1277.0,)

============================================================
SUMMARIZED RESULTS
============================================================
net_assets_disposed: 1277.0

============================================================
LLM FINAL ANSWER
============================================================
The net assets disposed in 2022 amounted to 1,277.0.

CONFIDENCE SCORE: 0.5
```