import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { predictPreLoan } from '../services/api';

export default function PreLoan() {
  const [formData, setFormData] = useState({
    annual_income: 75000,
    employment_length: '10+ years',
    credit_score: 720,
    loan_amount: 15000,
    loan_term: ' 36 months',
    interest_rate: 10.5,
    installment: 487.5,
    grade: 'B',
    sub_grade: 'B2',
    home_ownership: 'MORTGAGE',
    verification_status: 'Verified',
    purpose: 'debt_consolidation',
    dti: 16.5
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictPreLoan(formData);
      setResult(res);
    } catch (err) {
      console.error('Pre-loan prediction error:', err);
      setError('Failed to calculate pre-loan decision. Please check backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-padding">
      <div className="charts-grid">
        {/* Input Form Column */}
        <div className="card col-span-6">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck color="var(--color-primary)" size={22} />
              <span>Applicant Pre-Loan Eligibility Form</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Annual Income ($)</label>
                <input 
                  type="number" 
                  name="annual_income" 
                  value={formData.annual_income} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>FICO Credit Score</label>
                <input 
                  type="number" 
                  name="credit_score" 
                  value={formData.credit_score} 
                  onChange={handleChange} 
                  min="300" 
                  max="850" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Requested Loan Amount ($)</label>
                <input 
                  type="number" 
                  name="loan_amount" 
                  value={formData.loan_amount} 
                  onChange={handleChange} 
                  min="500" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Debt-to-Income (DTI %)</label>
                <input 
                  type="number" 
                  name="dti" 
                  value={formData.dti} 
                  onChange={handleChange} 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Employment Length</label>
                <select name="employment_length" value={formData.employment_length} onChange={handleChange}>
                  <option value="< 1 year">&lt; 1 year</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="5 years">5 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loan Term</label>
                <select name="loan_term" value={formData.loan_term} onChange={handleChange}>
                  <option value=" 6 months">6 Months</option>
                  <option value=" 12 months">12 Months</option>
                  <option value=" 18 months">18 Months</option>
                  <option value=" 24 months">24 Months</option>
                  <option value=" 30 months">30 Months</option>
                  <option value=" 36 months">36 Months</option>
                  <option value=" 42 months">42 Months</option>
                  <option value=" 48 months">48 Months</option>
                  <option value=" 54 months">54 Months</option>
                  <option value=" 60 months">60 Months</option>
                </select>
              </div>

              <div className="form-group">
                <label>Home Ownership</label>
                <select name="home_ownership" value={formData.home_ownership} onChange={handleChange}>
                  <option value="RENT">RENT</option>
                  <option value="MORTGAGE">MORTGAGE</option>
                  <option value="OWN">OWN</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loan Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange}>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="credit_card">Credit Card Refinancing</option>
                  <option value="home_improvement">Home Improvement</option>
                  <option value="major_purchase">Major Purchase</option>
                  <option value="small_business">Small Business</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Loan Grade</label>
                <select name="grade" value={formData.grade} onChange={handleChange}>
                  <option value="A">Grade A (Lowest Risk)</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                  <option value="E">Grade E</option>
                </select>
              </div>

              <div className="form-group">
                <label>Income Verification</label>
                <select name="verification_status" value={formData.verification_status} onChange={handleChange}>
                  <option value="Verified">Verified</option>
                  <option value="Source Verified">Source Verified</option>
                  <option value="Not Verified">Not Verified</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Evaluating Model Inference...' : 'Evaluate Pre-Loan Eligibility'}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results Column */}
        <div className="col-span-6">
          <div className="card result-box" style={{ minHeight: '100%' }}>
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck color="var(--color-primary)" size={22} />
                <span>Underwriting Decision Output</span>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            {!result && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <FileCheck size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>Awaiting Application Evaluation</p>
                <p style={{ fontSize: '0.85rem' }}>Fill in the applicant profile details and click Evaluate Pre-Loan Eligibility to view model decision.</p>
              </div>
            )}

            {result && (
              <div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: result.decision === 'APPROVED' ? '#ECFDF5' : '#FEF2F2', borderRadius: '12px', marginBottom: '20px', border: `1px solid ${result.decision === 'APPROVED' ? '#A7F3D0' : '#FECACA'}` }}>
                  {result.decision === 'APPROVED' ? (
                    <CheckCircle2 size={42} color="#10B981" style={{ marginBottom: '8px' }} />
                  ) : (
                    <XCircle size={42} color="#EF4444" style={{ marginBottom: '8px' }} />
                  )}
                  <h2 style={{ color: result.decision === 'APPROVED' ? '#065F46' : '#991B1B', fontSize: '1.6rem' }}>
                    DECISION: {result.decision}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: result.decision === 'APPROVED' ? '#047857' : '#B91C1C', marginTop: '4px' }}>
                    Applicant meets pre-loan approval metrics
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>Approval Probability:</span>
                    <span>{result.approval_probability}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${result.approval_probability}%`, 
                        backgroundColor: result.decision === 'APPROVED' ? '#10B981' : '#EF4444' 
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Assessed Risk Level:</span>
                  <span className={`risk-badge ${result.risk_level?.toLowerCase()}`}>
                    {result.risk_level} RISK
                  </span>
                </div>

                {result.key_factors && (
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: '10px' }}>Key Decision Factors:</h4>
                    {result.key_factors.positive?.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10B981', marginBottom: '4px' }}>Positive Influences:</div>
                        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {result.key_factors.positive.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.key_factors.negative?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#EF4444', marginBottom: '4px' }}>Risk Concerns:</div>
                        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {result.key_factors.negative.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
