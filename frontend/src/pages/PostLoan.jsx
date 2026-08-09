import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, Activity, Zap } from 'lucide-react';
import { predictPostLoan } from '../services/api';

export default function PostLoan() {
  const [formData, setFormData] = useState({
    annual_income: 65000,
    employment_length: '5 years',
    credit_score: 670,
    loan_amount: 20000,
    loan_term: ' 36 months',
    interest_rate: 14.5,
    home_ownership: 'RENT',
    purpose: 'debt_consolidation',
    dti: 24.5,
    delinq_2yrs: 1,
    revol_bal: 18500,
    revol_util: 68.0,
    total_acc: 18,
    out_prncp: 12400,
    tot_cur_bal: 42000,
    mort_acc: 0,
    pub_rec: 0
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
      const res = await predictPostLoan(formData);
      setResult(res);
    } catch (err) {
      console.error('Post-loan risk prediction error:', err);
      setError('Failed to calculate post-loan default risk. Please check backend API.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (category) => {
    switch (category?.toUpperCase()) {
      case 'LOW': return 'risk-badge low';
      case 'MEDIUM': return 'risk-badge medium';
      case 'HIGH': return 'risk-badge high';
      case 'VERY HIGH': return 'risk-badge very-high';
      default: return 'risk-badge low';
    }
  };

  return (
    <div className="workspace-padding">
      <div className="charts-grid">
        {/* Input Form Column */}
        <div className="card col-span-6">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert color="var(--risk-high)" size={22} />
              <span>Borrower Active Credit & Performance Form</span>
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
                <label>Home Ownership</label>
                <select name="home_ownership" value={formData.home_ownership} onChange={handleChange}>
                  <option value="RENT">RENT</option>
                  <option value="MORTGAGE">MORTGAGE</option>
                  <option value="OWN">OWN</option>
                </select>
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
                <label>Current DTI Ratio (%)</label>
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
                <label>Original Loan Amount ($)</label>
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
                <label>Interest Rate (%)</label>
                <input 
                  type="number" 
                  name="interest_rate" 
                  value={formData.interest_rate} 
                  onChange={handleChange} 
                  step="0.01" 
                  min="0" 
                  max="100" 
                  required 
                />
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
                <label>Outstanding Principal ($)</label>
                <input 
                  type="number" 
                  name="out_prncp" 
                  value={formData.out_prncp} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Revolving Balance ($)</label>
                <input 
                  type="number" 
                  name="revol_bal" 
                  value={formData.revol_bal} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Revolving Utilization (%)</label>
                <input 
                  type="number" 
                  name="revol_util" 
                  value={formData.revol_util} 
                  onChange={handleChange} 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Total Credit Accounts</label>
                <input 
                  type="number" 
                  name="total_acc" 
                  value={formData.total_acc} 
                  onChange={handleChange} 
                  min="1" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Mortgage Accounts</label>
                <input 
                  type="number" 
                  name="mort_acc" 
                  value={formData.mort_acc} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Total Current Balance ($)</label>
                <input 
                  type="number" 
                  name="tot_cur_bal" 
                  value={formData.tot_cur_bal} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>2-Year Delinquencies</label>
                <input 
                  type="number" 
                  name="delinq_2yrs" 
                  value={formData.delinq_2yrs} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Public Derogatory Records</label>
                <input 
                  type="number" 
                  name="pub_rec" 
                  value={formData.pub_rec} 
                  onChange={handleChange} 
                  min="0" 
                  required 
                />
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', backgroundColor: '#0F172A' }}>
                {loading ? 'Running Stacking Ensemble Model...' : 'Calculate Borrower Default Probability'}
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
                <Activity color="var(--risk-high)" size={22} />
                <span>Post-Loan Default Assessment</span>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            {!result && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <ShieldAlert size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>Awaiting Borrower Risk Execution</p>
                <p style={{ fontSize: '0.85rem' }}>Enter current borrower performance metrics and click Calculate Borrower Default Probability.</p>
              </div>
            )}

            {result && (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: result.prediction === 'DEFAULT' ? '#FEF2F2' : '#ECFDF5', 
                  borderRadius: '12px', 
                  marginBottom: '20px', 
                  border: `1px solid ${result.prediction === 'DEFAULT' ? '#FECACA' : '#A7F3D0'}` 
                }}>
                  {result.prediction === 'DEFAULT' ? (
                    <AlertTriangle size={42} color="#EF4444" style={{ marginBottom: '8px' }} />
                  ) : (
                    <CheckCircle size={42} color="#10B981" style={{ marginBottom: '8px' }} />
                  )}
                  <h2 style={{ color: result.prediction === 'DEFAULT' ? '#991B1B' : '#065F46', fontSize: '1.6rem' }}>
                    PREDICTION: {result.prediction}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: result.prediction === 'DEFAULT' ? '#B91C1C' : '#047857', marginTop: '4px' }}>
                    57-Feature Stacking Classifier Model Output
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>Model Default Probability:</span>
                    <span>{result.probability_pct}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${result.probability_pct}%`, 
                        backgroundColor: result.probability_pct >= 50 ? '#EF4444' : result.probability_pct >= 25 ? '#F97316' : '#10B981' 
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Risk Category:</span>
                  <span className={getBadgeClass(result.risk_category)}>
                    {result.risk_category} RISK
                  </span>
                </div>

                {result.risk_drivers && (
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={16} color="#F59E0B" />
                      <span>Key Risk Drivers & Feature Impact:</span>
                    </h4>
                    <div className="data-table-container">
                      <table className="data-table" style={{ fontSize: '0.82rem' }}>
                        <thead>
                          <tr>
                            <th>Feature</th>
                            <th>Impact Direction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.risk_drivers.map((driver, idx) => (
                            <tr key={idx}>
                              <td><strong>{driver.feature}</strong></td>
                              <td style={{ color: driver.impact?.includes('High Risk') ? '#EF4444' : '#10B981' }}>
                                {driver.impact}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
