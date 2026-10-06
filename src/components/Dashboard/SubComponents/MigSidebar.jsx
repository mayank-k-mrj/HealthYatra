import React from "react";
import './MigSidebar.css';
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Pill,
  BarChart3,
  LogOut,
  Plus
} from "lucide-react";

const MigSidebar = (props) => {

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar-container">
      <div className="brand-header">
        <div className="brand-logo-icon">
          <Plus size={20} color="#ffffff" strokeWidth={3} />
        </div>
        <h2 className="brand-title">MediCare+</h2>
      </div>

      <div className="sidebar-profile-card">
        <img
          src={props.pic_url ? props.pic_url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
          alt="User Profile"
          className="sidebar-avatar"
        />
        <div className="sidebar-profile-details">
          <h4 className="profile-name">{[props.user?.first_name, props.user?.middle_name, props.user?.last_name].filter(Boolean).join(' ') || 'Migrant Patient'}</h4>
          <span className="verified-badge">Verified</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={19} className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/diagnoses" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Stethoscope size={19} className="nav-icon" />
          <span className="nav-text">My Diagnoses</span>
        </NavLink>
        <NavLink to="/medicines" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Pill size={19} className="nav-icon" />
          <span className="nav-text">Medicines & Doctors</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <BarChart3 size={19} className="nav-icon" />
          <span className="nav-text">Record</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={handleLogout} 
          className="logout-link"
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={19} className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default MigSidebar;