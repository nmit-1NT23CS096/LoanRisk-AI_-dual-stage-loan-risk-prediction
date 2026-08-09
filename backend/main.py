# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import PreLoanInput, PostLoanInput
from .routes import analytics
from .services.ml_service import ml_service

app = FastAPI(
    title="Dual-Stage Loan Risk Prediction API",
    description="FastAPI backend serving Pre-Loan Eligibility and Post-Loan Default Risk prediction models and portfolio analytics.",
    version="1.0.0"
)

# Configure CORS to allow React dev server (Vite default port 5173 and others)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include analytics routes under /api prefix and root
app.include_router(analytics.router, prefix="/api", tags=["Analytics & Insights"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Dual-Stage Loan Risk Prediction Platform API is running.",
        "documentation": "/docs"
    }

# Pre-Loan Prediction Endpoints
@app.post('/api/pre-loan/predict', tags=["Model Predictions"])
@app.post('/predict/pre', tags=["Model Predictions"])
async def predict_pre(data: PreLoanInput):
    """Predict loan approval/rejection decision and probability for applicant."""
    try:
        result = ml_service.predict_pre_loan(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pre-loan prediction failed: {str(e)}")

# Post-Loan Default Risk Prediction Endpoints
@app.post('/api/post-loan/predict', tags=["Model Predictions"])
@app.post('/predict/post', tags=["Model Predictions"])
async def predict_post(data: PostLoanInput):
    """Predict default probability and risk level for existing borrower."""
    try:
        result = ml_service.predict_post_loan(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Post-loan prediction failed: {str(e)}")
