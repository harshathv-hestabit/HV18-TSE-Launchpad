from enum import Enum
from autogen_core import TopicId

class IncomingTopics(Enum):
    ANALYST = TopicId(type="analysis", source="orchestrator")
    CODER = TopicId(type="coding", source="orchestrator")
    CRITIC = TopicId(type="critic", source="orchestrator")
    OPTIMIZER = TopicId(type="optimizer", source="orchestrator")
    PLANNER = TopicId(type="planning", source="orchestrator")
    REPORTER = TopicId(type="reporting", source="orchestrator")
    RESEARCHER = TopicId(type="research", source="orchestrator")
    VALIDATOR = TopicId(type="validated", source="orchestrator")