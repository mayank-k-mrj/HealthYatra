import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../components/Migrant.css"
import { MigContext } from '../App';

const Migrant = (props) => {

    const fRef = useRef();
    const mRef = useRef();
    const lRef = useRef();
    const ageRef = useRef();
    const genderRef = useRef();
    const bloodRef = useRef();
    const currRef = useRef();
    const nativeRef = useRef();
    const emergencyRef = useRef();
    const occupationRef = useRef();
    const aadharRef = useRef();

    const token = localStorage.getItem('token');
    const migContextAadhar = useContext(MigContext);
    const effectiveAadhar = props.aadhar || migContextAadhar;

    const [meth, setMeth] = useState("POST");
    const [ep, setEp] = useState("reg-mig");
    const [statusMsg, setStatusMsg] = useState("");
    const navigate = useNavigate();

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

    async function fetchDetails() {
        try {
            const response = await fetch(`https://health-yatra.onrender.com/migrant/mig/${effectiveAadhar}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const res = await response.json();
                setMeth("PUT");
                setEp("upd-mig");
                return res;
            }
            else {
                console.log("Migrant details not fetched");
                return null;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    function setDetails(e) {
        if (fRef.current) fRef.current.value = e.first_name || '';
        if (mRef.current) mRef.current.value = e.middle_name || '';
        if (lRef.current) lRef.current.value = e.last_name || '';
        if (ageRef.current) ageRef.current.value = e.age || '';
        if (genderRef.current) genderRef.current.value = e.gender || 'MALE';
        if (bloodRef.current) bloodRef.current.value = e.blood_g || '';
        if (currRef.current) currRef.current.value = e.add_curr || '';
        if (nativeRef.current) nativeRef.current.value = e.add_native || '';
        if (emergencyRef.current) emergencyRef.current.value = e.emergency_c || '';
        if (occupationRef.current) occupationRef.current.value = e.occupation || '';
        if (aadharRef.current) aadharRef.current.value = e.aadhar || effectiveAadhar || '';
    }

    async function handleRegister(e) {
        e.preventDefault();
        setStatusMsg("");
        const valid = handleAadhar();
        if (valid) {
            try {
                const details = {
                    first_name: fRef.current.value,
                    middle_name: mRef.current.value,
                    last_name: lRef.current.value,
                    age: parseInt(ageRef.current.value, 10) || 0,
                    gender: genderRef.current.value,
                    blood_g: bloodRef.current.value,
                    add_curr: currRef.current.value,
                    add_native: nativeRef.current.value,
                    emergency_c: emergencyRef.current.value,
                    occupation: occupationRef.current.value,
                    aadhar: aadharRef.current.value
                };
                const response = await fetch(`https://health-yatra.onrender.com/migrant/${ep}`, {
                    method: meth,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(details)
                });
                if (response.ok) {
                    const actionText = meth === "PUT" ? "updated" : "registered";
                    alert(`Migrant profile ${actionText} successfully!`);
                    setStatusMsg(`Migrant profile ${actionText} successfully!`);
                    navigate("/dashboard");
                }
                else {
                    setStatusMsg("Failed to save Migrant profile. Check input data.");
                }
            } catch (err) {
                console.error(err);
                setStatusMsg("Error occurred while saving Migrant profile.");
            }
        }
    }

    return (
        <div className="migrant-container">
            <form onSubmit={handleRegister} className="migrant_form">
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1d4ed8' }}>
                    {meth === "PUT" ? "Update Migrant Patient Profile" : "Register New Migrant Patient"}
                </h2>

                {statusMsg && (
                    <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', backgroundColor: statusMsg.includes('successfully') ? '#dcfce7' : '#fee2e2', color: statusMsg.includes('successfully') ? '#16a34a' : '#ef4444', fontSize: '13px', textAlign: 'center' }}>
                        {statusMsg}
                    </div>
                )}

                <label htmlFor="f_name" className="first_name">First Name</label>
                <input type="text" id="f_name" className="f_name" required ref={fRef} />

                <label htmlFor="m_name" className="middle_name">Middle Name</label>
                <input type="text" id="m_name" className="m_name" ref={mRef} />

                <label htmlFor="l_name" className="last_name">Last Name</label>
                <input type="text" id="l_name" className="l_name" required ref={lRef} />

                <label htmlFor="inp_age" className="age">Age</label>
                <input type="number" id="inp_age" className="inp_age" required ref={ageRef} min={1} />

                <label htmlFor="inp_gender" className="gender">Gender</label>
                <select id="inp_gender" className="inp_gender" required ref={genderRef}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

                <label htmlFor="blood_g" className="blood_group">Blood Group</label>
                <input type="text" id="blood_g" className="blood_g" ref={bloodRef} placeholder="e.g. O+, A+, B-" />

                <label htmlFor="curr_add" className="current_address">Current Address</label>
                <input type="text" id="curr_add" className="curr_add" required ref={currRef} />

                <label htmlFor="native_add" className="native_address">Native Address</label>
                <input type="text" id="native_add" className="native_add" required ref={nativeRef} />

                <label htmlFor="e_contact" className="emergency_contact">Emergency Contact</label>
                <input type="text" id="e_contact" className="e_contact" required ref={emergencyRef} />

                <label htmlFor="occupation" className="occupation">Occupation</label>
                <input type="text" id="occupation" className="occupation" ref={occupationRef} />

                <label htmlFor="inp_aadhar" className="aadhar">Aadhar Number (12 Digits)</label>
                <input type="text" id="inp_aadhar" className="inp_aadhar" required ref={aadharRef} maxLength={12} />

                <button type='submit'>{meth === "PUT" ? "Update Migrant Profile" : "Register Migrant"}</button>
            </form>
        </div>
    );
};

export default Migrant;
