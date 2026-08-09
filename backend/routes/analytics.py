# backend/routes/analytics.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..services.analytics import (
    get_summary,
    get_analytics_charts,
    get_top_risk_loans,
    get_risk_drivers,
    get_data_quality,
    get_model_performance
)

router = APIRouter()

@router.get('/dashboard/summary')
@router.get('/analytics/summary')
async def summary(
    grade: Optional[str] = Query(None),
    purpose: Optional[str] = Query(None),
    term: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None)
):
    """Return aggregated KPIs for the dashboard."""
    try:
        return get_summary(grade=grade, purpose=purpose, term=term, risk_level=risk_level)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/dashboard/analytics')
@router.get('/analytics/charts')
async def analytics_charts(
    grade: Optional[str] = Query(None),
    purpose: Optional[str] = Query(None),
    term: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None)
):
    """Return chart data for all 9 dashboard visualizations."""
    try:
        return get_analytics_charts(grade=grade, purpose=purpose, term=term, risk_level=risk_level)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/dashboard/risk-drivers')
@router.get('/analytics/risk-drivers')
async def risk_drivers():
    """Return SHAP or feature-importance data for risk drivers visualization."""
    try:
        return get_risk_drivers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/dashboard/top-risk-loans')
@router.get('/analytics/top-risk-loans')
async def top_risk_loans():
    """Return top 10 loans with highest default probability."""
    try:
        return get_top_risk_loans()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/model/performance')
async def model_performance():
    """Return metrics and performance info for Pre-Loan and Post-Loan ML models."""
    try:
        return get_model_performance()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/data-quality')
async def data_quality():
    """Return data quality metrics and column statistics."""
    try:
        return get_data_quality()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
