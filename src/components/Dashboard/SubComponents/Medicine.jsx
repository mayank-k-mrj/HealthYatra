import React, { useState, useEffect } from 'react';
import './Medicine.css';
import { Search, Filter, Calendar, Pill } from 'lucide-react';

const Medicine = (props) => {

  const { details, pic_url, data } = props;
  const [image, setImage] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem('token');

  async function handlrDoc_pic(aadhar) {
    if (!aadhar) return;
    try {
      const response = await fetch(`https://health-yatra.onrender.com/migrant/mig-pic/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const d_pic = await response.json();
        const doc_pic = d_pic.pic;
        const startIndex = doc_pic.indexOf('[') + 1;
        const endIndex = doc_pic.indexOf(']');
        if (startIndex > 0 && endIndex > startIndex) {
          const doc_url = doc_pic.slice(startIndex, endIndex);
          setImage(prev => ({
            ...prev, [aadhar]: doc_url
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    data?.forEach((item) => {
      const docAadhar = item?.docAadhar?.[0]?.aadhar;
      if (docAadhar && !image[docAadhar]) {
        handlrDoc_pic(docAadhar);
      }
    });
  }, [data]);

  const filteredData = data?.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const doc = item?.docAadhar?.[0];
    const docName = doc ? `Dr. ${doc.first_name || ''} ${doc.middle_name ? doc.middle_name + ' ' : ''}${doc.last_name || ''}`.toLowerCase() : '';
    const diagnosis = (item?.diagnosis || '').toLowerCase();
    const disease = (item?.disease || '').toLowerCase();
    const medicine = (item?.medicine_pres || '').toLowerCase();
    return (
      diagnosis.includes(term) ||
      disease.includes(term) ||
      medicine.includes(term) ||
      docName.includes(term)
    );
  });

  return (
    <div className="medication-records-container">
      <header className="medication-header">
        <div className="header-titles">
          <p className="greeting-text">Good Morning, {details?.first_name} 👋</p>
          <h1 className="header-heading">Welcome to Your Health Dashboard</h1>
          <p className="header-subtext">
            Here's your health summary and recent medical history
          </p>
        </div>

        <div className="user-profile-badge">
          <img
            src={(pic_url != null) ? pic_url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
            alt="User Profile"
            className="user-badge-avatar"
          />
          <span className="user-badge-name">{details?.first_name} {details?.middle_name} {details?.last_name}</span>
        </div>
      </header>

      <section className="medication-toolbar-section">
        <h2 className="section-title">Detailed Medication Records</h2>

        <div className="toolbar-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by disease, medicine, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="search-icon" />
          </div>
        </div>
      </section>

      <div className="medication-cards-grid">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const doc = item?.docAadhar?.[0];
            const aadhar = doc?.aadhar;
            const docName = doc ? `Dr. ${doc.first_name || ''} ${doc.middle_name ? doc.middle_name + ' ' : ''}${doc.last_name || ''}`.trim() : 'N/A';

            return (
              <div key={item.id || index} className="med-record-card">
                <div className="card-top-row">
                  <h3 className="card-diagnosis-title" style={{color : "navy"}}>
                    Diagnosis: {item.diagnosis}
                  </h3>
                  <div className="card-meta-row">
                    <span className="prescribed-label">{item.disease}</span>
                    <div className="date-badge">
                      <Calendar size={14} className="calendar-icon" />
                      <span>
                        Date: <strong>{item.date}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="card-divider" />

                <div className="card-body-content">
                  <div className="detail-item doctor-item">
                    <img
                      src={image[aadhar] || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"}
                      alt={doc?.first_name || 'Doctor'}
                      className="doctor-avatar"
                    />
                    <div className="detail-text">
                      <span className="detail-label">Doctor</span>
                      <span className="detail-value font-bold">{docName}</span>
                    </div>
                  </div>

                  <div className="detail-item medicine-item">
                    <div className={`med-pill-box ${item.iconColor || 'blue'}-bg`}>
                      <Pill size={18} className={`pill-icon ${item.iconColor || 'blue'}-icon`} />
                    </div>
                    <div className="detail-text">
                      <span className="detail-label">Medicine</span>
                      <span className="detail-value font-bold">{item.medicine_pres}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: '#64748b' }}>
            {data && data.length > 0 ? 'No matching medication records found.' : 'No medication records available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicine;
