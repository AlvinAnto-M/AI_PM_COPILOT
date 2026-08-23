import pandas as pd

from services.prioritization import generate_prioritization


# ============================================================
# Configuration
# ============================================================

# These are used only as fallback thresholds.
# Final milestone assignment is rank-based so that
# Milestone 1 will not remain empty when initiatives exist.

IMMEDIATE_LIMIT = 0.33
NEAR_TERM_LIMIT = 0.66


# ============================================================
# Helper Functions
# ============================================================

def safe_float(value, default=0.0):
    """
    Safely convert a value to float.
    """

    try:
        if pd.isna(value):
            return default

        return float(value)

    except (TypeError, ValueError):
        return default


def normalize(value, minimum, maximum):
    """
    Normalize a value between 0 and 1.
    """

    if maximum == minimum:
        return 0.0

    return (value - minimum) / (maximum - minimum)


# ============================================================
# Get RICE Scores
# ============================================================

def get_rice_scores(df):
    """
    Generate RICE prioritization results and convert them
    into a dictionary indexed by cluster_id.

    Example:

    {
        6: {
            "rice_score": 52.25,
            "reach": 110,
            "impact": 2.0,
            "confidence": 0.95,
            "effort": 4
        }
    }
    """

    try:

        prioritization_results = generate_prioritization(df)

    except Exception as e:

        raise ValueError(
            f"Unable to calculate RICE prioritization: {str(e)}"
        )

    rice_map = {}

    for item in prioritization_results:

        cluster_id = item.get("cluster_id")

        if cluster_id is None:
            continue

        rice_map[int(cluster_id)] = {
            "rice_score": safe_float(
                item.get("rice_score"),
                0.0
            ),

            "reach": int(
                item.get("reach", 0)
            ),

            "impact": safe_float(
                item.get("impact"),
                0.0
            ),

            "confidence": safe_float(
                item.get("confidence"),
                0.0
            ),

            "effort": int(
                item.get("effort", 0)
            ),

            "prioritization_rank": int(
                item.get("rank", 0)
            )
        }

    return rice_map


# ============================================================
# Calculate Roadmap Score
# ============================================================

def calculate_roadmap_score(
    feedback_count,
    priority_score,
    rice_score,
    escalation_score
):
    """
    Calculate the overall roadmap score.

    Components:

    1. Customer feedback volume      = 25%
    2. Priority score                = 35%
    3. RICE score                    = 25%
    4. Escalation                    = 15%

    Final score is between 0 and 100.
    """

    # --------------------------------------------------------
    # Feedback Component
    # --------------------------------------------------------

    feedback_component = min(
        feedback_count / 100,
        1
    )

    # --------------------------------------------------------
    # Priority Component
    # --------------------------------------------------------

    priority_component = min(
        priority_score / 100,
        1
    )

    # --------------------------------------------------------
    # RICE Component
    # --------------------------------------------------------

    # RICE values in the current system are generally
    # around 0 - 60+, so normalize using 100 as the
    # upper reference point.

    rice_component = min(
        rice_score / 100,
        1
    )

    # --------------------------------------------------------
    # Escalation Component
    # --------------------------------------------------------

    escalation_component = min(
        escalation_score / max(feedback_count, 1),
        1
    )

    # --------------------------------------------------------
    # Final Roadmap Score
    # --------------------------------------------------------

    roadmap_score = (
        feedback_component * 0.25
        + priority_component * 0.35
        + rice_component * 0.25
        + escalation_component * 0.15
    )

    return round(
        roadmap_score * 100,
        2
    )


# ============================================================
# Get Milestone From Rank
# ============================================================

def recommend_milestone_by_rank(rank, total):
    """
    Assign milestone based on roadmap ranking.

    Top 33%    -> Milestone 1 / Immediate
    Middle 33% -> Milestone 2 / Near Term
    Bottom 34% -> Milestone 3 / Later

    This guarantees that Milestone 1 is not empty
    when roadmap initiatives exist.
    """

    if total <= 0:

        return {
            "milestone": "Milestone 1",
            "timeframe": "Immediate",
            "reason": "No initiatives available."
        }

    # --------------------------------------------------------
    # Calculate rank position
    # --------------------------------------------------------

    position = rank / total

    # --------------------------------------------------------
    # Milestone 1
    # --------------------------------------------------------

    if position <= IMMEDIATE_LIMIT:

        return {
            "milestone": "Milestone 1",
            "timeframe": "Immediate",
            "reason": (
                "This initiative is among the highest-ranked "
                "items based on customer impact, priority, "
                "RICE score, and escalation signals."
            )
        }

    # --------------------------------------------------------
    # Milestone 2
    # --------------------------------------------------------

    elif position <= NEAR_TERM_LIMIT:

        return {
            "milestone": "Milestone 2",
            "timeframe": "Near Term",
            "reason": (
                "This initiative has meaningful customer impact "
                "and should follow the most urgent initiatives."
            )
        }

    # --------------------------------------------------------
    # Milestone 3
    # --------------------------------------------------------

    else:

        return {
            "milestone": "Milestone 3",
            "timeframe": "Later",
            "reason": (
                "This initiative has comparatively lower "
                "roadmap priority and can be scheduled after "
                "higher-ranked work."
            )
        }


# ============================================================
# Generate Roadmap
# ============================================================

def generate_roadmap(df):
    """
    Generate a product roadmap from analyzed customer feedback.

    Each cluster becomes one roadmap initiative.

    RICE scores are obtained directly from the
    feature prioritization engine.
    """

    # ========================================================
    # Empty Dataset
    # ========================================================

    if df is None or df.empty:

        return {
            "success": True,
            "total_initiatives": 0,
            "roadmap": []
        }

    # ========================================================
    # Validate Required Columns
    # ========================================================

    required_columns = [
        "cluster",
        "theme"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    # ========================================================
    # Get RICE Prioritization
    # ========================================================

    rice_map = get_rice_scores(df)

    # ========================================================
    # Prepare Roadmap
    # ========================================================

    roadmap = []

    # ========================================================
    # Process Each Cluster
    # ========================================================

    for cluster_id in sorted(
        df["cluster"].unique()
    ):

        cluster_df = df[
            df["cluster"] == cluster_id
        ].copy()

        if cluster_df.empty:
            continue

        cluster_id = int(cluster_id)

        # ----------------------------------------------------
        # Theme
        # ----------------------------------------------------

        theme = str(
            cluster_df["theme"].iloc[0]
        )

        # ----------------------------------------------------
        # Feedback Count
        # ----------------------------------------------------

        feedback_count = len(
            cluster_df
        )

        # ----------------------------------------------------
        # Priority Distribution
        # ----------------------------------------------------

        high_priority = 0
        medium_priority = 0
        low_priority = 0

        if "priority" in cluster_df.columns:

            priority_counts = (
                cluster_df["priority"]
                .astype(str)
                .str.capitalize()
                .value_counts()
            )

            high_priority = int(
                priority_counts.get(
                    "High",
                    0
                )
            )

            medium_priority = int(
                priority_counts.get(
                    "Medium",
                    0
                )
            )

            low_priority = int(
                priority_counts.get(
                    "Low",
                    0
                )
            )

        # ----------------------------------------------------
        # Priority Score
        # ----------------------------------------------------

        average_priority_score = 0.0

        if "priority_score" in cluster_df.columns:

            average_priority_score = safe_float(
                cluster_df["priority_score"].mean(),
                0.0
            )

        else:

            # Fallback calculation
            priority_values = {
                "High": 100,
                "Medium": 60,
                "Low": 20
            }

            if "priority" in cluster_df.columns:

                priority_scores = (
                    cluster_df["priority"]
                    .astype(str)
                    .str.capitalize()
                    .map(priority_values)
                    .fillna(0)
                )

                average_priority_score = safe_float(
                    priority_scores.mean(),
                    0.0
                )

        average_priority_score = round(
            average_priority_score,
            2
        )

        # ----------------------------------------------------
        # Escalated Issues
        # ----------------------------------------------------

        escalated_count = 0

        if "escalated" in cluster_df.columns:

            escalated_values = (
                cluster_df["escalated"]
                .astype(str)
                .str.lower()
            )

            escalated_count = int(
                escalated_values.isin(
                    [
                        "yes",
                        "true",
                        "1"
                    ]
                ).sum()
            )

        # ----------------------------------------------------
        # RICE Information
        # ----------------------------------------------------

        rice_data = rice_map.get(
            cluster_id,
            {}
        )

        rice_score = safe_float(
            rice_data.get(
                "rice_score",
                0.0
            ),
            0.0
        )

        reach = int(
            rice_data.get(
                "reach",
                feedback_count
            )
        )

        impact = safe_float(
            rice_data.get(
                "impact",
                0.0
            ),
            0.0
        )

        confidence = safe_float(
            rice_data.get(
                "confidence",
                0.0
            ),
            0.0
        )

        effort = int(
            rice_data.get(
                "effort",
                0
            )
        )

        prioritization_rank = int(
            rice_data.get(
                "prioritization_rank",
                0
            )
        )

        # ----------------------------------------------------
        # Roadmap Score
        # ----------------------------------------------------

        roadmap_score = calculate_roadmap_score(
            feedback_count=feedback_count,
            priority_score=average_priority_score,
            rice_score=rice_score,
            escalation_score=escalated_count
        )

        # ----------------------------------------------------
        # Build Roadmap Item
        # ----------------------------------------------------

        roadmap.append({

            "cluster_id": cluster_id,

            "initiative": theme,

            "feedback_count": int(
                feedback_count
            ),

            # ----------------------------------------------
            # Priority
            # ----------------------------------------------

            "priority": {
                "high": high_priority,
                "medium": medium_priority,
                "low": low_priority
            },

            "priority_score": (
                average_priority_score
            ),

            # ----------------------------------------------
            # RICE
            # ----------------------------------------------

            "rice_score": rice_score,

            "rice": {
                "reach": reach,
                "impact": impact,
                "confidence": confidence,
                "effort": effort,
                "score": rice_score
            },

            # ----------------------------------------------
            # Other Metrics
            # ----------------------------------------------

            "escalated_count": (
                escalated_count
            ),

            "roadmap_score": (
                roadmap_score
            ),

            # Keep original prioritization rank
            "prioritization_rank": (
                prioritization_rank
            )
        })

    # ========================================================
    # Sort By Roadmap Score
    # ========================================================

    roadmap.sort(
        key=lambda item: (
            item["roadmap_score"],
            item["rice_score"]
        ),
        reverse=True
    )

    # ========================================================
    # Assign Roadmap Rank
    # ========================================================

    total = len(
        roadmap
    )

    for index, item in enumerate(
        roadmap,
        start=1
    ):

        item["rank"] = index

    # ========================================================
    # Assign Milestones
    # ========================================================

    for item in roadmap:

        recommendation = recommend_milestone_by_rank(
            rank=item["rank"],
            total=total
        )

        item["recommended_milestone"] = (
            recommendation["milestone"]
        )

        item["timeframe"] = (
            recommendation["timeframe"]
        )

        item["reason"] = (
            recommendation["reason"]
        )

    # ========================================================
    # Count Milestones
    # ========================================================

    milestone_1_count = sum(
        1
        for item in roadmap
        if item["recommended_milestone"]
        == "Milestone 1"
    )

    milestone_2_count = sum(
        1
        for item in roadmap
        if item["recommended_milestone"]
        == "Milestone 2"
    )

    milestone_3_count = sum(
        1
        for item in roadmap
        if item["recommended_milestone"]
        == "Milestone 3"
    )

    # ========================================================
    # Final Response
    # ========================================================

    return {

        "success": True,

        "total_initiatives": len(
            roadmap
        ),

        "milestone_summary": {

            "milestone_1": milestone_1_count,

            "milestone_2": milestone_2_count,

            "milestone_3": milestone_3_count
        },

        "roadmap": roadmap
    }