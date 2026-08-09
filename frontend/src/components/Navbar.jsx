import React from 'react';
import { useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const getPageDetails = (path) => {
    switch (path) {
      case '/':
        return { title: 'Loan Risk Intelligence Dashboard', desc: 'Real-time Lending Club portfolio metrics & default risk distributions' };
      case '/pre-loan':
        return { title: 'Pre-Loan Eligibility Assessment', desc: 'Predict loan approval or rejection decision before underwriting' };
      case '/post-loan':
        return { title: 'Post-Loan Default Risk Monitoring', desc: 'Predict borrower default probability using 57-feature Stacking Classifier' };
      case '/model-insights':
        return { title: 'ML Model Insights & Explainability', desc: 'Model architecture, ROC-AUC performance curves, and SHAP drivers' };
      case '/data-quality':
        return { title: 'Dataset & Feature Quality', desc: 'Lending Club raw feature completeness and missing value analysis' };
      case '/about':
        return { title: 'About System Architecture', desc: 'Dual-Stage machine learning pipeline specification & technology stack' };
      default:
        return { title: 'Risk Intelligence Platform', desc: 'Dual-stage credit risk analytics' };
    }
  };

  const { title, desc } = getPageDetails(location.pathname);

  return (
    <header className="top-navbar">
      <div className="page-title-group">
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className="nav-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '6px 12px', borderRadius: '20px' }}>
          <Activity size={16} color="#10B981" />
          <span>Live API Status: Active</span>
        </div>
      </div>
    </header>
  );
}
