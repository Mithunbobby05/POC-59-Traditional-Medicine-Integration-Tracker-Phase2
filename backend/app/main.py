from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="POC-59 Traditional Medicine Integration Tracker API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)


@app.get("/health")
async def health() -> dict[str, str]:
    """Report that the API process is available."""
    return {"status": "ok"}
