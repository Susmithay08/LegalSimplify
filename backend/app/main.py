from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.api.analyze import router

app = FastAPI(title="LegalSimplify API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")