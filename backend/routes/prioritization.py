from fastapi import APIRouter
from services.storage import load_analysis
from services.prioritization import generate_prioritization


router = APIRouter()


# --------------------------------------------------
# Feature Prioritization
# --------------------------------------------------

@router.get("/prioritization")
def get_prioritization():

    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:
        return {
            "success": False,
            "message": "No dataset analyzed yet."
        }

    try:

        results = generate_prioritization(df)

        return {
            "success": True,
            "total_features": len(results),
            "prioritization": results
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }