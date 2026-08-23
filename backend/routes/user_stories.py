from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.storage import load_analysis
from services.user_story_generator import generate_user_stories


router = APIRouter()


# --------------------------------------------------
# Request Model
# --------------------------------------------------

class UserStoryRequest(BaseModel):
    cluster_id: int


# --------------------------------------------------
# Generate User Stories
# --------------------------------------------------

@router.post("/user-stories/generate")
def generate_stories(request: UserStoryRequest):

    # Load analyzed dataset
    df, cluster_labels, trends, recommendations = load_analysis()

    if df is None:
        raise HTTPException(
            status_code=400,
            detail="No dataset analyzed yet."
        )

    # Check cluster
    cluster_df = df[
        df["cluster"] == request.cluster_id
    ]

    if cluster_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Cluster not found."
        )

    # Get theme
    theme = str(
        cluster_df["theme"].iloc[0]
    )

    # Get customer feedback
    feedback = (
        cluster_df["issue_description"]
        .dropna()
        .astype(str)
        .tolist()
    )

    # Limit feedback sent to AI
    feedback = feedback[:30]

    try:

        result = generate_user_stories(
            theme=theme,
            feedback=feedback
        )

        return {
            "success": True,
            "cluster_id": request.cluster_id,
            "theme": theme,
            "feedback_count": len(feedback),
            "user_stories": result.get(
                "user_stories",
                []
            )
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )