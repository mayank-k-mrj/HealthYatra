import React from 'react';
import './Record.css';

const Record = (props) => {

    const { data, register, details } = props;
    const savedMid = localStorage.getItem('mid');

    if (!data || data.length === 0 || savedMid === null || savedMid === undefined) {
        return (
            <div className="record-container">
                <div className="record-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '10px' }}>No Record Selected</h2>
                    <p style={{ color: '#64748b' }}>Please click "View" on a diagnosis from your Dashboard or Diagnoses page to view details.</p>
                </div>
            </div>
        );
    }

    const midIndex = parseInt(savedMid, 10);
    const currentRecord = data[midIndex] || data[0];
    const doc = currentRecord?.docAadhar?.[0];

    if (!currentRecord) {
        return (
            <div className="record-container">
                <div className="record-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Record Not Found</h2>
                    <p>The requested record details could not be found.</p>
                </div>
            </div>
        );
    }

    const patientName = [details?.first_name, details?.middle_name, details?.last_name].filter(Boolean).join(' ') || 'Migrant Patient';
    const doctorName = doc ? [doc.first_name, doc.middle_name, doc.last_name].filter(Boolean).join(' ') : 'N/A';

    return (
        <div className="record-container">
            <div className="record-card">
                <header className="record-header">
                    <div className="record-branding">
                        <h1 className="brand-title">
                            <span className="brand-highlight">Health</span>Yatra
                        </h1>
                        <p className="brand-subtitle">Digital Health Record</p>
                    </div>
                    <div className="record-meta">
                        <span className="record-badge">Verified Digital Record</span>
                    </div>
                </header>
                <div className="record-divider"></div>
                <main className="record-body-two-parts">
                    <div className="record-column">
                        <section className="record-section">
                            <div className="section-header">
                                <span className="section-icon">📅</span>
                                <h2 className="section-title">Record Details</h2>
                            </div>
                            <div className="vertical-data-list">
                                <div className="data-item">
                                    <span className="data-label">Consultation Date</span>
                                    <span className="data-value">{currentRecord?.date || 'N/A'}</span>
                                </div>
                            </div>
                        </section>

                        <section className="record-section">
                            <div className="section-header">
                                <span className="section-icon">👤</span>
                                <h2 className="section-title">Patient Details</h2>
                            </div>
                            <div className="vertical-data-list">
                                <div className="data-item">
                                    <span className="data-label">Patient Name</span>
                                    <span className="data-value">{patientName}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Contact Number</span>
                                    <span className="data-value">{register?.phone ? `+91 ${register.phone}` : 'N/A'}</span>
                                </div>
                            </div>
                        </section>

                        <section className="record-section">
                            <div className="section-header">
                                <span className="section-icon">🩺</span>
                                <h2 className="section-title">Doctor & Hospital Details</h2>
                            </div>
                            <div className="vertical-data-list">
                                <div className="data-item">
                                    <span className="data-label">Doctor Name</span>
                                    <span className="data-value">Dr. {doctorName}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Specialization</span>
                                    <span className="data-value">{doc?.specilization || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Medical Registration No.</span>
                                    <span className="data-value">{doc?.medical_regi || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Hospital / Clinic</span>
                                    <span className="data-value">{doc?.hospital_name || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Hospital Location</span>
                                    <span className="data-value">{doc?.working_loc || 'N/A'}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="record-column">
                        <section className="record-section">
                            <div className="section-header">
                                <span className="section-icon">📋</span>
                                <h2 className="section-title">Clinical Observations</h2>
                            </div>
                            <div className="vertical-data-list">
                                <div className="data-item">
                                    <span className="data-label">Symptoms</span>
                                    <span className="data-value">{currentRecord?.symptoms || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Diagnosed Disease</span>
                                    <span className="data-value">{currentRecord?.disease || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Detailed Diagnosis</span>
                                    <span className="data-value">{currentRecord?.diagnosis || 'N/A'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Known Allergies</span>
                                    <span className="data-value tag-allergy">{currentRecord?.allergis || 'None'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Chronic Conditions</span>
                                    <span className="data-value tag-chronic">{currentRecord?.chronic_cond || 'None'}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Blood Group</span>
                                    <span className="data-value blood-g">{details?.blood_g || 'N/A'}</span>
                                </div>
                            </div>
                        </section>

                        <section className="record-section">
                            <div className="section-header">
                                <span className="section-icon">💊</span>
                                <h2 className="section-title">Prescribed Medicines</h2>
                            </div>
                            <div className="vertical-data-list">
                                <div className="data-item medicine-card">
                                    <span className="data-label">Medicines</span>
                                    <span className="data-value font-semibold">{currentRecord?.medicine_pres || 'N/A'}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Record;
