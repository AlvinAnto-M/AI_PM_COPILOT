def detect_intent(question: str) -> str:
    """
    Detect what the Product Manager is asking.
    """

    q = question.lower()

    # PRD
    if "prd" in q or "product requirement" in q:
        return "prd"

    # User Stories
    if "user story" in q or "user stories" in q:
        return "user_story"

    # Acceptance Criteria
    if "acceptance criteria" in q:
        return "acceptance"

    # Feature Prioritization
    if "prioritize" in q or "priority" in q:
        return "priority"

    # Product Roadmap
    if "roadmap" in q:
        return "roadmap"

    # High Priority Issues
    if "high priority" in q or "critical issue" in q:
        return "high_priority"

    # Feedback Summary
    if "summary" in q or "summarize" in q:
        return "summary"

    # Recommendations
    if "recommend" in q or "recommendation" in q:
        return "recommendation"

    # Cluster Analysis
    if "cluster" in q:
        return "cluster"

    return "general"