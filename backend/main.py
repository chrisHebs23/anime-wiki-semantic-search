from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import SearchRequest
from services import generate_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/recommend")
async def recommend(request: SearchRequest):
    try:
        recommendation = generate_response(request.query)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendation: {str(e)}",
        )

    return {"query": request.query, "recommendation": recommendation}
