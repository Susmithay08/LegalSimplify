from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analyzer import analyze_legal

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    if len(req.text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Text too short. Paste at least a paragraph of legal text.")
    try:
        result = analyze_legal(req.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health():
    return {"status": "ok"}
