import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertTriangle, Layers, FileSpreadsheet } from 'lucide-react';
import { fetchDataQuality } from '../services/api';
import KpiCard from '../components/KpiCard';

export default function DataQuality() {
  const [dataQuality, setDataQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataQuality()
      .then(res => setDataQuality(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="workspace-padding">
      <div className="kpi-grid">
        <KpiCard 
          label="Total Records" 
          value={loading ? '...' : dataQuality?.total_records?.toLocaleString()} 
          subtext="Lending Club raw loans" 
          icon={FileSpreadsheet} 
          color="#2563EB"
        />
        <KpiCard 
          label="Total Features" 
          value={loading ? '...' : dataQuality?.total_features?.toLocaleString()} 
          subtext="Extracted attributes" 
          icon={Database} 
          color="#8B5CF6"
        />
        <KpiCard 
          label="Data Completeness" 
          value={loading ? '...' : `${dataQuality?.data_completeness_pct}%`} 
          subtext="Overall non-null ratio" 
          icon={CheckCircle} 
          color="#10B981"
        />
        <KpiCard 
          label="Missing Fields" 
          value={loading ? '...' : dataQuality?.missing_fields_count} 
          subtext="Attributes with nulls" 
          icon={AlertTriangle} 
          color="#F97316"
        />
      </div>

      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers color="var(--color-primary)" size={22} />
            <span>Dataset Schema & Missing Rate Analysis</span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Non-Null Count</th>
                <th>Missing Percentage</th>
                <th>Quality Status</th>
              </tr>
            </thead>
            <tbody>
              {(dataQuality?.column_samples || []).map((col) => (
                <tr key={col.column_name}>
                  <td><strong>{col.column_name}</strong></td>
                  <td><code>{col.data_type}</code></td>
                  <td>{col.non_null_count?.toLocaleString()}</td>
                  <td>{col.missing_pct}%</td>
                  <td>
                    <span className={`risk-badge ${col.missing_pct === 0 ? 'low' : col.missing_pct < 10 ? 'medium' : 'high'}`}>
                      {col.missing_pct === 0 ? 'COMPLETE' : 'INCOMPLETE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
