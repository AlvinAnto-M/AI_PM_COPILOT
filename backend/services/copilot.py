import os
import re

import google.generativeai as genai
from dotenv import load_dotenv

from services.storage import load_analysis
from services.context_builder import build_context
from services.intent_detector import detect_intent


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured in the environment."
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
# Greeting Detection
# ============================================================

def is_greeting(message: str) -> bool:
    """
    Detect simple conversational greetings.

    These messages should NOT trigger dataset analysis.
    """

    message = message.strip().lower()

    greetings = [
        "hi",
        "hii",
        "hiii",
        "hello",
        "hey",
        "heyy",
        "heyyy",
        "good morning",
        "good afternoon",
        "good evening",
        "how are you",
        "how are you doing",
        "what's up",
        "whats up",
    ]

    # Exact greeting
    if message in greetings:
        return True

    # Greeting with punctuation
    cleaned = re.sub(r"[^\w\s]", "", message)

    if cleaned in greetings:
        return True

    return False


# ============================================================
# Capability Detection
# ============================================================

def is_capability_question(message: str) -> bool:
    """
    Detect questions asking what the Copilot can do.
    """

    message = message.strip().lower()

    capability_phrases = [
        "what can you do",
        "what do you do",
        "how can you help",
        "what are your features",
        "what features do you have",
        "help me",
    ]

    return any(
        phrase in message
        for phrase in capability_phrases
    )


# ============================================================
# AI Product Manager Copilot
# ============================================================

def ask_copilot(user_message: str):

    user_message = user_message.strip()

    # ========================================================
    # Empty Message
    # ========================================================

    if not user_message:

        return (
            "Please enter a question or request. "
            "I can help you analyze customer feedback, "
            "prioritize product issues, generate PRDs, "
            "create user stories, and build product roadmaps."
        )


    # ========================================================
    # Handle Greetings
    # ========================================================

    # IMPORTANT:
    # Do this BEFORE loading the dataset.
    #
    # A greeting should remain a conversation and should
    # NOT trigger a dataset summary.

    if is_greeting(user_message):

        return (
            "Hi! 👋\n\n"
            "I'm your AI Product Manager Copilot. "
            "How can I help you today?"
        )


    # ========================================================
    # Handle Capability Questions
    # ========================================================

    if is_capability_question(user_message):

        return (
            "# AI Product Manager Copilot\n\n"
            "I can help you with:\n\n"
            "- **Customer Feedback Analysis** – understand major issues and themes\n"
            "- **Issue Clustering** – identify groups of related customer problems\n"
            "- **Trend Analysis** – discover important patterns in feedback\n"
            "- **Feature Prioritization** – rank issues using priority and RICE scoring\n"
            "- **Product Roadmaps** – organize initiatives into milestones\n"
            "- **PRD Generation** – create structured Product Requirement Documents\n"
            "- **User Stories** – convert customer problems into actionable user stories\n"
            "- **Acceptance Criteria** – create specific and testable criteria\n"
            "- **Product Recommendations** – suggest practical improvements\n\n"
            "Ask me a specific question about your product data and "
            "I'll answer it using the available analysis."
        )


    # ========================================================
    # Load Analyzed Dataset
    # ========================================================

    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:

        return (
            "# No Dataset Available\n\n"
            "I don't have an analyzed dataset yet.\n\n"
            "Please upload and analyze a dataset first, "
            "then I can answer product-related questions using "
            "your customer feedback."
        )


    # ========================================================
    # Detect User Intent
    # ========================================================

    intent = detect_intent(user_message)


    # ========================================================
    # Build Dataset Context
    # ========================================================

    context = build_context(
        df,
        cluster_labels,
        trends,
        recommendations
    )


    # ========================================================
    # Build Prompt
    # ========================================================

    prompt = f"""
{context}

---

You are an experienced Senior Product Manager working inside an AI Product Manager Copilot.

Your job is to answer the user's EXACT question.

IMPORTANT:
- Do NOT answer a different question.
- Do NOT automatically provide a dataset summary unless the user explicitly asks for a summary.
- Do NOT add unrelated information.
- Use ONLY information available in the uploaded dataset and analysis.
- If the dataset does not contain enough information to answer the question, clearly say so.
- Do not invent facts, features, metrics, or customer problems.

---

## User Intent

{intent}

---

## User Question

{user_message}

---

# RESPONSE FORMAT RULES

Your response must be clean, professional Markdown.

## Headings

Use Markdown headings:

# Main Heading

## Section Heading

### Subsection Heading

NEVER format headings like:

**Main Heading**

**Section Heading**

Do NOT put ** at the beginning or end of headings.

---

## Bold Text

Use bold text ONLY when emphasis is useful.

Examples:

**Total Feedback:** 1000

**Priority:** High

**Reason:** Payment failures affect a large number of customers.

Do NOT unnecessarily bold complete paragraphs.

---

## Lists

Use proper bullet points:

- Point one
- Point two
- Point three

For numbered steps:

1. First step
2. Second step
3. Third step

---

## Tables

Use Markdown tables when comparing structured information.

Example:

| Issue | Feedback | Priority |
|---|---:|---|
| Payment gateway | 67 | High |
| Account suspended | 110 | High |

---

## Spacing

Always leave a blank line between:

- headings and paragraphs
- paragraphs and lists
- different sections
- tables and surrounding content

Never produce one huge paragraph.

---

# INTENT-SPECIFIC INSTRUCTIONS

## If intent is summary

Generate a DETAILED executive summary of the uploaded customer feedback.

Use exactly this structure:

# Executive Summary

Start with 2–3 sentences explaining the overall state of the customer feedback.

## Dataset Overview

Include:

- **Total Feedback**
- **Number of Clusters**
- **Number of Themes**
- **Overall Priority Distribution**

## Major Customer Themes

Identify the most important themes based on feedback volume and impact.

For each major theme include:

### Theme Name

- **Feedback Volume:** ...
- **Priority:** ...
- **Customer Problem:** ...
- **Product Impact:** ...
- **Evidence:** ...

## Most Affected Products

Identify the products receiving the highest amount of customer feedback.

Include:

| Product | Feedback Volume | Main Issues |
|---|---:|---|

## High Priority Issues

Identify the most important high-priority customer problems.

For each issue include:

### Issue Name

**Why it matters:** ...

**Customer impact:** ...

**Evidence:** ...

**Recommended action:** ...

## Key Customer Pain Points

Summarize the major recurring customer problems.

- Pain point 1
- Pain point 2
- Pain point 3

## Trends and Patterns

Explain important patterns visible in the dataset.

Discuss:

- recurring issues
- high-volume issues
- high-severity issues
- product areas under pressure
- relationships between frequency and priority

## Product Management Insights

Explain what a Product Manager should understand from the analysis.

## Recommended Actions

Provide practical actions grouped into:

### Immediate Actions

...

### Near-Term Actions

...

### Long-Term Actions

...

---

## If intent is high_priority

Generate:

# High Priority Issues

For each issue:

### Issue Name

**Priority:** High

**Feedback Volume:** ...

**Reason:** ...

**Affected Product:** ...

**Customer Impact:** ...

**Evidence:** ...

**Recommendation:** ...

---

## If intent is prd

Generate:

# Product Requirement Document

## Objective

...

## Problem Statement

...

## Target Users

...

## Goals

...

## Functional Requirements

...

## Non-Functional Requirements

...

## Success Metrics

...

## Risks

...

---

## If intent is user_story

Generate:

# User Stories

### User Story 1

**As a:** ...

**I want:** ...

**So that:** ...

### User Story 2

...

---

## If intent is acceptance

Generate:

# Acceptance Criteria

For each criterion use:

### Criterion 1

**Given:** ...

**When:** ...

**Then:** ...

---

## If intent is priority

Generate:

# Feature Prioritization

| Rank | Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---:|---|---:|---:|---:|---:|---:|

Then provide:

## Prioritization Insights

Explain why the highest-ranked features should be addressed first.

---

## If intent is roadmap

Generate:

# Product Roadmap

## Immediate Priorities

...

## Near-Term Priorities

...

## Future Priorities

...

For each initiative include:

**Feature:** ...

**Reason:** ...

**Customer Impact:** ...

**Priority:** ...

**RICE Score:** ...

---

## If intent is recommendation

Generate:

# Product Recommendations

## Quick Wins

...

## Medium-Term Improvements

...

## Long-Term Strategy

...

---

## If intent is cluster

Generate:

# Cluster Analysis

## Major Clusters

...

## Customer Pain Points

...

## Important Trends

...

## Product Impact

...

---

## If intent is general

Answer ONLY the user's question.

Do not automatically summarize the dataset.

Do not add a "Recommendations" section unless the user asks for recommendations.

If the user says something conversational such as:

"Hi"
"Hello"
"Hiii"
"Thanks"
"Okay"

respond naturally and briefly.

---

# FINAL RULE

Answer the user's question directly.

Never generate a complete dataset summary unless the user explicitly asks for:

- summary
- overview
- analyze feedback
- summarize feedback
- executive summary
- insights

Return clean Markdown suitable for rendering in a web interface.


IMPORTANT OUTPUT FORMATTING RULES:

Return plain text only.

DO NOT use Markdown syntax.

DO NOT use:
- #
- ##
- ###
- **
- *
- ```
- backticks
- Markdown tables
- Markdown links

Do not put special formatting symbols around headings.

Use simple headings as plain text.

Example:

Executive Summary

The dataset contains 1000 customer feedback records across 25 clusters.

Dataset Overview

Total Feedback: 1000
Clusters: 25
Themes: 25

Major Customer Themes

1. Account Suspended
Feedback Volume: 110
Priority: High
Customer Impact: Significant

2. Payment Gateway
Feedback Volume: 67
Priority: High
Customer Impact: Significant

Recommended Actions

Immediate Actions
1. Investigate account suspension issues.
2. Investigate payment gateway failures.

Near-Term Actions
1. Improve authentication reliability.
2. Address recurring payment issues.

Long-Term Actions
1. Improve overall product reliability.

IMPORTANT:
Never add Markdown symbols to headings or bullet points.
Never wrap headings or labels with asterisks.
Return only clean readable text.
"""

    # ========================================================
    # Ask Gemini
    # ========================================================

    try:

        response = model.generate_content(prompt)

        if not response or not response.text:

            return (
                "I couldn't generate a response right now. "
                "Please try again."
            )

        return response.text.strip()

    except Exception as e:

        return (
            "I encountered an error while generating the response.\n\n"
            f"Error: {str(e)}"
        )