from typing import List
from pydantic import BaseModel,Field

class Task(BaseModel):
    id: str
    topic: str
    instruction: str
    depends_on: list[str] = Field(default_factory=list)
    # inputs: dict[str, str] = Field(default_factory=dict)

class ExecutionPlan(BaseModel):
    goal: str
    entry_task_id: str
    tasks: List[Task]