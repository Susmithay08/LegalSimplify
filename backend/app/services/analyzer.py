import json
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM = """You are a legal expert who explains legal documents in plain English to everyday people.
Analyze the given legal text and return ONLY valid JSON with this exact structure, no markdown, no explanation:

{
  "title": "short name for this document type",
  "document_type": "Terms of Service | Privacy Policy | Contract | EULA | NDA | Other",
  "one_liner": "one sentence plain english summary",
  "overall_risk": "low | medium | high",
  "risk_score": 0,
  "plain_summary": "3-4 sentence plain english explanation written like explaining to a friend",
  "what_you_agree_to": ["string", "string", "string"],
  "sketchy_clauses": [
    {
      "title": "short title",
      "quote": "exact short quote max 20 words",
      "plain": "what this actually means",
      "severity": "low | medium | high",
      "why_sketchy": "one sentence why concerning"
    }
  ],
  "your_rights": ["string", "string"],
  "data_collected": ["string", "string"],
  "can_delete_account": true,
  "sells_your_data": false,
  "can_change_terms": true,
  "arbitration_clause": false,
  "auto_renews": false,
  "verdict": "Safe to sign | Read carefully before signing | Proceed with caution | Avoid if possible",
  "verdict_reason": "one sentence explaining verdict"
}

Be honest and direct. If something is sketchy, say so. Return ONLY the JSON object."""


def analyze_legal(text: str) -> dict:
    trimmed = text[:12000]
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Analyze this legal document:\n\n{trimmed}"}
        ],
        temperature=0.3,
        max_tokens=3000,
    )
    raw = resp.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)
