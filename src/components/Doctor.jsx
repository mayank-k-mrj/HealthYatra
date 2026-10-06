import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../components/Doctor.css"
import { DocContext } from '../App';

const Doctor = (props) => {

    const fRef = useRef();
    const mRef = useRef();
    const lRef = useRef();
    const mediRef = useRef();
    const qualRef = useRef();
    const specRef = useRef();
    const expRef = useRef();
    const licRef = useRef();
    const validRef = useRef();
    const hospRef = useRef();
    const workRef = useRef();
    const aadharRef = useRef();

    const token = localStorage.getItem('token');
    const docContextAadhar = useContext(DocContext);
    const effectiveAadhar = props.aadhar || docContextAadhar;

    const [meth, setMeth] = useState("POST");
    const [ep, setEp] = useState("reg-doc");
    const [statusMsg, setStatusMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!effectiveAadhar) return;
        async function loadData() {
            const res = await fetchDetails();
            if (res) {
                setDetails(res);
            }
        }
        loadData();
    }, [effectiveAadhar]);
    
    async function fetchDetails(){
        try {
            const response = await fetch(`https://health-yatra.onrender.com/doctor/doc/${effectiveAadhar}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if(response.ok){
                const res = await response.json();
                console.log("Doctor's data fetched!");
                setMeth("PUT");
                setEp("upd-doc");
                return res;
            }
            else{
                console.log("Doctor's data not fetched!");
            }
        } catch (e) {
            console.error(e);
        }
    }

    function setDetails(e){
        if (fRef.current) fRef.current.value = e.first_name || '';
        if (mRef.current) mRef.current.value = e.middle_name || '';
        if (lRef.current) lRef.current.value = e.last_name || '';
        if (mediRef.current) mediRef.current.value = e.medical_regi || '';
        if (qualRef.current) qualRef.current.value = e.qualification || '';
        if (specRef.current) specRef.current.value = e.specilization ? e.specilization.toUpperCase() : '';
        if (expRef.current) expRef.current.value = e.exp || '';
        if (licRef.current) licRef.current.value = e.license_no || '';
        if (validRef.current) validRef.current.value = e.license_validity || '';
        if (hospRef.current) hospRef.current.value = e.hospital_name || '';
        if (workRef.current) workRef.current.value = e.working_loc || '';
        if (aadharRef.current) aadharRef.current.value = e.aadhar || effectiveAadhar || '';
    }

    function handleAadhar() {
        const aadhar = aadharRef.current?.value || "";
        if (aadhar.length === 12) {
            return true;
        }
        else {
            setStatusMsg("Aadhar number must be exactly 12 digits!");
            return false;
        }
    }

    async function handleRegister(e){
        e.preventDefault();
        setStatusMsg("");
        try {
            const details = {
                first_name: fRef.current.value,
                middle_name: mRef.current.value,
                last_name: lRef.current.value,
                medical_regi: mediRef.current.value,
                qualification: qualRef.current.value,
                specilization: specRef.current.value,
                exp: parseInt(expRef.current.value, 10) || 0,
                license_no: licRef.current.value,
                license_validity: validRef.current.value,
                hospital_name: hospRef.current.value,
                working_loc: workRef.current.value,
                aadhar: aadharRef.current.value
            };

            const valid = handleAadhar();

            if (valid) {
                const response = await fetch(`https://health-yatra.onrender.com/doctor/${ep}`, {
                    method: meth,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(details)
                });
                if (response.ok) {
                    const actionText = meth === "PUT" ? "updated" : "registered";
                    alert(`Doctor profile ${actionText} successfully!`);
                    setStatusMsg(`Doctor ${actionText} successfully!`);
                    navigate("/dashboard");
                }
                else {
                    setStatusMsg("Failed to save Doctor profile. Check fields!");
                }
            }
        }
        catch (e) {
            console.error(e);
            setStatusMsg("Error occurred while saving Doctor profile!");
        }
    }

    return (
        <div className='Doctor_container'>
            <form onSubmit={handleRegister} className="doctor_form">
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1d4ed8' }}>
                    {meth === "PUT" ? "Update Doctor Profile" : "Register Doctor Profile"}
                </h2>

                {statusMsg && (
                    <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', backgroundColor: statusMsg.includes('successfully') ? '#dcfce7' : '#fee2e2', color: statusMsg.includes('successfully') ? '#16a34a' : '#ef4444', fontSize: '13px', textAlign: 'center' }}>
                        {statusMsg}
                    </div>
                )}

                <label htmlFor="f_name" className="first_name">First Name</label>
                <input type="text" id="f_name" className="f_name" ref={fRef} required />

                <label htmlFor="m_name" className="middle_name">Middle Name</label>
                <input type="text" id="m_name" className="m_name" ref={mRef} />

                <label htmlFor="l_name" className="last_name">Last Name</label>
                <input type="text" id="l_name" className="l_name" ref={lRef} required />

                <label htmlFor="m_reg" className="medical_reg">Medical Registration No.</label>
                <input type="text" id="m_reg" className="m_reg" ref={mediRef} required/>

                <label htmlFor="qual" className="qualification">Qualification</label>
                <input type="text" id="qual" className="qual" ref={qualRef} required />

                <label htmlFor="spec" className="specilization">Specialization</label>
                <select id="spec" className="spec" ref={specRef} required>
                    <option value="">-- Select Specialization --</option>
                    <option value="GENERAL_PHYSICIAN">General Physician</option>
                    <option value="INTERNAL_MEDICINE">Internal Medicine</option>
                    <option value="PEDIATRICS">Pediatrics</option>
                    <option value="GENERAL_SURGERY">General Surgery</option>
                    <option value="ORTHOPEDICS">Orthopedics</option>
                    <option value="CARDIOLOGY">Cardiology</option>
                    <option value="CARDIOTHORACIC_SURGERY">Cardiothoracic Surgery</option>
                    <option value="NEUROLOGY">Neurology</option>
                    <option value="NEUROSURGERY">Neurosurgery</option>
                    <option value="DERMATOLOGY">Dermatology</option>
                    <option value="PSYCHIATRY">Psychiatry</option>
                    <option value="PSYCHOLOGY">Psychology</option>
                    <option value="OBSTETRICS_AND_GYNECOLOGY">Obstetrics & Gynecology</option>
                    <option value="ENT">ENT (Otorhinolaryngology)</option>
                    <option value="OPHTHALMOLOGY">Ophthalmology</option>
                    <option value="UROLOGY">Urology</option>
                    <option value="NEPHROLOGY">Nephrology</option>
                    <option value="GASTROENTEROLOGY">Gastroenterology</option>
                    <option value="ENDOCRINOLOGY">Endocrinology</option>
                    <option value="PULMONOLOGY">Pulmonology</option>
                    <option value="RHEUMATOLOGY">Rheumatology</option>
                    <option value="ONCOLOGY">Oncology</option>
                    <option value="HEMATOLOGY">Hematology</option>
                    <option value="IMMUNOLOGY">Immunology</option>
                    <option value="INFECTIOUS_DISEASE">Infectious Disease</option>
                    <option value="ANESTHESIOLOGY">Anesthesiology</option>
                    <option value="RADIOLOGY">Radiology</option>
                    <option value="NUCLEAR_MEDICINE">Nuclear Medicine</option>
                    <option value="PATHOLOGY">Pathology</option>
                    <option value="MICROBIOLOGY">Microbiology</option>
                    <option value="FORENSIC_MEDICINE">Forensic Medicine</option>
                    <option value="COMMUNITY_MEDICINE">Community Medicine</option>
                    <option value="EMERGENCY_MEDICINE">Emergency Medicine</option>
                    <option value="CRITICAL_CARE">Critical Care Medicine</option>
                    <option value="SPORTS_MEDICINE">Sports Medicine</option>
                    <option value="PAIN_MEDICINE">Pain Medicine</option>
                    <option value="PHYSICAL_MEDICINE_AND_REHABILITATION">Physical Medicine & Rehabilitation</option>
                    <option value="GERIATRIC_MEDICINE">Geriatric Medicine</option>
                    <option value="FAMILY_MEDICINE">Family Medicine</option>
                    <option value="PLASTIC_SURGERY">Plastic Surgery</option>
                    <option value="COSMETIC_SURGERY">Cosmetic Surgery</option>
                    <option value="VASCULAR_SURGERY">Vascular Surgery</option>
                    <option value="PEDIATRIC_SURGERY">Pediatric Surgery</option>
                    <option value="SURGICAL_ONCOLOGY">Surgical Oncology</option>
                    <option value="DENTISTRY">Dentistry</option>
                    <option value="ORTHODONTICS">Orthodontics</option>
                    <option value="PROSTHODONTICS">Prosthodontics</option>
                    <option value="PERIODONTICS">Periodontics</option>
                    <option value="ENDODONTICS">Endodontics</option>
                    <option value="ORAL_AND_MAXILLOFACIAL_SURGERY">Oral & Maxillofacial Surgery</option>
                    <option value="PUBLIC_HEALTH">Public Health</option>
                    <option value="AYURVEDA">Ayurveda</option>
                    <option value="HOMEOPATHY">Homeopathy</option>
                    <option value="UNANI">Unani</option>
                    <option value="SIDDHA">Siddha</option>
                    <option value="NATUROPATHY_AND_YOGA">Naturopathy & Yoga</option>
                    <option value="OTHER">Other</option>
                </select>

                <label htmlFor="doc_exp" className="exp">Experience (in years)</label>
                <input type="number" id="doc_exp" className="doc_exp" ref={expRef} required/>

                <label htmlFor="lic_no" className="license_no">License No.</label>
                <input type="text" id="lic_no" className="lic_no" ref={licRef} required />

                <label htmlFor="lic_valid" className="license_validity">License Validity</label>
                <input type="date" id="lic_valid" className="lic_valid" ref={validRef} required />

                <label htmlFor="hosp_name" className="hospital_name">Hospital Name</label>
                <input type="text" id="hosp_name" className="hosp_name" ref={hospRef} required />

                <label htmlFor="work_loc" className="working_loc">Working Location</label>
                <input type="text" id="work_loc" className="work_loc" ref={workRef} required />

                <label htmlFor="aadhar_no" className="aadhar">Aadhar Number (12 Digits)</label>
                <input type="text" id="aadhar_no" className="aadhar_no" ref={aadharRef} required maxLength={12} />

                <button type='submit'>{meth === "PUT" ? "Update Doctor Profile" : "Register Doctor Profile"}</button>
            </form>
        </div>
    )
}

export default Doctor;
