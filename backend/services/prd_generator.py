import os

import google.generativeai as genai
from dotenv import load_dotenv

from services.storage import load_analysis


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured.")

genai.configure(api_key=GEMINI_API_KEY)


# ============================================================
# Gemini Model
# ============================================================

model = genai.GenerativeModel("gemini-2.5-flash")


# ============================================================
# Helper: Convert Cluster Labels to List
# ============================================================

def _normalize_cluster_labels(cluster_labels):
    """
    Convert cluster labels into a normal Python list.

    Supports:
    - pandas Series
    - numpy arrays
    - Python lists
    - dictionaries
    """

    if cluster_labels is None:
        return None

    try:
        if hasattr(cluster_labels, "tolist"):
            return cluster_labels.tolist()

        if isinstance(cluster_labels, dict):
            # Handle dictionaries containing labels
            for key in ["labels", "cluster_labels", "clusters"]:
                if key in cluster_labels:
                    value = cluster_labels[key]

                    if hasattr(value, "tolist"):
                        return value.tolist()

                    return list(value)

        return list(cluster_labels)

    except Exception:
        return None


# ============================================================
# Helper: Find Feedback Column
# ============================================================

def _find_feedback_column(df):
    """
    Automatically find the most likely customer feedback column.
    """

    possible_columns = [
        "feedback",
        "Feedback",
        "customer_feedback",
        "Customer Feedback",
        "customer_feedback_text",
        "text",
        "Text",
        "review",
        "Review",
        "comment",
        "Comment",
        "description",
        "Description",
        "issue",
        "Issue",
        "message",
        "Message",
    ]

    for column in possible_columns:

        if column in df.columns:
            return column

    # Fallback:
    # Look for an object/string column
    for column in df.columns:

        try:
            if str(df[column].dtype) == "object":
                return column
        except Exception:
            continue

    return None


# ============================================================
# Generate PRD for Selected Cluster
# ============================================================

def generate_prd(cluster_id: int):

    # --------------------------------------------------------
    # Load Existing Analysis
    # --------------------------------------------------------

    df, cluster_labels, trends, recommendations = load_analysis()

    # --------------------------------------------------------
    # Check Dataset
    # --------------------------------------------------------

    if df is None:
        return {
            "success": False,
            "message": (
                "No analyzed dataset is available. "
                "Please upload and analyze a dataset first."
            )
        }

    # --------------------------------------------------------
    # Normalize Cluster Labels
    # --------------------------------------------------------

    labels = _normalize_cluster_labels(cluster_labels)

    if labels is None:
        return {
            "success": False,
            "message": (
                "Cluster labels are not available. "
                "Please run the clustering analysis first."
            )
        }

    # --------------------------------------------------------
    # Check Cluster ID
    # --------------------------------------------------------

    try:
        cluster_id = int(cluster_id)

    except (TypeError, ValueError):

        return {
            "success": False,
            "message": "Invalid cluster ID."
        }

    # --------------------------------------------------------
    # Check Label / Dataset Length
    # --------------------------------------------------------

    if len(labels) != len(df):

        return {
            "success": False,
            "message": (
                "The number of cluster labels does not match "
                "the number of feedback records."
            )
        }

    # --------------------------------------------------------
    # Add Temporary Cluster Column
    # --------------------------------------------------------

    working_df = df.copy()

    working_df["_prd_cluster_id"] = labels

    # --------------------------------------------------------
    # Get Selected Cluster
    # --------------------------------------------------------

    cluster_df = working_df[
        working_df["_prd_cluster_id"] == cluster_id
    ].copy()

    # --------------------------------------------------------
    # Check Cluster Exists
    # --------------------------------------------------------

    if cluster_df.empty:

        available_clusters = sorted(
            set(labels)
        )

        return {
            "success": False,
            "message": (
                f"Cluster {cluster_id} was not found. "
                f"Available clusters: {available_clusters}"
            )
        }

    # --------------------------------------------------------
    # Find Feedback Column
    # --------------------------------------------------------

    feedback_column = _find_feedback_column(cluster_df)

    # --------------------------------------------------------
    # Extract Feedback
    # --------------------------------------------------------

    if feedback_column:

        feedback_values = (
            cluster_df[feedback_column]
            .dropna()
            .astype(str)
            .tolist()
        )

    else:

        feedback_values = []

    # Limit the amount of feedback sent to Gemini
    feedback_values = feedback_values[:100]

    # --------------------------------------------------------
    # Create Feedback Evidence
    # --------------------------------------------------------

    if feedback_values:

        feedback_evidence = "\n".join(
            [
                f"{index + 1}. {feedback}"
                for index, feedback in enumerate(feedback_values)
            ]
        )

    else:

        feedback_evidence = (
            "No direct feedback text column was identified."
        )

    # --------------------------------------------------------
    # Cluster Summary
    # --------------------------------------------------------

    cluster_summary = cluster_df.drop(
        columns=["_prd_cluster_id"],
        errors="ignore"
    ).head(20).to_string(index=False)

    # --------------------------------------------------------
    # Trend Information
    # --------------------------------------------------------

    if trends is None:
        trend_info = "No trend analysis available."
    else:
        trend_info = str(trends)

    # --------------------------------------------------------
    # Recommendation Information
    # --------------------------------------------------------

    if recommendations is None:
        recommendation_info = "No recommendations available."
    else:
        recommendation_info = str(recommendations)

    # --------------------------------------------------------
    # Gemini Prompt
    # --------------------------------------------------------

    prompt = f"""
You are a Senior Product Manager.

Generate a professional Product Requirements Document (PRD)
for ONLY the selected customer-feedback issue cluster.

Do NOT generate a generic PRD for the entire dataset.

============================================================
SELECTED CLUSTER
============================================================

Cluster ID:
{cluster_id}

Number of feedback records:
{len(cluster_df)}

Feedback column:
{feedback_column}

============================================================
CUSTOMER FEEDBACK FROM THIS CLUSTER
============================================================

{feedback_evidence}

============================================================
CLUSTER DATA SAMPLE
============================================================

{cluster_summary}

============================================================
OVERALL TREND ANALYSIS
============================================================

{trend_info}

============================================================
EXISTING RECOMMENDATIONS
============================================================

{recommendation_info}

============================================================
PRD REQUIREMENTS
============================================================

Generate the PRD using this structure:

# Product Requirements Document

## 1. Product Overview

Give the PRD a clear product/problem title based on
the selected cluster.

## 2. Problem Statement

Clearly explain the customer problem represented by
this cluster.

## 3. Customer Insights

Summarize the most important customer observations
from this cluster.

Use evidence from the provided feedback.

## 4. Goals

List the main goals for solving this problem.

## 5. Target Users

Identify the users affected by this problem.

## 6. Key Features

For each proposed feature:

### Feature Name

**Description**

Explain the feature.

**Customer Problem Addressed**

Explain which problem it solves.

**Evidence**

Use evidence from the selected cluster.

**Expected Outcome**

Explain the expected product impact.

**Priority**

Classify as High, Medium, or Low.

## 7. Functional Requirements

List the functional requirements required
to implement the solution.

## 8. Non-Functional Requirements

List relevant requirements such as:

- Performance
- Reliability
- Security
- Scalability
- Usability

Only include requirements that make sense for
this problem.

## 9. User Experience Requirements

Describe important UX considerations.

## 10. Risks and Assumptions

List the major risks and assumptions.

## 11. Success Metrics

Define measurable metrics that can be used
to evaluate whether the solution works.

Do not invent baseline numbers.

## 12. Product Roadmap

Divide the implementation into:

### Immediate

### Next Sprint

### Future

============================================================
IMPORTANT RULES
============================================================

1. Focus ONLY on Cluster {cluster_id}.
2. Do not generate a generic PRD for all clusters.
3. Use customer feedback as evidence.
4. Do not invent customer complaints.
5. Do not fabricate statistics.
6. Do not invent baseline metrics.
7. Clearly state when information is unavailable.
8. Proposed features may be inferred from the
   identified customer problem, but the reasoning
   must be clearly connected to the evidence.
9. Use professional Product Management terminology.
10. Return clean Markdown.
11. Do not return JSON.
12. Do not include conversational text outside the PRD.
13. Keep the PRD detailed but practical.
"""

    # --------------------------------------------------------
    # Generate PRD
    # --------------------------------------------------------

    try:

        response = model.generate_content(prompt)

        if not response or not response.text:

            return {
                "success": False,
                "message": "Gemini returned an empty response."
            }

        return {
            "success": True,
            "cluster_id": cluster_id,
            "feedback_count": len(cluster_df),
            "prd": response.text
        }

    except Exception as e:

        return {
            "success": False,
            "message": f"PRD generation failed: {str(e)}"
        }