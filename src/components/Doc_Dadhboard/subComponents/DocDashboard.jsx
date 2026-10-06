import React, { useEffect, useRef, useState } from 'react'
import './DocDashboard.css'
import { Bell, ChevronDown, UserPlus, Eye, Stethoscope, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import Record from '../../Dashboard/SubComponents/Record';
import { extractPicUrl } from '../../../services/api';

const DocDashboard = (props) => {

  const { doctor, pic_url, record } = props;

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const [Srecord, setSrecord] = useState([]);
  const [name, setName] = useState("");
  const [searchedAadhar, setSearchedAadhar] = useState("");
  const [migrantDetails, setMigrantDetails] = useState(null);
  const [registerData, setRegisterData] = useState(null);
  const [prof_pic, setProf_pic] = useState("");
  const [pro_url, setPro_url] = useState("");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inpRef = useRef();

  const date = new Date().toLocaleDateString('en-In', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const time = new Date().toLocaleTimeString('en-In', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  useEffect(() => {
    if(prof_pic !== ""){
      setPro_url(extractPicUrl(prof_pic));
    }
  }, [prof_pic]);

  async function getProfPicUrl(aadhar) {
    if(!aadhar || String(aadhar).length !== 12) return;
    try {
      const response = await fetch(`https://health-yatra.onrender.com/migrant/mig-pic/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const text = await response.text();
        try {
          const pro_pic = JSON.parse(text);
          const rawPic = typeof pro_pic === 'string' ? pro_pic : (pro_pic?.pic || "");
          if (rawPic) {
            setProf_pic(rawPic);
            setPro_url(extractPicUrl(rawPic));
          }
        } catch {
          if (text) {
            setProf_pic(text);
            setPro_url(extractPicUrl(text));
          }
        }
      } else {
        setPro_url("");
      }
    } catch (e) {
      setPro_url("");
    }
  }

  async function handleMigReg(aadhar){
    if(aadhar.length === 12){
      try {
        const response = await fetch(`https://health-yatra.onrender.com/migrant/mig/${aadhar}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if(response.ok){
          const res = await response.json();
          setMigrantDetails(res);
          setName([res.first_name, res.middle_name, res.last_name].filter(Boolean).join(' '));
        }
        else {
          setMigrantDetails(null);
          setName("");
        }

        const regResponse = await fetch(`https://health-yatra.onrender.com/authorize/getReg-data/${aadhar}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if(regResponse.ok){
          const regRes = await regResponse.json();
          setRegisterData(regRes);
        }
      } catch (err) {
        console.error("Error fetching migrant details:", err);
      }
    }
  }

  async function handleSearch(){
    const aadhar = inpRef.current?.value?.trim() || "";
    if(aadhar.length === 12){
      setIsSearching(true);
      setSearchedAadhar(aadhar);
      localStorage.setItem("searchedAadhar", aadhar);
      try {
        await handleMigReg(aadhar);
        await getProfPicUrl(aadhar);
        const response = await fetch(`https://health-yatra.onrender.com/record/fetch-health/${aadhar}`,{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if(response.ok){
          console.log("Searched record fetched!");
          const res = await response.json();
          setSrecord(Array.isArray(res) ? res : []);
        }
        else{
          console.error("Searched record not found!");
          setSrecord([]);
        }
      } catch (e) {
        console.error("Error searching patient:", e);
        setSrecord([]);
      } finally {
        setIsSearching(false);
      }
    }
    else{
      alert("Please enter a valid 12-digit Aadhar number!");
    }
  }

  function handleViewRecord(index, item) {
    localStorage.setItem('mid', index);
    setSelectedRecordIndex(index);
    setShowReportModal(true);
  }

  function handleAddDiagnosisClick() {
    const targetAadhar = searchedAadhar || inpRef.current?.value?.trim() || localStorage.getItem("searchedAadhar") || "";
    if (targetAadhar) {
      localStorage.setItem("searchedAadhar", targetAadhar);
    }
    navigate("/add-health", { state: { aadhar: targetAadhar } });
  }

  const displayRecords = searchedAadhar ? Srecord : [];

  return (
    <main className="doc-main-content">
      <header className="doc-header">
        <div className="header-greeting">
          <h1>Welcome, Dr. {[doctor?.first_name, doctor?.middle_name, doctor?.last_name].filter(Boolean).join(' ')}!</h1>
          <p>{date} | {time}</p>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Search Migrant by Aadhar No..." ref={inpRef}/>
          </div>
          <button 
            className="btn-register" 
            onClick={handleSearch} 
            disabled={isSearching}
            style={{ opacity: isSearching ? 0.7 : 1, cursor: isSearching ? 'wait' : 'pointer' }}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>

          <button className="icon-btn">
            <Bell size={20} />
          </button>

          <div className="user-profile">
            <img
              src={pic_url ? pic_url : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"}
              alt="Doctor Avatar"
              className="user-avatar"
            />
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <section className="action-banner" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button className="btn-register" onClick={() => navigate("/register-migrant")}>
          <UserPlus size={18} />
          <span>Register New Migrant</span>
        </button>

        {searchedAadhar && name && (
          <button 
            className="btn-register" 
            style={{ backgroundColor: '#10b981', color: '#ffffff' }}
            onClick={handleAddDiagnosisClick}
          >
            <Stethoscope size={18} />
            <span>Add Diagnosis for {name}</span>
          </button>
        )}
      </section>

      {showReportModal ? (
        <section className="dashboard-grid">
          <div className="dash-card">
            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <ArrowLeft size={18} /> Back to Search Results
              </button>
              <h3 style={{ margin: 0 }}>Full Digital Health Record View</h3>
            </div>
            <Record 
              data={displayRecords} 
              register={registerData} 
              details={migrantDetails || displayRecords[selectedRecordIndex]?.migAadhar?.[0]} 
            />
          </div>
        </section>
      ) : (
        <section className="dashboard-grid">
          <div className="dash-card">
            <h2>Patient Diagnosis Records {name ? `for: ${name}` : ''}</h2>

            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Migrant Name</th>
                    <th>Diagnosis</th>
                    <th>Doctor</th>
                    <th>View Report</th>
                  </tr>
                </thead>
                <tbody>
                  {isSearching ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '50px 20px', color: '#2563eb' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            border: '3px solid #cbd5e1',
                            borderTop: '3px solid #2563eb',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                          }}></div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                            Fetching Migrant Records for Aadhar: {searchedAadhar}...
                          </div>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Connecting to HealthYatra backend...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : displayRecords && displayRecords.length > 0 ? (
                    displayRecords.map((item, index) => {
                      const patientObj = Array.isArray(item?.migAadhar) ? item?.migAadhar?.[0] : item?.migAadhar;
                      
                      let rowPatientName = '';
                      if (patientObj) {
                        rowPatientName = [patientObj.first_name, patientObj.middle_name, patientObj.last_name].filter(Boolean).join(' ').trim();
                      }
                      if (!rowPatientName && migrantDetails) {
                        rowPatientName = [migrantDetails.first_name, migrantDetails.middle_name, migrantDetails.last_name].filter(Boolean).join(' ').trim();
                      }
                      if (!rowPatientName && name) {
                        rowPatientName = String(name).trim();
                      }
                      if (!rowPatientName) {
                        rowPatientName = 'Migrant Patient';
                      }

                      const rowPatientPic = pro_url || extractPicUrl(patientObj?.pic);
                      const docObj = Array.isArray(item?.docAadhar) ? item?.docAadhar?.[0] : item?.docAadhar;
                      const rowDocName = docObj ? [docObj.first_name, docObj.middle_name, docObj.last_name].filter(Boolean).join(' ').trim() : 'N/A';

                      return (
                        <tr key={item.id || index}>
                          <td>{item.date || 'N/A'}</td>
                          <td className="patient-cell">
                            {rowPatientPic ? (
                              <img 
                                src={rowPatientPic} 
                                alt="Patient Avatar" 
                              />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>
                                {rowPatientName ? rowPatientName.charAt(0) : 'P'}
                              </div>
                            )}
                            <span style={{ fontWeight: '600', color: '#0f172a' }}>{rowPatientName}</span>
                          </td>
                          <td>{item.diagnosis || 'N/A'}</td>
                          <td>Dr. {rowDocName}</td>
                          <td>
                            <Eye 
                              size={20} 
                              className="action-eye" 
                              style={{ cursor: 'pointer', color: '#2563eb' }}
                              onClick={() => handleViewRecord(index, item)}
                              title="View Full Health Record"
                            />
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <Stethoscope size={38} color="#3b82f6" />
                          <div style={{ fontSize: '17px', fontWeight: '600', color: '#1e293b' }}>
                            {searchedAadhar ? `No records found for Aadhar: ${searchedAadhar}` : 'Search Patient to View Records'}
                          </div>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, maxWidth: '420px', lineHeight: '1.5' }}>
                            {searchedAadhar 
                              ? `No medical records were found for this patient. Click "Add Diagnosis for ${name || 'Patient'}" above to create a new health record.`
                              : 'Please enter a 12-digit Aadhar number in the search bar above and click "Search" to view or manage patient records.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default DocDashboard;
