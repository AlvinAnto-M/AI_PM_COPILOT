from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ---------------------------------
# Import Routes
# ---------------------------------

from routes.analyze import router as analyze_router
from routes.dashboard import router as dashboard_router
from routes.clusters import router as cluster_router
from routes.copilot import router as copilot_router
from routes.prd import router as prd_router
from routes.user_stories import router as user_stories_router
from routes.prioritization import router as prioritization_router
from routes.roadmap import router as roadmap_router
from routes.strategy import router as strategy_router

# ---------------------------------
# FastAPI App
# ---------------------------------

app = FastAPI(
    title="AI Product Manager Copilot",
    version="1.0.0",
    description="AI-powered Product Manager Copilot"
)


# ---------------------------------
# CORS Configuration
# ---------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------
# Register Routes
# ---------------------------------

app.include_router(analyze_router)
app.include_router(dashboard_router)
app.include_router(cluster_router)
app.include_router(copilot_router)
app.include_router(prd_router)
app.include_router(user_stories_router)
app.include_router(prioritization_router)
app.include_router(roadmap_router)
app.include_router(strategy_router)


# ---------------------------------
# Root Endpoint
# ---------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Product Manager Copilot Backend Running"
    }


# ---------------------------------
# Health Check
# ---------------------------------

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# ---------------------------------
# Run Server
# ---------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )