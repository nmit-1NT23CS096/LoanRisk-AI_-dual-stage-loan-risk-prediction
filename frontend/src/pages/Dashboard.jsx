import React, { useState, useEffect } from 'react';
import { 
  FileText, DollarSign, CheckCircle2, AlertTriangle, 
  TrendingUp, Calculator, Award, PieChart as PieIcon, Filter, AlertCircle 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { fetchDashboardSummary, fetchDashboardAnalytics, fetchTopRiskLoans } from '../services/api';

export default function Dashboard() {
  const [filters, setFilters] = useState({
    grade: 'ALL',
    purpose: 'ALL',
    term: 'ALL',
    risk_level: 'ALL'
  });

  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [topLoans, setTopLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = {};
      if (filters.grade !== 'ALL') activeFilters.grade = filters.grade;
      if (filters.purpose !== 'ALL') activeFilters.purpose = filters.purpose;
      if (filters.term !== 'ALL') activeFilters.term = filters.term;
      if (filters.risk_level !== 'ALL') activeFilters.risk_level = filters.risk_level;

      const [sumRes, chartRes, loansRes] = await Promise.all([
        fetchDashboardSummary(activeFilters),
        fetchDashboardAnalytics(activeFilters),
        fetchTopRiskLoans()
      ]);

      setSummary(sumRes);
      setCharts(chartRes);
      setTopLoans(loansRes);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(`Failed to connect to backend server (${err.message || 'Network Error'}). Please check that the API is active.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case 'LOW': return 'risk-badge low';
      case 'MEDIUM': return 'risk-badge medium';
      case 'HIGH': return 'risk-badge high';
      case 'VERY HIGH': return 'risk-badge very-high';
      default: return 'risk-badge low';
    }
  };

  return (
    <div className="workspace-padding">
      {/* Filters Toolbar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-main)' }}>
          <Filter size={18} color="var(--color-primary)" />
          <span>Portfolio Filters:</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Loan Grade:</label>
          <select name="grade" value={filters.grade} onChange={handleFilterChange} className="filter-select">
            <option value="ALL">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="E">Grade E</option>
            <option value="F">Grade F</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Purpose:</label>
          <select name="purpose" value={filters.purpose} onChange={handleFilterChange} className="filter-select">
            <option value="ALL">All Purposes</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="credit_card">Credit Card</option>
            <option value="home_improvement">Home Improvement</option>
            <option value="major_purchase">Major Purchase</option>
            <option value="small_business">Small Business</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Loan Term:</label>
          <select name="term" value={filters.term} onChange={handleFilterChange} className="filter-select">
            <option value="ALL">All Terms</option>
            <option value=" 36 months">36 Months</option>
            <option value=" 60 months">60 Months</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Risk Level:</label>
          <select name="risk_level" value={filters.risk_level} onChange={handleFilterChange} className="filter-select">
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 8 Executive KPI Cards */}
      <div className="kpi-grid">
        <KpiCard 
          label="Total Applications" 
          value={loading ? '...' : summary?.total_applications?.toLocaleString()} 
          subtext="Lending Club raw records" 
          icon={FileText} 
          color="#2563EB"
        />
        <KpiCard 
          label="Total Loan Amount" 
          value={loading ? '...' : `$${(summary?.total_loan_amount / 1e6)?.toFixed(2)}M`} 
          subtext="Total principal issued" 
          icon={DollarSign} 
          color="#10B981"
        />
        <KpiCard 
          label="Approval Rate" 
          value={loading ? '...' : `${summary?.approval_rate_pct}%`} 
          subtext="Underwriting approval" 
          icon={CheckCircle2} 
          color="#059669"
        />
        <KpiCard 
          label="Historical Default Rate" 
          value={loading ? '...' : `${summary?.historical_default_rate_pct}%`} 
          subtext="Charged off loans" 
          icon={AlertTriangle} 
          color="#EF4444"
        />
        <KpiCard 
          label="High-Risk Loans" 
          value={loading ? '...' : summary?.high_risk_loans?.toLocaleString()} 
          subtext="High default exposure" 
          icon={AlertCircle} 
          color="#F97316"
        />
        <KpiCard 
          label="Average Loan Amount" 
          value={loading ? '...' : `$${summary?.average_loan_amount?.toLocaleString(undefined, {maximumFractionDigits:0})}`} 
          subtext="Mean principal size" 
          icon={Calculator} 
          color="#8B5CF6"
        />
        <KpiCard 
          label="Average Credit Score" 
          value={loading ? '...' : summary?.average_credit_score?.toFixed(0)} 
          subtext="Mean FICO score" 
          icon={Award} 
          color="#0284C7"
        />
        <KpiCard 
          label="Average DTI" 
          value={loading ? '...' : `${summary?.average_dti?.toFixed(1)}%`} 
          subtext="Debt-to-income ratio" 
          icon={TrendingUp} 
          color="#6366F1"
        />
      </div>

      {/* 9 Visual Charts Grid */}
      <div className="charts-grid">
        {/* Chart 1: Loan Status Distribution */}
        <div className="card col-span-4">
          <div className="card-title">
            <span>1. Loan Status Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={charts?.status_distribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#10B981" />
                <Cell key="cell-1" fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Default vs Non-Default */}
        <div className="card col-span-4">
          <div className="card-title">
            <span>2. Default vs Non-Default Volume</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.default_vs_non || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {(charts?.default_vs_non || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 9: Portfolio Risk Exposure */}
        <div className="card col-span-4">
          <div className="card-title">
            <span>9. Portfolio Exposure by Risk Level</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={charts?.portfolio_exposure || []}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="exposure_amount"
                nameKey="risk_level"
              >
                {(charts?.portfolio_exposure || []).map((entry, index) => (
                  <Cell key={`cell-risk-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1e3).toFixed(1)}k`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Default Rate by Credit Score */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>3. Default Rate by Credit Score Range (%)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.default_by_credit_score || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="score_range" />
              <YAxis unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="default_rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Default Rate by DTI */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>4. Default Rate by Debt-to-Income (DTI) Range (%)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.default_by_dti || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dti_range" />
              <YAxis unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="default_rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Default Rate by Loan Grade */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>5. Default Rate by Loan Grade (%)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.default_by_grade || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="grade" />
              <YAxis unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="default_rate" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 6: Default Rate Trend */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>6. Historical Default Rate Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={charts?.default_trend || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" />
              <YAxis unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="default_rate" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 7: Loan Amount Distribution */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>7. Loan Amount Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.loan_amount_distribution || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 8: Model Risk Drivers */}
        <div className="card col-span-6">
          <div className="card-title">
            <span>8. ML Model Key Risk Drivers (Feature Importance)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={charts?.risk_drivers || []}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="feature" width={140} />
              <Tooltip />
              <Bar dataKey="importance" fill="#6366F1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 10 Highest Risk Loans Table */}
      <div className="card col-span-12">
        <div className="card-title" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle color="#EF4444" size={20} />
            <span>Highest Risk Loans (Top 10 Risk Exposure)</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            Sorted by highest model-predicted default probability
          </span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Credit Score</th>
                <th>Annual Income</th>
                <th>Loan Amount</th>
                <th>DTI</th>
                <th>Default Probability</th>
                <th>Risk Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topLoans.map((loan) => (
                <tr key={loan.loan_id}>
                  <td><strong>{loan.loan_id}</strong></td>
                  <td>{loan.credit_score}</td>
                  <td>${loan.income?.toLocaleString()}</td>
                  <td>${loan.loan_amount?.toLocaleString()}</td>
                  <td>{loan.dti}%</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-bg" style={{ width: '80px', margin: 0 }}>
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${loan.default_probability_pct}%`,
                            backgroundColor: loan.default_probability >= 0.5 ? '#EF4444' : '#F97316'
                          }}
                        />
                      </div>
                      <strong>{loan.default_probability_pct}%</strong>
                    </div>
                  </td>
                  <td>
                    <span className={getRiskBadgeClass(loan.risk_level)}>
                      {loan.risk_level}
                    </span>
                  </td>
                  <td>{loan.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
