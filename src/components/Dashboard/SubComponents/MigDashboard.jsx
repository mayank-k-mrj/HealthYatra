import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SubComponents/MigDashboard.css';
import {  Stethoscope,  Calendar,  UserCheck,  Filter,  Eye,  ChevronRight,  Pill,  Heart} from 'lucide-react';

const MigDashboard = (props) => {

  const navigate = useNavigate();
  const { data, details, pic_url, total_dia, doctor, hospital} = props;
  const [searchTerm, setSearchTerm] = useState("");

  const colors = ['orange', 'blue', 'green', 'purple', 'red'];

  const handleViewRecord = (index) => {
    localStorage.setItem('mid', index);
    navigate('/reports');
  };

  const filteredData = data?.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const doc = item?.docAadhar?.[0];
    const docName = doc ? `Dr. ${doc.first_name || ''} ${doc.middle_name ? doc.middle_name + ' ' : ''}${doc.last_name || ''}`.toLowerCase() : '';
    const hospitalName = (doc?.hospital_name || '').toLowerCase();
    const diagnosis = (item?.diagnosis || '').toLowerCase();
    const disease = (item?.disease || '').toLowerCase();
    return (
      diagnosis.includes(term) ||
      disease.includes(term) ||
      docName.includes(term) ||
      hospitalName.includes(term)
    );
  });

  return (
    <div className="migrant-dashboard">
      <header className="main-header">
        <div className="header-greeting">
          <div className="greet-badge">Good Morning, {details?.first_name || 'Patient'}! 👋</div>
          <h1 className="welcome-title">Welcome to Your Health Dashboard</h1>
          <p className="welcome-subtitle">Here's your health summary and recent medical history</p>
        </div>
        <div className="header-user-controls">
          <div className="header-divider"></div>
          <div className="header-profile-menu">
            <img
              src={pic_url ? pic_url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
              alt={details?.first_name || 'User'}
              className="header-avatar"
            />
            <span className="header-profile-name">{[details?.first_name, details?.middle_name, details?.last_name].filter(Boolean).join(' ') || 'User'}</span>
          </div>
        </div>
      </header>

      <section className="statistics-grid">
        <div className="stat-card blue-card">
          <div className="stat-icon-wrapper blue-icon">
            <Stethoscope size={24} color="#ffffff" />
          </div>
          <div className="stat-details">
            <div className="stat-value">{total_dia || 0}</div>
            <div className="stat-label">Total Diagnoses</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-graph">
            <svg viewBox="0 0 100 40" className="sparkline">
              <path
                d="M 5,32 L 20,28 L 35,30 L 50,18 L 65,22 L 80,10 L 95,8"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="stat-card purple-card">
          <div className="stat-icon-wrapper purple-icon">
            <Calendar size={24} color="#ffffff" />
          </div>
          <div className="stat-details">
            <div className="stat-value">{total_dia || 0}</div>
            <div className="stat-label">Total Visits</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-graph">
            <svg viewBox="0 0 100 40" className="sparkline">
              <path
                d="M 5,30 L 22,25 L 40,28 L 58,16 L 75,20 L 95,6"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="stat-card orange-card">
          <div className="stat-icon-wrapper orange-icon">
            <UserCheck size={24} color="#ffffff" />
          </div>
          <div className="stat-details">
            <div className="stat-value">{doctor || 0}</div>
            <div className="stat-label">Doctors Consulted</div>
            <div className="stat-sub">Across {hospital || 0} hospital(s)</div>
          </div>
          <div className="stat-graph">
            <svg viewBox="0 0 100 40" className="sparkline">
              <path
                d="M 5,32 L 25,24 L 45,26 L 65,14 L 80,18 L 95,7"
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="diagnoses-card">
        <div className="diagnoses-card-header">
          <div>
            <h2 className="diagnoses-title">Recent Diagnoses</h2>
            <p className="diagnoses-subtitle">Your medical history summary</p>
          </div>

          <div className="diagnoses-toolbar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search diagnosis, doctor, or hospital..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="diagnoses-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Diagnosis</th>
                <th>Description</th>
                <th>Doctor</th>
                <th>Hospital/Clinic</th>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.slice(0, 7).map((item, index) => {
                  const doc = item?.docAadhar?.[0];
                  const docName = doc ? `Dr. ${doc.first_name || ''} ${doc.middle_name ? doc.middle_name + ' ' : ''}${doc.last_name || ''}`.trim() : 'N/A';
                  const hospitalName = doc?.hospital_name || 'N/A';
                  return (
                    <tr key={item.id || index}>
                      <td className="row-num">{index + 1}</td>
                      <td className="row-diagnosis"><strong>{item?.diagnosis}</strong></td>
                      <td className="row-desc">{item?.disease}</td>
                      <td className="row-doctor">{docName}</td>
                      <td className="row-hospital">{hospitalName}</td>
                      <td className="row-date">{item?.date}</td>
                      <td className="row-action" style={{ textAlign: 'center' }}>
                        <button className="view-btn" onClick={() => handleViewRecord(index)}>
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                    {data && data.length > 0 ? 'No matching diagnosis records found.' : 'No diagnosis records available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          Showing {filteredData ? (filteredData.length >= 7 ? 7 : filteredData.length) : 0} of {total_dia || 0} results
        </div>
      </section>

      <section className="bottom-sections-grid">
        <div className="bottom-card recent-medicines-card">
          <div className="bottom-card-header">
            <div>
              <h3 className="bottom-card-title">Recent Medicines</h3>
              <p className="bottom-card-subtitle">Currently prescribed medicines</p>
            </div>
            <button className="link-btn" onClick={() => navigate('/medicines')}>View All</button>
          </div>

          <div className="medicines-grid">
            {data && data.length > 0 ? (
              data.slice(0, 4).map((item, index) => {
                const currentColor = colors[index % colors.length];
                return (
                  <div className="med-item" key={item.id || index}>
                    <div className={`med-icon-box ${currentColor}-pill-bg`}>
                      <span className={`capsule-icon ${currentColor}-gradient`}></span>
                    </div>
                    <div className="med-info">
                      <h4 className="med-title">{item.medicine_pres}</h4>
                      <span className="med-days">Start at : {item.date}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No recent medicines.</p>
            )}
          </div>
        </div>

        <div className="bottom-card quick-access-card">
          <div className="bottom-card-header">
            <h3 className="bottom-card-title">Quick Access</h3>
            <button className="link-btn" onClick={() => navigate('/medicines')}>View All</button>
          </div>

          <div className="quick-access-grid">
            <div className="access-item-card" onClick={() => navigate('/medicines')} style={{ cursor: 'pointer' }}>
              <div className="access-icon-bg green-bg">
                <Pill size={20} color="#16a34a" />
              </div>
              <div className="access-details">
                <h4 className="access-title">View Medicines</h4>
                <p className="access-sub">Check all your medicines</p>
              </div>
              <ChevronRight size={18} color="#94a3b8" className="access-arrow" />
            </div>

            <div className="access-item-card" onClick={() => navigate('/diagnoses')} style={{ cursor: 'pointer' }}>
              <div className="access-icon-bg red-bg">
                <Stethoscope size={20} color="#e11d48" />
              </div>
              <div className="access-details">
                <h4 className="access-title">My Diagnoses</h4>
                <p className="access-sub">Complete health history</p>
              </div>
              <ChevronRight size={18} color="#94a3b8" className="access-arrow" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MigDashboard;
