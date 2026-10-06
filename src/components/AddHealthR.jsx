import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/AddHealthR.css"

const AddHealthR = (props) => {

    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();

    const[id, setId] = useState(null);
    const [statusMsg, setStatusMsg] = useState("");

    const sympRef = useRef();
    const diagRef = useRef();
    const allerRef = useRef();
    const mediRef = useRef();
    const disRef = useRef();
    const chrRef = useRef();
    const aadharRef = useRef();

    useEffect(() => {
        const initialAadhar = location.state?.aadhar || props?.aadhar || localStorage.getItem("searchedAadhar") || "";
        if (initialAadhar && aadharRef.current) {
            aadharRef.current.value = initialAadhar;
        }
    }, [location.state, props]);

    async function handleHealthRecord(e) {
        e.preventDefault();
        const details = {
            symptoms: sympRef.current.value,
            diagnosis: diagRef.current.value,
            allergis: allerRef.current.value,
            medicine_pres: mediRef.current.value,
            disease: disRef.current.value,
            chronic_cond: chrRef.current.value,
            migAadhar: aadharRef.current.value
        }

        try {
            const response = await fetch("https://health-yatra.onrender.com/record/health-record", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });

            if (response.ok) {
                console.log("Record saved!");
                setStatusMsg("Health record saved successfully!");
                alert("Health record saved successfully!");
                navigate('/dashboard');
            }
            else {
                console.error("Record not saved!");
                setStatusMsg("Failed to save health record. Check details.");
            }
        }
        catch (e) {
            console.error(e);
            setStatusMsg("Error occurred while saving record.");
        }
    }

    return (
        <div className="health-container">
            <form action="" onSubmit={handleHealthRecord} className="add-health-r">
                <label htmlFor="" className={id ? "user-id" : "no-id"}>Id</label>
                <input type="number" className={id ? "inp-d" : "no-id"} />
                <label htmlFor="" className="symp">Symptoms</label>
                <input type="text" className="inp-symp" ref={sympRef} />
                <label htmlFor="">Diagnosis</label>
                <input type="text" className="inp-diag" ref={diagRef} />
                <label htmlFor="" className="allergis">Allergis</label>
                <input type="text" className="inp-aller" ref={allerRef} />
                <label htmlFor="">Medicine Prescribed</label>
                <input type="text" className="inp-medi-pres" ref={mediRef} />
                <label htmlFor="" className="disease">Disease</label>
                <input type="text" className="inp-dise" ref={disRef} />
                <label htmlFor="" className="chro-cond">Chronic Cond</label>
                <select name="" id="" className="inp-chro-cond" ref={chrRef}>
                    <option value="NONE">None / No chronic condition</option>
                    <option value="DIABETES">Diabetes</option>
                    <option value="HYPERTENSION">Hypertension (High BP)</option>
                    <option value="HEART_DISEASE">Heart Disease</option>
                    <option value="ASTHMA">Asthma</option>
                    <option value="COPD">COPD / Chronic Lung Disease</option>
                    <option value="THYROID_DISORDER">Thyroid Disorder</option>
                    <option value="KIDNEY_DISEASE">Kidney Disease</option>
                    <option value="LIVER_DISEASE">Liver Disease</option>
                    <option value="ARTHRITIS">Arthritis / Joint Disease</option>
                    <option value="EPILEPSY">Epilepsy / Seizure Disorder</option>
                    <option value="CANCER">Cancer</option>
                    <option value="AUTOIMMUNE_DISEASE">Autoimmune Disease</option>
                    <option value="CHRONIC_GASTROINTESTINAL_DISEASE">Chronic Gastrointestinal Disease</option>
                    <option value="CHRONIC_NEUROLOGICAL_DISORDER">Chronic Neurological Disorder</option>
                    <option value="CHRONIC_PAIN">Chronic Pain</option>
                    <option value="OTHER">Other</option>
                </select>
                <label htmlFor="" className="aadhar">Aadhar</label>
                <input type="text" className="inp-aadhar" ref={aadharRef} />
                <button type='submit'>Save Record</button>
            </form>
        </div>
    )
}

export default AddHealthR
