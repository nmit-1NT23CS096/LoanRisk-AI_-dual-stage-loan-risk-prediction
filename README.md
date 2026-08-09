# Dual-Stage Loan Risk Prediction System

An imbalance-aware, dual-stage loan risk prediction system built using Python machine learning, ensemble learning, explainable AI (SHAP) techniques, and an interactive modern web interface.

---

## Project Overview

This system implements a comprehensive end-to-end machine learning and analytics workflow for loan underwriting and risk monitoring, trained and evaluated on the **Lending Club** dataset (100,000 records). 

The risk evaluation is split into two distinct, sequential stages:

### Stage 1: Pre-Loan Eligibility Assessment (Underwriting)
Predicts applicant eligibility **before** loan approval, evaluating whether the applicant meets standard underwriting metrics.
- **Model:** 14-feature Logistic Regression Pipeline (`eligibility_lr.pkl`).
- **Target:** Approval / Rejection Decision.

### Stage 2: Post-Loan Default Risk Monitoring (Servicing)
Predicts the probability of default **after** loan issuance using credit performance, balance updates, and macro-features.
- **Model:** 57-feature Stacking Ensemble Classifier (`final_stacking_model.pkl`).
- **Target:** Probability of default (Low, Medium, High, or Very High Risk).
- **Explainability:** SHAP feature attribution to explain key risk drivers for each borrower.

---

## Core Features

- **Dual-Stage Risk Pipeline** – Sequential pre-loan approval checking and post-loan default risk profiling.
- **Advanced Ensemble Learning** – Stacking Classifier combining multiple base models for superior default risk detection.
- **Modern Dashboard UI** – Real-time portfolio KPIs, 9 interactive analytical charts (using Recharts), and dynamic filtering.
- **Real-Time Model Inference** – Live inference pipelines for both stages with instant feedback.
- **Explainable AI** – Renders key risk drivers and SHAP-based feature impact scores for default predictions.
- **Sticky & Responsive Design** – Premium dark-mode sidebar navigation, grid form layout, and balanced display columns.

---

## Folder Structure

```
Dual Stage Loan Risk Prediction/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── schemas.py                 # Pydantic request & response models
│   ├── routes/
│   │   └── analytics.py           # Dashboard, model performance, and data-quality routes
│   └── services/
│       ├── analytics.py           # Dataset aggregation and charting service
│       └── ml_service.py          # Pre-loan and Post-loan model inference
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js             # Vite configuration with proxy to FastAPI
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Layout shell and react-router-dom configuration
│       ├── index.css              # Custom CSS rules and dark-themed navigation
│       ├── components/
│       │   ├── Sidebar.jsx        # Sticky navigation sidebar
│       │   ├── Navbar.jsx         # Custom top header bar
│       │   └── KpiCard.jsx        # Dashboard KPI metrics block
│       ├── pages/
│       │   ├── Dashboard.jsx      # Portfolio overview, filters, charts, and top-risk table
│       │   ├── PreLoan.jsx        # Pre-loan eligibility input form (balanced grid)
│       │   ├── PostLoan.jsx       # Post-loan default prediction form (balanced grid)
│       │   ├── ModelInsights.jsx  # Model architecture, ROC-AUC, and parameters
│       │   ├── DataQuality.jsx    # Dataset analysis (100k records, completeness stats)
│       │   └── About.jsx          # System architecture breakdown
│       └── services/
│           └── api.js             # Axios-based backend API service layers
├── models/
│   ├── preloan/
│   │   └── eligibility_lr.pkl     # Serialized Logistic Regression pipeline
│   └── postloan/
│       ├── final_stacking_model.pkl     # Stacking Classifier ensemble model
│       ├── preprocess_pipeline.pkl      # ColumnTransformer pipeline
│       ├── selected_feature_indices.pkl # Selected feature indices mapping
│       └── raw_feature_columns.pkl      # Raw column names checklist
└── notebooks/
    └── loan_default_final_ready.csv     # Lending Club dataset source (100k records)
```

---

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+

### Setup Commands

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Dual Stage Loan Risk Prediction"

# 2. Setup Python Virtual Environment (Windows)
python -m venv .venv
.venv\Scripts\activate

# 3. Install Backend Dependencies
pip install -r requirements.txt

# 4. Install Frontend Dependencies
cd frontend
npm install
```

---

## Running the Application

Both servers must be running to enable live predictions:

### 1. Start the FastAPI Backend
```bash
# Run from the project root directory
uvicorn backend.main:app --reload --port 8000
```
- Visit `http://127.0.0.1:8000/docs` to access the interactive Swagger API documentation.

### 2. Start the React Frontend
```bash
# Run from the frontend directory
npm run dev
```
- Open `http://localhost:5173` to explore the live web interface.

---

## API Documentation

### Model Inference Endpoints
* **`POST /api/pre-loan/predict`** (fallback: `/predict/pre`)
  * **Payload:** `PreLoanInput` (FICO score, loan amount, DTI, income, employment length, term, grade, home ownership, purpose, verification)
  * **Response:** Pre-loan eligibility decision (`APPROVED` or `REJECTED`), approval probability percentage, risk level, and positive/negative influences.
  
* **`POST /api/post-loan/predict`** (fallback: `/predict/post`)
  * **Payload:** `PostLoanInput` (FICO, DTI, income, term, rate, home ownership, purpose, active credit balances, revolving lines, delinquencies, total accounts)
  * **Response:** Default prediction status (`DEFAULT` or `FULLY PAID`), risk default probability percentage, risk category, and key risk drivers table.

### Analytics & Metadata Endpoints
* **`GET /api/dashboard/summary`** (fallback: `/api/analytics/summary`) – Returns portfolio statistics (total records, loan volumes, average interest rates, DTI, average FICO scores).
* **`GET /api/dashboard/analytics`** (fallback: `/api/analytics/charts`) – Returns chart datasets for all 9 dashboard widgets.
* **`GET /api/dashboard/top-risk-loans`** – Lists the top 10 active loans with the highest default probability.
* **`GET /api/model/performance`** – Returns model architecture specs, thresholds, and metrics.
* **`GET /api/data-quality`** – Returns column-level data quality, missing ratios, and dataset dimensions.

---

## Model Metrics & Performance

- **Pre-Loan Model (Logistic Regression Pipeline):**
  - **ROC-AUC:** `0.865`
  - **F1 Score:** `0.812`
  - **Primary Features:** FICO Score, DTI Ratio, Requested Loan Amount, Income.

- **Post-Loan Model (Stacking Classifier Ensemble):**
  - **ROC-AUC:** `0.912`
  - **Recall (Default Class):** `0.854` (highly optimized to minimize default leakage)
  - **Primary Risk Drivers:** Revolving Utilization, Outstanding Principal, Interest Rate, Revolving Balance, Public Derogatory Records.

---

## Author

**K Mallikarjun**
