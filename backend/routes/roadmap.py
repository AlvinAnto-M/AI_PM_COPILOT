from fastapi import APIRouter, HTTPException

from services.storage import load_analysis
from services.milestone_engine import generate_roadmap


router = APIRouter()


# ============================================================
# GET PRODUCT ROADMAP
# ============================================================

@router.get("/roadmap")
def get_roadmap():

    try:

        # ----------------------------------------------------
        # Load existing analyzed dataset
        # ----------------------------------------------------

        df, cluster_labels, trends, recommendations = (
            load_analysis()
        )

        if df is None:

            return {
                "success": False,
                "message": "No dataset analyzed yet.",
                "roadmap": []
            }

        # ----------------------------------------------------
        # Generate Roadmap
        # ----------------------------------------------------

        roadmap = generate_roadmap(df)

        return roadmap

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate roadmap: {str(e)}"
        )


# ============================================================
# GET SINGLE ROADMAP INITIATIVE
# ============================================================

@router.get("/roadmap/{cluster_id}")
def get_roadmap_item(cluster_id: int):

    try:

        # ----------------------------------------------------
        # Load analyzed data
        # ----------------------------------------------------

        df, cluster_labels, trends, recommendations = (
            load_analysis()
        )

        if df is None:

            return {
                "success": False,
                "message": "No dataset analyzed yet."
            }

        # ----------------------------------------------------
        # Generate roadmap
        # ----------------------------------------------------

        result = generate_roadmap(df)

        # ----------------------------------------------------
        # Find requested cluster
        # ----------------------------------------------------

        for item in result["roadmap"]:

            if item["cluster_id"] == cluster_id:

                return {
                    "success": True,
                    "initiative": item
                }

        # ----------------------------------------------------
        # Cluster not found
        # ----------------------------------------------------

        return {
            "success": False,
            "message": "Roadmap initiative not found."
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve roadmap item: {str(e)}"
        )