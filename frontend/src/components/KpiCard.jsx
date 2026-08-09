import React from 'react';

export default function KpiCard({ label, value, subtext, icon: Icon, color = '#2563EB' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {Icon && (
          <div className="kpi-icon" style={{ backgroundColor: `${color}15`, color: color }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
}
