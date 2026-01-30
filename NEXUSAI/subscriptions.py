from autogen_core import TypeSubscription
from topics import IncomingTopics

PLANNED_SUBSCRIPTIONS = [
    TypeSubscription(topic_type=IncomingTopics.ANALYST.value.type,agent_type="ANALYST",),
    TypeSubscription(topic_type=IncomingTopics.CODER.value.type,agent_type="CODER",),
    TypeSubscription(topic_type=IncomingTopics.CRITIC.value.type,agent_type="CRITIC",),
    TypeSubscription(topic_type=IncomingTopics.OPTIMIZER.value.type,agent_type="OPTIMIZER",),
    TypeSubscription(topic_type=IncomingTopics.PLANNER.value.type,agent_type="PLANNER",),
    TypeSubscription(topic_type=IncomingTopics.REPORTER.value.type,agent_type="REPORTER",),
    TypeSubscription(topic_type=IncomingTopics.RESEARCHER.value.type,agent_type="RESEARCHER",),
    TypeSubscription(topic_type=IncomingTopics.VALIDATOR.value.type,agent_type="VALIDATOR",)
]