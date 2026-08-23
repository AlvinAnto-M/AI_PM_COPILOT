import json
import os

import google.generativeai as genai
from dotenv import load_dotenv


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured."
    )

genai.configure(
    api_key=GEMINI_API_KEY
)


# ============================================================
# Gemini Model
# ============================================================

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


# ============================================================
# Helper
# ============================================================

def clean_json_response(text: str) -> str:
    """
    Remove Markdown code fences if Gemini returns JSON
    inside ```json ... ``` blocks.
    """

    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]

    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


# ============================================================
# Generate Product Strategy
# ============================================================

def generate_product_strategy(
    cluster_id: int,
    theme: str,
    feedback: list[str],
    feedback_count: int,
    high_priority: int,
    medium_priority: int,
    low_priority: int,
    escalated_count: int,
    priority_score: float = 0.0,
    rice_score: float = 0.0,
    reach: int = 0,
    impact: float = 0.0,
    confidence: float = 0.0,
    effort: int = 0,
    trends: list | dict | None = None
):
    """
    Generate an evidence-based Product Strategy Report
    for one customer feedback cluster.

    The strategy is generated ONLY from the supplied
    cluster information and customer feedback.
    """

    # ========================================================
    # Prepare Customer Feedback
    # ========================================================

    feedback_text = "\n".join(
        f"- {str(item)}"
        for item in feedback
        if str(item).strip()
    )

    if not feedback_text:
        feedback_text = (
            "No individual customer feedback text is available."
        )

    # ========================================================
    # Prepare Trend Information
    # ========================================================

    if trends is None:
        trends_text = "No specific trend information available."

    elif isinstance(trends, dict):

        trends_text = json.dumps(
            trends,
            indent=2,
            ensure_ascii=False
        )

    else:

        trends_text = "\n".join(
            f"- {str(item)}"
            for item in trends
        )

    # ========================================================
    # Build Prompt
    # ========================================================

    prompt = f"""
You are an experienced Senior Product Manager.

Generate an evidence-based Product Strategy Report for the
customer feedback cluster provided below.

The strategy MUST be specific to this cluster.

Do NOT generate a generic product strategy.

Do NOT invent facts, statistics, customer problems, competitors,
market information, product capabilities, or business information
that is not supported by the supplied evidence.

If the available evidence is insufficient for a particular section,
state that clearly instead of making assumptions.

============================================================
CLUSTER INFORMATION
============================================================

Cluster ID:
{cluster_id}

Cluster Theme:
{theme}

Feedback Count:
{feedback_count}

============================================================
PRIORITY INFORMATION
============================================================

High Priority Feedback:
{high_priority}

Medium Priority Feedback:
{medium_priority}

Low Priority Feedback:
{low_priority}

Average Priority Score:
{priority_score}

Escalated Issues:
{escalated_count}

============================================================
RICE INFORMATION
============================================================

RICE Score:
{rice_score}

Reach:
{reach}

Impact:
{impact}

Confidence:
{confidence}

Effort:
{effort}

============================================================
TREND INFORMATION
============================================================

{trends_text}

============================================================
CUSTOMER FEEDBACK
============================================================

{feedback_text}

============================================================
OBJECTIVE
============================================================

Create a Product Strategy Report that explains:

1. What customer problem is occurring.
2. Why the problem matters.
3. What product outcome should be pursued.
4. What strategic direction should be followed.
5. What high-level product initiatives could address the problem.
6. How success should be measured.
7. What risks should be considered.
8. What the product team should do next.

============================================================
REPORT REQUIREMENTS
============================================================

Generate the following sections.

1. Executive Summary

Provide a concise overview of the cluster, customer problem,
severity, and strategic importance.

2. Problem Definition

Clearly explain the core customer problem identified from the
feedback.

3. Customer Pain Points

Identify the major recurring pain points found in the feedback.

Generate 3 to 5 pain points when the evidence supports them.

4. Customer Evidence

Summarize the evidence supporting the strategy.

Include:

- Feedback volume
- Priority distribution
- Escalations
- Relevant RICE information
- Important recurring feedback patterns

Do not invent numerical values.

5. Strategic Importance

Explain why this issue deserves product attention.

Consider:

- Feedback volume
- Priority
- Customer impact
- Escalations
- RICE
- Recurring patterns

Only mention factors supported by the supplied data.

6. Product Goal

Define ONE clear product-level goal.

The goal should describe the desired customer or product
outcome, not a technical implementation.

7. Strategic Objectives

Generate 3 to 5 strategic objectives.

Objectives should describe measurable product outcomes.

8. Recommended Product Strategy

Describe the recommended strategic direction.

Explain how the product team should approach the problem
at a high level.

Do NOT provide detailed technical implementation.

9. Key Product Initiatives

Generate 3 to 5 high-level product initiatives.

Each initiative must include:

- Title
- Description
- Expected customer benefit

These initiatives should be suitable for later conversion
into PRDs and user stories.

10. Success Metrics

Generate 4 to 6 meaningful success metrics.

Prefer measurable outcomes such as:

- Reduction in complaints
- Reduction in failures
- Improvement in completion
- Reduction in escalations
- Improvement in customer satisfaction

Do NOT invent baseline or target numbers unless they exist
in the supplied evidence.

11. Risks & Considerations

Generate 3 to 5 realistic product risks or considerations
based on the identified problem.

Avoid unrelated technical risks.

12. Expected Customer Impact

Explain the expected customer benefits if the strategy
is successfully implemented.

13. Recommended Next Steps

Generate 4 to 6 practical next steps.

The next steps should connect naturally with the rest of
the Product Manager Copilot workflow:

Strategy
→ PRD
→ User Stories
→ Acceptance Criteria
→ Prioritization
→ Roadmap

============================================================
IMPORTANT DISTINCTION
============================================================

This is a PRODUCT STRATEGY report.

Do NOT turn it into a PRD.

Do NOT generate:

- API specifications
- Database schemas
- Technical architecture
- Code
- Detailed implementation tasks

Do NOT generate detailed user stories.

Do NOT create a sprint-by-sprint roadmap.

Do NOT replace the RICE prioritization system.

The purpose of this report is strategic decision-making.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT wrap the JSON in ```json fences.

Use exactly this structure:

{{
    "cluster_id": {cluster_id},

    "theme": "{theme}",

    "executive_summary": "",

    "problem_definition": "",

    "customer_pain_points": [
        ""
    ],

    "customer_evidence": {{
        "feedback_count": {feedback_count},
        "high_priority": {high_priority},
        "medium_priority": {medium_priority},
        "low_priority": {low_priority},
        "escalated_count": {escalated_count},
        "priority_score": {priority_score},
        "rice_score": {rice_score},
        "reach": {reach},
        "impact": {impact},
        "confidence": {confidence},
        "effort": {effort},
        "important_patterns": [
            ""
        ]
    }},

    "strategic_importance": "",

    "product_goal": "",

    "strategic_objectives": [
        ""
    ],

    "recommended_product_strategy": "",

    "key_product_initiatives": [
        {{
            "title": "",
            "description": "",
            "expected_customer_benefit": ""
        }}
    ],

    "success_metrics": [
        ""
    ],

    "risks_and_considerations": [
        ""
    ],

    "expected_customer_impact": [
        ""
    ],

    "recommended_next_steps": [
        ""
    ]
}}
"""

    # ========================================================
    # Generate Response
    # ========================================================

    try:

        response = model.generate_content(
            prompt
        )

        if not response or not response.text:

            raise Exception(
                "Gemini returned an empty response."
            )

        text = clean_json_response(
            response.text
        )

        # ====================================================
        # Parse JSON
        # ====================================================

        result = json.loads(text)

        # ====================================================
        # Basic Validation
        # ====================================================

        required_fields = [
            "cluster_id",
            "theme",
            "executive_summary",
            "problem_definition",
            "customer_pain_points",
            "customer_evidence",
            "strategic_importance",
            "product_goal",
            "strategic_objectives",
            "recommended_product_strategy",
            "key_product_initiatives",
            "success_metrics",
            "risks_and_considerations",
            "expected_customer_impact",
            "recommended_next_steps"
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in result
        ]

        if missing_fields:

            raise Exception(
                "Gemini response is missing required fields: "
                + ", ".join(missing_fields)
            )

        return result

    except json.JSONDecodeError as e:

        raise Exception(
            f"Invalid JSON returned by Gemini: {str(e)}"
        )

    except Exception as e:

        raise Exception(
            f"Product strategy generation failed: {str(e)}"
        )