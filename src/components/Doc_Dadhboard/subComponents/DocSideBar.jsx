import React from 'react';
import './DocSideBar.css';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Stethoscope,
  LogOut,
  Plus
} from 'lucide-react';

const DocSideBar = (props) => {

  const { doctor, pic_url } = props;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  
  return (
    <aside className="doc-sidebar">
      <div className="doc-sidebar-header">
        <div className="doc-logo-icon">
          <Plus size={20} color="#ffffff" strokeWidth={3} />
        </div>
        <div className="doc-logo-text">
          <span className="logo-main">Medi</span>
          <span className="logo-accent">Link</span>
        </div>
      </div>

      <nav className="doc-sidebar-menu">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "doc-nav-item active" : "doc-nav-item"}
        >
          <LayoutDashboard size={20} className="doc-nav-icon" />
          <span className="doc-nav-label">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/register-migrant" 
          className={({ isActive }) => isActive ? "doc-nav-item active" : "doc-nav-item"}
        >
          <UserPlus size={20} className="doc-nav-icon" />
          <span className="doc-nav-label">Register Migrant</span>
        </NavLink>

        <NavLink 
          to="/add-health" 
          className={({ isActive }) => isActive ? "doc-nav-item active" : "doc-nav-item"}
        >
          <Stethoscope size={20} className="doc-nav-icon" />
          <span className="doc-nav-label">Add Diagnosis</span>
        </NavLink>
      </nav>

      <div className="doc-sidebar-footer" style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
        <div className="doc-profile-info">
          <img
            src={pic_url ? pic_url : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
            alt="Doctor Avatar"
            className="doc-profile-avatar"
          />
          <span className="doc-profile-name">
            Dr. {[doctor?.first_name, doctor?.middle_name, doctor?.last_name].filter(Boolean).join(' ') || 'Doctor'}
          </span>
        </div>

        <button 
          onClick={handleLogout} 
          className="doc-nav-item" 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#ef4444',
            padding: '8px 12px' 
          }}
        >
          <LogOut size={18} className="doc-nav-icon" color="#ef4444" />
          <span className="doc-nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DocSideBar;
