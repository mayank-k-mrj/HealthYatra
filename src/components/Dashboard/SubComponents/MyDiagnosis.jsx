import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../SubComponents/MyDiagnosis.css'

const MyDiagnosis = (props) => {

    const navigate = useNavigate();
    const { pic_url, details, data, total_dia} = props;
    const [searchTerm, setSearchTerm] = useState("");

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
        <div className="dashboard-main-area">
            <div className="top-navigation">
                <div className="nav-text-group">
                    <span className="welcome-text">Good Morning, {details?.first_name}!</span>
                    <h1>My Diagnoses History</h1>
                </div>
                <div className="nav-controls">
                    <div className="user-menu">
                        <img src={(pic_url != null) ? pic_url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"} alt="Profile" className="user-avatar" />
                        <span className="user-name">{details?.first_name} {details?.middle_name} {details?.last_name}</span>
                    </div>
                </div>
            </div>
            <div className="data-panel">
                <div className="panel-top">
                    <div className="panel-info">
                        <h2>Diagnosis Records</h2>
                        <p>Your complete diagnosis history</p>
                    </div>
                    <div className="panel-tools">
                        <div className="secondary-search">
                            <span className="icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search records by disease, doctor, or hospital..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="scrollable-table-box">
                    <table className="medical-history-table">
                        <thead>
                            <tr>
                                <th>#</th>
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
                                filteredData.map((item, index) => {
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
                                                <button className="btn-view-record" onClick={() => handleViewRecord(index)}>View</button>
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

                <div className="panel-bottom">
                    <span>Showing {filteredData?.length || 0} of {total_dia || 0} results</span>
                </div>

            </div>
        </div>
    )
}

export default MyDiagnosis;