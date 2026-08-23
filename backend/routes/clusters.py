from fastapi import APIRouter
from services.storage import load_analysis

router = APIRouter()


# =========================================================
# GET CLUSTER DETAILS
# =========================================================

@router.get("/cluster/{cluster_id}")
def cluster_details(cluster_id: int):

    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:
        return {
            "success": False,
            "message": "No dataset analyzed yet."
        }

    # Filter selected cluster
    cluster_df = df[df["cluster"] == cluster_id]

    if cluster_df.empty:
        return {
            "success": False,
            "message": "Cluster not found"
        }

    # -----------------------------------------
    # Priority distribution
    # -----------------------------------------

    priority_counts = (
        cluster_df["priority"]
        .value_counts()
        .to_dict()
    )

    # -----------------------------------------
    # Get cluster theme/name
    # -----------------------------------------

    if "theme" in cluster_df.columns:
        theme = str(cluster_df["theme"].iloc[0])
    else:
        theme = f"Cluster {cluster_id}"

    # -----------------------------------------
    # Build issue list
    # -----------------------------------------

    issues = []

    for _, row in cluster_df.iterrows():

        issues.append({

            "ticket_id": int(row["ticket_id"]),

            "issue_description": str(
                row["issue_description"]
            ),

            "priority": str(
                row["priority"]
            ),

            "status": str(
                row["status"]
            ),

            "product": str(
                row["product"]
            ),

            "category": str(
                row["category"]
            ),

            "escalated": str(
                row["escalated"]
            )
        })

    # -----------------------------------------
    # Return cluster details
    # -----------------------------------------

    return {

        "success": True,

        "cluster_id": cluster_id,

        "name": theme,

        "theme": theme,

        "issue_count": int(
            len(cluster_df)
        ),

        "priority_breakdown": {

            "High": int(
                priority_counts.get("High", 0)
            ),

            "Medium": int(
                priority_counts.get("Medium", 0)
            ),

            "Low": int(
                priority_counts.get("Low", 0)
            )
        },

        "issues": issues
    }


# =========================================================
# GET ALL CLUSTERS
# =========================================================

@router.get("/clusters")
def get_clusters():

    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:
        return {
            "success": False,
            "message": "No dataset analyzed yet.",
            "clusters": []
        }

    clusters = []

    # -----------------------------------------
    # Get unique cluster IDs directly from
    # the analyzed DataFrame
    # -----------------------------------------

    unique_clusters = sorted(
        df["cluster"].dropna().unique()
    )

    for cluster_id in unique_clusters:

        cluster_id = int(cluster_id)

        cluster_df = df[
            df["cluster"] == cluster_id
        ]

        if cluster_df.empty:
            continue

        # -----------------------------------------
        # Get theme / cluster name
        # -----------------------------------------

        if "theme" in cluster_df.columns:
            theme = str(
                cluster_df["theme"].iloc[0]
            )
        else:
            theme = f"Cluster {cluster_id}"

        # -----------------------------------------
        # Add cluster
        # -----------------------------------------

        clusters.append({

            "cluster_id": cluster_id,

            "id": cluster_id,

            "name": theme,

            "theme": theme,

            "feedback_count": int(
                len(cluster_df)
            ),

            "issue_count": int(
                len(cluster_df)
            )
        })

    # -----------------------------------------
    # Return clusters
    # -----------------------------------------

    return {

        "success": True,

        "clusters": clusters
    }


# =========================================================
# GET CLUSTER NAMES
# =========================================================

@router.get("/clusters/names")
def get_cluster_names():

    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:
        return {
            "success": False,
            "message": "No dataset analyzed yet.",
            "clusters": []
        }

    clusters = []

    unique_clusters = sorted(
        df["cluster"].dropna().unique()
    )

    for cluster_id in unique_clusters:

        cluster_id = int(cluster_id)

        cluster_df = df[
            df["cluster"] == cluster_id
        ]

        if cluster_df.empty:
            continue

        if "theme" in cluster_df.columns:
            theme = str(
                cluster_df["theme"].iloc[0]
            )
        else:
            theme = f"Cluster {cluster_id}"

        clusters.append({

            "cluster_id": cluster_id,

            "name": theme,

            "feedback_count": int(
                len(cluster_df)
            )
        })

    return {

        "success": True,

        "clusters": clusters
    }