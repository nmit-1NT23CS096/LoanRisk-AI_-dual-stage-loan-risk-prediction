# backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PreLoanInput(BaseModel):
    annual_income: float = Field(..., ge=0, description="Annual income of the applicant")
    employment_length: str = Field(..., description="Employment length (e.g. '10+ years', '2 years')")
    credit_score: int = Field(..., ge=300, le=850, description="FICO credit score")
    loan_amount: float = Field(..., ge=500, description="Requested loan amount")
    loan_term: str = Field(default=" 36 months", description="Loan term e.g., ' 36 months' or ' 60 months'")
    interest_rate: float = Field(default=12.5, ge=0, le=100, description="Interest rate percentage")
    installment: float = Field(default=350.0, ge=0, description="Monthly installment")
    grade: str = Field(default="B", description="Loan grade (A-G)")
    sub_grade: str = Field(default="B2", description="Loan sub-grade (e.g. B2)")
    home_ownership: str = Field(default="RENT", description="Home ownership status (RENT, OWN, MORTGAGE)")
    verification_status: str = Field(default="Verified", description="Income verification status")
    purpose: str = Field(default="debt_consolidation", description="Loan purpose")
    dti: float = Field(default=15.0, ge=0, le=100, description="Debt-to-income ratio")

class PostLoanInput(BaseModel):
    annual_income: float = Field(..., ge=0)
    employment_length: str = Field(...)
    credit_score: int = Field(..., ge=300, le=850)
    loan_amount: float = Field(..., ge=500)
    loan_term: str = Field(default=" 36 months")
    interest_rate: float = Field(default=12.5, ge=0, le=100)
    home_ownership: str = Field(default="RENT")
    purpose: str = Field(default="debt_consolidation")
    dti: float = Field(default=18.5, ge=0, le=100)
    delinq_2yrs: int = Field(default=0, ge=0)
    revol_bal: float = Field(default=12000.0, ge=0)
    revol_util: float = Field(default=45.0, ge=0, le=100)
    total_acc: int = Field(default=15, ge=0)
    out_prncp: float = Field(default=5000.0, ge=0)
    tot_cur_bal: float = Field(default=45000.0, ge=0)
    mort_acc: int = Field(default=1, ge=0)
    pub_rec: int = Field(default=0, ge=0)
    payment_status: Optional[str] = Field(default="on_time")

class FilterRequest(BaseModel):
    grade: Optional[str] = None
    purpose: Optional[str] = None
    term: Optional[str] = None
    risk_level: Optional[str] = None
