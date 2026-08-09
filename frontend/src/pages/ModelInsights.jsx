import React, { useState, useEffect } from 'react';
import { BrainCircuit, Award, Layers, BarChart2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchModelPerformance } from '../services/api';

export default function ModelInsights() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelPerformance()
      .then(res => setPerformance(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="workspace-padding">
      <div className="charts-grid">
        {/* Model 1: Pre-Loan Model Card */}
        <div className="card col-span-6">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#2563EB" size={22} />
              <span>Stage 1: Pre-Loan Eligibility Model</span>
            </div>
            <span className="risk-badge low">Logistic Regression</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Evaluates initial applicant eligibility based on 14 key financial parameters prior to underwriting approval.
          </p>

          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ROC-AUC Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB' }}>
                {loading ? '...' : performance?.pre_loan_model?.roc_auc}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model Accuracy</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
                {loading ? '...' : `${(performance?.pre_loan_model?.accuracy * 100).toFixed(1)}%`}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Precision</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8B5CF6' }}>
                {loading ? '...' : `${(performance?.pre_loan_model?.precision * 100).toFixed(1)}%`}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>F1 Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>
                {loading ? '...' : performance?.pre_loan_model?.f1_score}
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>14 Selected Input Features:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['loan_amnt', 'term', 'int_rate', 'installment', 'grade', 'sub_grade', 'emp_length', 'home_ownership', 'annual_inc', 'verification_status', 'purpose', 'dti', 'fico_range_low', 'fico_range_high'].map(f => (
              <span key={f} style={{ fontSize: '0.78rem', padding: '4px 8px', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Model 2: Post-Loan Stacking Model Card */}
        <div className="card col-span-6">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers color="#8B5CF6" size={22} />
              <span>Stage 2: Post-Loan Stacking Ensemble</span>
            </div>
            <span className="risk-badge very-high">Stacking Classifier</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Multi-stage stacking ensemble model combining Random Forest, XGBoost, and Logistic Regression meta-learner across 57 selected features.
          </p>

          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ROC-AUC Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8B5CF6' }}>
                {loading ? '...' : performance?.post_loan_model?.roc_auc}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model Accuracy</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
                {loading ? '...' : `${(performance?.post_loan_model?.accuracy * 100).toFixed(1)}%`}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Precision</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB' }}>
                {loading ? '...' : `${(performance?.post_loan_model?.precision * 100).toFixed(1)}%`}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>F1 Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7' }}>
                {loading ? '...' : performance?.post_loan_model?.f1_score}
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Stacking Architecture Breakdown:</h4>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '20px' }}>
            <li><strong>Base Learner 1:</strong> Random Forest Classifier (300 estimators)</li>
            <li><strong>Base Learner 2:</strong> XGBoost Classifier (max depth 6, lr 0.05)</li>
            <li><strong>Meta Learner:</strong> Logistic Regression (max_iter=1000)</li>
            <li><strong>Preprocessing:</strong> ColumnTransformer + SMOTE-ENN handling imbalance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
