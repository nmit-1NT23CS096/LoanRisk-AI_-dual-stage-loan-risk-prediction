# backend/services/ml_service.py
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer

# Patch scikit-learn version differences for unpickling ColumnTransformer
if not hasattr(ColumnTransformer, 'force_int_remainder_cols'):
    setattr(ColumnTransformer, 'force_int_remainder_cols', False)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

PRE_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'preloan', 'eligibility_lr.pkl')
POST_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'postloan', 'final_stacking_model.pkl')
POST_PREP_PATH = os.path.join(BASE_DIR, 'models', 'postloan', 'preprocess_pipeline.pkl')
POST_SEL_IDX_PATH = os.path.join(BASE_DIR, 'models', 'postloan', 'selected_feature_indices.pkl')
POST_RAW_COLS_PATH = os.path.join(BASE_DIR, 'models', 'postloan', 'raw_feature_columns.pkl')

import gc

class MLService:
    def __init__(self):
        self.pre_model = None
        self.post_model = None
        self.post_prep = None
        self.post_sel_idx = None
        self.post_raw_cols = None
        self._post_models_attempted = False
        self._load_pre_model()

    def _load_pre_model(self):
        # Load Pre-Loan Model eagerly since it's tiny (~6.7 KB)
        if os.path.exists(PRE_MODEL_PATH):
            try:
                self.pre_model = joblib.load(PRE_MODEL_PATH)
                print("Pre-loan model loaded successfully.")
            except Exception as e:
                print(f"Error loading pre-loan model: {e}")

    def _ensure_post_models_loaded(self):
        """Lazy load post-loan heavy stacking model assets only on demand."""
        if self._post_models_attempted:
            return
        self._post_models_attempted = True
        
        # Check if disabled via environment variable for ultra-low memory environments
        if os.getenv("DISABLE_HEAVY_POST_MODEL", "false").lower() == "true":
            print("Heavy post-loan model loading disabled via env var. Using heuristic fallback.")
            return

        try:
            print("Lazy loading post-loan model assets...")
            if os.path.exists(POST_MODEL_PATH):
                self.post_model = joblib.load(POST_MODEL_PATH)
            if os.path.exists(POST_PREP_PATH):
                self.post_prep = joblib.load(POST_PREP_PATH)
            if os.path.exists(POST_SEL_IDX_PATH):
                self.post_sel_idx = joblib.load(POST_SEL_IDX_PATH)
            if os.path.exists(POST_RAW_COLS_PATH):
                self.post_raw_cols = joblib.load(POST_RAW_COLS_PATH)
            print("Post-loan model assets loaded successfully.")
        except (MemoryError, Exception) as e:
            print(f"Post-loan model loading failed (will use heuristic fallback): {e}")
            self.post_model = None
            self.post_prep = None
        finally:
            gc.collect()

    def predict_pre_loan(self, input_data: dict) -> dict:
        """
        Input features expected: loan_amnt, term, int_rate, installment, grade, sub_grade,
        emp_length, home_ownership, annual_inc, verification_status, purpose, dti,
        fico_range_low, fico_range_high
        """
        features_df = pd.DataFrame([{
            'loan_amnt': float(input_data.get('loan_amount', 10000.0)),
            'term': str(input_data.get('loan_term', ' 36 months')),
            'int_rate': float(input_data.get('interest_rate', 12.5)),
            'installment': float(input_data.get('installment', 350.0)),
            'grade': str(input_data.get('grade', 'B')),
            'sub_grade': str(input_data.get('sub_grade', 'B2')),
            'emp_length': str(input_data.get('employment_length', '10+ years')),
            'home_ownership': str(input_data.get('home_ownership', 'RENT')),
            'annual_inc': float(input_data.get('annual_income', 60000.0)),
            'verification_status': str(input_data.get('verification_status', 'Verified')),
            'purpose': str(input_data.get('purpose', 'debt_consolidation')),
            'dti': float(input_data.get('dti', 15.0)),
            'fico_range_low': float(input_data.get('credit_score', 700)),
            'fico_range_high': float(input_data.get('credit_score', 700) + 4),
        }])

        # Ensure object dtypes instead of string extension dtypes to prevent pandas/sklearn type error
        for col in features_df.columns:
            if features_df[col].dtype.name in ['string', 'category']:
                features_df[col] = features_df[col].astype(object)

        if self.pre_model is not None:
            try:
                prob = float(self.pre_model.predict_proba(features_df)[0][1])
            except Exception as e:
                print(f"Pre-loan prediction fallback due to: {e}")
                prob = self._heuristic_pre_loan_prob(input_data)
        else:
            prob = self._heuristic_pre_loan_prob(input_data)

        decision = "APPROVED" if prob >= 0.5 else "REJECTED"
        risk_level = "LOW" if prob >= 0.75 else "MEDIUM" if prob >= 0.5 else "HIGH"

        positive_factors = []
        negative_factors = []
        if input_data.get('credit_score', 700) >= 700:
            positive_factors.append(f"Strong FICO Credit Score ({input_data.get('credit_score')})")
        else:
            negative_factors.append(f"Below average FICO Credit Score ({input_data.get('credit_score')})")

        if input_data.get('dti', 15.0) <= 20.0:
            positive_factors.append(f"Healthy Debt-to-Income Ratio ({input_data.get('dti')}%)")
        else:
            negative_factors.append(f"High Debt-to-Income Ratio ({input_data.get('dti')}%)")

        if input_data.get('annual_income', 60000) >= 75000:
            positive_factors.append(f"Substantial Annual Income (${input_data.get('annual_income'):,.0f})")

        return {
            "decision": decision,
            "probability": round(prob, 4),
            "approval_probability": round(prob * 100, 1),
            "risk_level": risk_level,
            "credit_score": input_data.get('credit_score', 700),
            "dti": input_data.get('dti', 15.0),
            "key_factors": {
                "positive": positive_factors,
                "negative": negative_factors
            }
        }

    def _heuristic_pre_loan_prob(self, data: dict) -> float:
        cs = data.get('credit_score', 700)
        dti = data.get('dti', 15.0)
        inc = data.get('annual_income', 60000.0)
        score = 0.4 + (cs - 600) / 500.0 - (dti / 100.0) * 0.3 + min(inc / 200000.0, 0.2)
        return float(np.clip(score, 0.05, 0.95))

    def predict_post_loan(self, input_data: dict) -> dict:
        """
        Post-loan default prediction using Stacking Classifier on 57 selected preprocessed features.
        """
        self._ensure_post_models_loaded()
        raw_cols = self.post_raw_cols if self.post_raw_cols else []
        row = {col: 0.0 for col in raw_cols}

        row['loan_amnt'] = float(input_data.get('loan_amount', 15000.0))
        row['funded_amnt'] = row['loan_amnt']
        row['funded_amnt_inv'] = row['loan_amnt']
        row['annual_inc'] = float(input_data.get('annual_income', 65000.0))
        row['dti'] = float(input_data.get('dti', 18.5))
        row['fico_range_low'] = float(input_data.get('credit_score', 680))
        row['fico_range_high'] = row['fico_range_low'] + 4.0
        row['last_fico_range_low'] = row['fico_range_low']
        row['last_fico_range_high'] = row['fico_range_high']
        row['int_rate'] = float(input_data.get('interest_rate', 12.5))
        row['revol_bal'] = float(input_data.get('revol_bal', 12000.0))
        row['revol_util'] = float(input_data.get('revol_util', 45.0))
        row['out_prncp'] = float(input_data.get('out_prncp', 5000.0))
        row['out_prncp_inv'] = row['out_prncp']
        row['tot_cur_bal'] = float(input_data.get('tot_cur_bal', 45000.0))
        row['total_acc'] = float(input_data.get('total_acc', 15))
        row['delinq_2yrs'] = float(input_data.get('delinq_2yrs', 0))
        row['pub_rec'] = float(input_data.get('pub_rec', 0))
        row['mort_acc'] = float(input_data.get('mort_acc', 1))
        row['term'] = str(input_data.get('loan_term', ' 36 months'))
        row['home_ownership'] = str(input_data.get('home_ownership', 'RENT'))
        row['purpose'] = str(input_data.get('purpose', 'debt_consolidation'))
        row['emp_length'] = str(input_data.get('employment_length', '5 years'))
        row['verification_status'] = 'Verified'
        row['initial_list_status'] = 'f'
        row['application_type'] = 'Individual'

        df_raw = pd.DataFrame([row])
        for col in df_raw.columns:
            if df_raw[col].dtype.name in ['string', 'category']:
                df_raw[col] = df_raw[col].astype(object)

        default_prob = 0.20
        if self.post_prep is not None and self.post_model is not None and self.post_sel_idx is not None:
            try:
                X_prep = self.post_prep.transform(df_raw)
                X_sel = X_prep[:, self.post_sel_idx]
                default_prob = float(self.post_model.predict_proba(X_sel)[0][1])
            except Exception as e:
                print(f"Post-loan model transform error: {e}")
                default_prob = self._heuristic_post_loan_prob(input_data)
        else:
            default_prob = self._heuristic_post_loan_prob(input_data)

        if default_prob >= 0.60:
            risk_category = "VERY HIGH"
        elif default_prob >= 0.35:
            risk_category = "HIGH"
        elif default_prob >= 0.15:
            risk_category = "MEDIUM"
        else:
            risk_category = "LOW"

        prediction = "DEFAULT" if default_prob >= 0.50 else "NON-DEFAULT"

        risk_drivers = [
            {"feature": "Credit Score (FICO)", "impact": "+ High Risk" if input_data.get('credit_score', 680) < 660 else "- Reduced Risk"},
            {"feature": "Revolving Utilization", "impact": "+ High Risk" if input_data.get('revol_util', 45) > 60 else "- Healthy Level"},
            {"feature": "Debt-to-Income (DTI)", "impact": "+ High Risk" if input_data.get('dti', 18.5) > 25 else "- Acceptable"},
            {"feature": "Recent Delinquencies", "impact": "+ High Risk" if input_data.get('delinq_2yrs', 0) > 0 else "- Clear Record"},
            {"feature": "Outstanding Principal", "impact": f"${input_data.get('out_prncp', 5000):,.0f} balance exposure"}
        ]

        return {
            "default_probability": round(default_prob, 4),
            "probability_pct": round(default_prob * 100, 1),
            "prediction": prediction,
            "risk_category": risk_category,
            "risk_level": risk_category,
            "credit_score": input_data.get('credit_score', 680),
            "dti": input_data.get('dti', 18.5),
            "risk_drivers": risk_drivers
        }

    def _heuristic_post_loan_prob(self, data: dict) -> float:
        cs = data.get('credit_score', 680)
        dti = data.get('dti', 18.5)
        util = data.get('revol_util', 45.0)
        delinq = data.get('delinq_2yrs', 0)
        
        prob = 0.15 + (720 - cs) / 400.0 + (dti / 100.0) * 0.2 + (util / 100.0) * 0.25 + delinq * 0.1
        return float(np.clip(prob, 0.02, 0.95))

ml_service = MLService()
