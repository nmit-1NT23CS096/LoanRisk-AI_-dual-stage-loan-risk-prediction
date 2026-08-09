import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  ShieldAlert, 
  BrainCircuit, 
  Database, 
  Info, 
  Landmark 
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pre-loan', label: 'Pre-Loan Assessment', icon: FileCheck },
    { path: '/post-loan', label: 'Post-Loan Risk', icon: ShieldAlert },
    { path: '/model-insights', label: 'Model Insights', icon: BrainCircuit },
    { path: '/data-quality', label: 'Data Quality', icon: Database },
    { path: '/about', label: 'About System', icon: Info },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Landmark size={22} />
        </div>
        <div>
          <div className="sidebar-title">LoanRisk AI</div>
          <div className="sidebar-subtitle">Dual-Stage Engine</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>
        <span>FastAPI & ML Engine Connected</span>
      </div>
    </aside>
  );
}
