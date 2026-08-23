from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.storage import load_analysis
from services.strategy_generator import generate_product_strategy
from services.prioritization import generate_prioritization


router = APIRouter()


# ============================================================
# Request Model
# ============================================================

class StrategyRequest(BaseModel):
    cluster_id: int


# ============================================================
# GET AVAILABLE CLUSTERS
# ============================================================

@router.get("/strategy/clusters")
def get_strategy_clusters():
    """
    Return all analyzed clusters that can be used
    to generate Product Strategy Reports.
    """

    try:

        df, cluster_labels, trends, recommendations = (
            load_analysis()
        )

        # ----------------------------------------------------
        # No dataset
        # ----------------------------------------------------

        if df is None or df.empty:

            return {
                "success": False,
                "message": "No dataset analyzed yet.",
                "clusters": []
            }

        # ----------------------------------------------------
        # Generate prioritization data
        # ----------------------------------------------------

        try:

            prioritization = generate_prioritization(df)

        except Exception:

            prioritization = []

        # ----------------------------------------------------
        # Create RICE lookup
        # ----------------------------------------------------

        prioritization_map = {}

        for item in prioritization:

            cluster_id = item.get("cluster_id")

            if cluster_id is not None:

                prioritization_map[
                    int(cluster_id)
                ] = item

        # ----------------------------------------------------
        # Build cluster list
        # ----------------------------------------------------

        clusters = []

        for cluster_id in sorted(
            df["cluster"].unique()
        ):

            cluster_id = int(cluster_id)

            cluster_df = df[
                df["cluster"] == cluster_id
            ]

            if cluster_df.empty:
                continue

            # ------------------------------------------------
            # Theme
            # ------------------------------------------------

            theme = str(
                cluster_df["theme"].iloc[0]
                if "theme" in cluster_df.columns
                else f"Cluster {cluster_id}"
            )

            # ------------------------------------------------
            # Priority counts
            # ------------------------------------------------

            high_priority = 0
            medium_priority = 0
            low_priority = 0

            if "priority" in cluster_df.columns:

                priority_values = (
                    cluster_df["priority"]
                    .astype(str)
                    .str.capitalize()
                )

                high_priority = int(
                    (priority_values == "High").sum()
                )

                medium_priority = int(
                    (priority_values == "Medium").sum()
                )

                low_priority = int(
                    (priority_values == "Low").sum()
                )

            # ------------------------------------------------
            # Escalated
            # ------------------------------------------------

            escalated_count = 0

            if "escalated" in cluster_df.columns:

                escalated_count = int(
                    cluster_df["escalated"]
                    .astype(str)
                    .str.lower()
                    .isin(
                        [
                            "yes",
                            "true",
                            "1"
                        ]
                    )
                    .sum()
                )

            # ------------------------------------------------
            # RICE
            # ------------------------------------------------

            rice_data = prioritization_map.get(
                cluster_id,
                {}
            )

            clusters.append({

                "cluster_id": cluster_id,

                "theme": theme,

                "feedback_count": int(
                    len(cluster_df)
                ),

                "high_priority": high_priority,

                "medium_priority": medium_priority,

                "low_priority": low_priority,

                "escalated_count": (
                    escalated_count
                ),

                "rice_score": float(
                    rice_data.get(
                        "rice_score",
                        0
                    )
                )
            })

        # ----------------------------------------------------
        # Return
        # ----------------------------------------------------

        return {
            "success": True,
            "total_clusters": len(clusters),
            "clusters": clusters
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to load strategy clusters: {str(e)}"
            )
        )


# ============================================================
# GENERATE PRODUCT STRATEGY
# ============================================================

@router.post("/strategy/generate")
def generate_strategy(
    request: StrategyRequest
):
    """
    Generate a Product Strategy Report for one
    selected customer feedback cluster.
    """

    try:

        # ----------------------------------------------------
        # Load analyzed data
        # ----------------------------------------------------

        df, cluster_labels, trends, recommendations = (
            load_analysis()
        )

        if df is None or df.empty:

            raise HTTPException(
                status_code=400,
                detail="No dataset analyzed yet."
            )

        # ----------------------------------------------------
        # Validate cluster
        # ----------------------------------------------------

        cluster_id = int(
            request.cluster_id
        )

        cluster_df = df[
            df["cluster"] == cluster_id
        ].copy()

        if cluster_df.empty:

            raise HTTPException(
                status_code=404,
                detail="Cluster not found."
            )

        # ----------------------------------------------------
        # Get cluster theme
        # ----------------------------------------------------

        if "theme" in cluster_df.columns:

            theme = str(
                cluster_df["theme"].iloc[0]
            )

        else:

            theme = f"Cluster {cluster_id}"

        # ----------------------------------------------------
        # Get customer feedback
        # ----------------------------------------------------

        feedback = []

        if "issue_description" in cluster_df.columns:

            feedback = (
                cluster_df["issue_description"]
                .dropna()
                .astype(str)
                .tolist()
            )

        elif "clean_text" in cluster_df.columns:

            feedback = (
                cluster_df["clean_text"]
                .dropna()
                .astype(str)
                .tolist()
            )

        # ----------------------------------------------------
        # Feedback count
        # ----------------------------------------------------

        feedback_count = len(
            cluster_df
        )

        # ----------------------------------------------------
        # Priority counts
        # ----------------------------------------------------

        high_priority = 0
        medium_priority = 0
        low_priority = 0

        if "priority" in cluster_df.columns:

            priority_values = (
                cluster_df["priority"]
                .astype(str)
                .str.capitalize()
            )

            high_priority = int(
                (priority_values == "High").sum()
            )

            medium_priority = int(
                (priority_values == "Medium").sum()
            )

            low_priority = int(
                (priority_values == "Low").sum()
            )

        # ----------------------------------------------------
        # Priority Score
        # ----------------------------------------------------

        priority_score = 0.0

        if "priority_score" in cluster_df.columns:

            priority_score = float(
                cluster_df[
                    "priority_score"
                ].mean()
            )

        # ----------------------------------------------------
        # Escalated Count
        # ----------------------------------------------------

        escalated_count = 0

        if "escalated" in cluster_df.columns:

            escalated_count = int(
                cluster_df["escalated"]
                .astype(str)
                .str.lower()
                .isin(
                    [
                        "yes",
                        "true",
                        "1"
                    ]
                )
                .sum()
            )

        # ----------------------------------------------------
        # RICE / Prioritization
        # ----------------------------------------------------

        prioritization = generate_prioritization(
            df
        )

        rice_data = None

        for item in prioritization:

            if int(
                item["cluster_id"]
            ) == cluster_id:

                rice_data = item

                break

        # ----------------------------------------------------
        # Default RICE values
        # ----------------------------------------------------

        if rice_data is None:

            rice_score = 0.0
            reach = feedback_count
            impact = 0.0
            confidence = 0.0
            effort = 0

        else:

            rice_score = float(
                rice_data.get(
                    "rice_score",
                    0
                )
            )

            reach = int(
                rice_data.get(
                    "reach",
                    feedback_count
                )
            )

            impact = float(
                rice_data.get(
                    "impact",
                    0
                )
            )

            confidence = float(
                rice_data.get(
                    "confidence",
                    0
                )
            )

            effort = int(
                rice_data.get(
                    "effort",
                    0
                )
            )

        # ----------------------------------------------------
        # Get Relevant Trends
        # ----------------------------------------------------

        cluster_trends = trends

        # If trends is a dictionary and contains
        # cluster-specific information, try to extract it.

        if isinstance(trends, dict):

            if str(cluster_id) in trends:

                cluster_trends = trends[
                    str(cluster_id)
                ]

            elif cluster_id in trends:

                cluster_trends = trends[
                    cluster_id
                ]

        # ----------------------------------------------------
        # Generate Product Strategy
        # ----------------------------------------------------

        strategy = generate_product_strategy(

            cluster_id=cluster_id,

            theme=theme,

            feedback=feedback,

            feedback_count=feedback_count,

            high_priority=high_priority,

            medium_priority=medium_priority,

            low_priority=low_priority,

            escalated_count=escalated_count,

            priority_score=priority_score,

            rice_score=rice_score,

            reach=reach,

            impact=impact,

            confidence=confidence,

            effort=effort,

            trends=cluster_trends
        )

        # ----------------------------------------------------
        # Return Response
        # ----------------------------------------------------

        return {

            "success": True,

            "cluster_id": cluster_id,

            "theme": theme,

            "feedback_count": feedback_count,

            "strategy": strategy
        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to generate Product Strategy: {str(e)}"
            )
        )