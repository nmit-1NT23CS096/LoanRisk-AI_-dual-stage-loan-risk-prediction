import React from 'react';
import { Info, Layers, Cpu, ShieldCheck, Database, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="workspace-padding">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info color="var(--color-primary)" size={24} />
            <span>Dual-Stage Loan Risk Prediction Platform</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '16px' }}>
          This platform is an enterprise-grade financial technology (FinTech) credit risk intelligence application. 
          Built on historical <strong>Lending Club loan data</strong>, it implements a <strong>Dual-Stage Machine Learning Pipeline</strong> 
          to deliver automated underwriting decisions for new loan applicants and real-time default risk monitoring for existing active borrowers.
        </p>
      </div>

      <div className="charts-grid">
        {/* Stage 1 Architecture */}
        <div className="card col-span-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ShieldCheck color="#2563EB" size={22} />
            <h3 style={{ fontSize: '1.1rem' }}>Stage 1: Pre-Loan Underwriting Eligibility</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Evaluates 14 applicant parameters (such as FICO score, DTI, annual income, loan amount, grade, employment length, and purpose) 
            prior to loan disbursement. It classifies applications into <strong>APPROVED</strong> or <strong>REJECTED</strong> with 
            underwriting approval probabilities.
          </p>
        </div>

        {/* Stage 2 Architecture */}
        <div className="card col-span-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Layers color="#8B5CF6" size={22} />
            <h3 style={{ fontSize: '1.1rem' }}>Stage 2: Post-Loan Active Borrower Default Risk</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Monitors existing active loans using a 57-feature Stacking Classifier ensemble (combining Random Forest, XGBoost, and Logistic Regression meta-learner). 
            It computes default probability (0-100%), risk tiers (Low, Medium, High, Very High), and SHAP key risk drivers.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu color="#10B981" size={20} />
          <span>Technology Stack Architecture</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary)', marginBottom: '4px' }}>Frontend Layer</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>React, Vite, JavaScript, React Router v6, Recharts, Lucide React</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#10B981', marginBottom: '4px' }}>Backend API Layer</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FastAPI, Python 3.11, Pydantic Schemas, Uvicorn CORS</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#8B5CF6', marginBottom: '4px' }}>Machine Learning</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scikit-Learn, StackingClassifier, XGBoost, SMOTE-ENN, SHAP</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#F59E0B', marginBottom: '4px' }}>Dataset & Pipeline</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lending Club accepted loans, 118 raw features, ColumnTransformer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
