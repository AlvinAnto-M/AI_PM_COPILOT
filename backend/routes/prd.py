from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.prd_generator import generate_prd


# ============================================================
# Router
# ============================================================

router = APIRouter(
    prefix="/prd",
    tags=["PRD Generator"]
)


# ============================================================
# Request Model
# ============================================================

class PRDRequest(BaseModel):

    cluster_id: int


# ============================================================
# Generate PRD
# ============================================================

@router.post("/generate")
def generate_prd_endpoint(request: PRDRequest):

    result = generate_prd(
        request.cluster_id
    )

    if not result.get("success"):

        raise HTTPException(
            status_code=400,
            detail=result.get(
                "message",
                "PRD generation failed."
            )
        )

    return result