import pandas as pd


# ============================================================
# IMPACT SCORE
# ============================================================

def calculate_impact(cluster_df):
    """
    Calculate the average impact of a cluster
    based on feedback priority.

    Priority weights:
        High   = 3
        Medium = 2
        Low    = 1

    Returns:
        float: Impact score between 1 and 3
    """

    priority_weights = {
        "high": 3,
        "medium": 2,
        "low": 1
    }

    total = len(cluster_df)

    if total == 0:
        return 1.0

    weighted_score = 0

    for priority in cluster_df["priority"]:
        priority_value = str(priority).strip().lower()

        weighted_score += priority_weights.get(
            priority_value,
            1
        )

    average_impact = weighted_score / total

    return round(average_impact, 2)


# ============================================================
# CONFIDENCE SCORE
# ============================================================

def calculate_confidence(cluster_df):
    """
    Estimate confidence based on the amount of
    customer feedback available for a cluster.

    More feedback means higher confidence.
    """

    feedback_count = len(cluster_df)

    if feedback_count >= 100:
        return 0.95

    elif feedback_count >= 50:
        return 0.90

    elif feedback_count >= 25:
        return 0.85

    elif feedback_count >= 10:
        return 0.75

    else:
        return 0.60


# ============================================================
# EFFORT SCORE
# ============================================================

def calculate_effort(cluster_df):
    """
    Estimate implementation effort.

    Effort scale:

        1 = Very Low
        2 = Low
        3 = Medium
        4 = High
        5 = Very High

    Factors considered:
        - Number of feedback records
        - Number of high-priority issues
        - Number of escalated issues
    """

    high_count = (
        cluster_df["priority"]
        .astype(str)
        .str.strip()
        .str.lower()
        .eq("high")
        .sum()
    )

    escalated_count = (
        cluster_df["escalated"]
        .astype(str)
        .str.strip()
        .str.lower()
        .isin(["yes", "true", "1"])
        .sum()
    )

    feedback_count = len(cluster_df)

    effort = 1

    # Large number of feedback records
    if feedback_count >= 50:
        effort += 1

    if feedback_count >= 100:
        effort += 1

    # Many high-priority issues
    if high_count >= 10:
        effort += 1

    # Many escalated issues
    if escalated_count >= 5:
        effort += 1

    return min(effort, 5)


# ============================================================
# RICE SCORE
# ============================================================

def calculate_rice_score(
    reach,
    impact,
    confidence,
    effort
):
    """
    Calculate RICE score.

    RICE Formula:

        RICE = (Reach × Impact × Confidence) / Effort

    Parameters:
        reach       -> Number of affected customers
        impact      -> Impact score
        confidence  -> Confidence score
        effort      -> Estimated effort

    Returns:
        float: RICE score
    """

    if effort <= 0:
        effort = 1

    rice = (
        reach
        * impact
        * confidence
    ) / effort

    return round(rice, 2)


# ============================================================
# GENERATE FEATURE PRIORITIZATION
# ============================================================

def generate_prioritization(df):
    """
    Generate feature prioritization for every
    customer-feedback cluster.

    Each cluster is treated as a product feature/
    product initiative.

    Returns a list containing:

        cluster_id
        feature
        reach
        impact
        confidence
        effort
        rice_score
        feedback_count
        high_priority
        medium_priority
        low_priority
        escalated
        rank
    """

    # --------------------------------------------------------
    # Validate dataframe
    # --------------------------------------------------------

    if df is None or df.empty:
        return []

    # --------------------------------------------------------
    # Required columns
    # --------------------------------------------------------

    required_columns = [
        "cluster",
        "theme",
        "priority",
        "escalated"
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

    results = []

    # ========================================================
    # PROCESS EACH CLUSTER
    # ========================================================

    unique_clusters = sorted(
        df["cluster"].dropna().unique()
    )

    for cluster_id in unique_clusters:

        # ----------------------------------------------------
        # Get feedback belonging to this cluster
        # ----------------------------------------------------

        cluster_df = df[
            df["cluster"] == cluster_id
        ].copy()

        if cluster_df.empty:
            continue

        # ----------------------------------------------------
        # Feature / Theme
        # ----------------------------------------------------

        feature = str(
            cluster_df["theme"].iloc[0]
        )

        # ----------------------------------------------------
        # REACH
        #
        # Number of customers affected by the issue.
        # Here we use number of feedback records as a
        # practical approximation of reach.
        # ----------------------------------------------------

        reach = len(cluster_df)

        # ----------------------------------------------------
        # IMPACT
        # ----------------------------------------------------

        impact = calculate_impact(
            cluster_df
        )

        # ----------------------------------------------------
        # CONFIDENCE
        # ----------------------------------------------------

        confidence = calculate_confidence(
            cluster_df
        )

        # ----------------------------------------------------
        # EFFORT
        # ----------------------------------------------------

        effort = calculate_effort(
            cluster_df
        )

        # ----------------------------------------------------
        # RICE
        # ----------------------------------------------------

        rice_score = calculate_rice_score(
            reach=reach,
            impact=impact,
            confidence=confidence,
            effort=effort
        )

        # ====================================================
        # PRIORITY DISTRIBUTION
        # ====================================================

        priority_values = (
            cluster_df["priority"]
            .astype(str)
            .str.strip()
            .str.lower()
        )

        high_count = int(
            (
                priority_values == "high"
            ).sum()
        )

        medium_count = int(
            (
                priority_values == "medium"
            ).sum()
        )

        low_count = int(
            (
                priority_values == "low"
            ).sum()
        )

        # ====================================================
        # ESCALATED ISSUES
        # ====================================================

        escalated_values = (
            cluster_df["escalated"]
            .astype(str)
            .str.strip()
            .str.lower()
        )

        escalated_count = int(
            escalated_values.isin(
                ["yes", "true", "1"]
            ).sum()
        )

        # ====================================================
        # STORE RESULT
        # ====================================================

        results.append({

            "cluster_id": int(
                cluster_id
            ),

            "feature": feature,

            "reach": int(
                reach
            ),

            "impact": float(
                impact
            ),

            "confidence": float(
                confidence
            ),

            "effort": int(
                effort
            ),

            "rice_score": float(
                rice_score
            ),

            "feedback_count": int(
                len(cluster_df)
            ),

            "high_priority": high_count,

            "medium_priority": medium_count,

            "low_priority": low_count,

            "escalated": escalated_count
        })

    # ========================================================
    # SORT BY RICE SCORE
    # ========================================================

    results.sort(
        key=lambda item: item["rice_score"],
        reverse=True
    )

    # ========================================================
    # ASSIGN RANK
    # ========================================================

    for index, item in enumerate(
        results,
        start=1
    ):

        item["rank"] = index

    return results