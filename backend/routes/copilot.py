from fastapi import APIRouter
from pydantic import BaseModel

from services.copilot import ask_copilot

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/copilot")
def chat(request: ChatRequest):

    answer = ask_copilot(request.message)

    return {
        "answer": answer
    }