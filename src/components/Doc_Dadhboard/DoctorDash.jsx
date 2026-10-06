import React, { useContext, useEffect, useState } from 'react'
import DocSideBar from './subComponents/DocSideBar'
import './DoctorDash.css'
import { DocContext } from '../../App'
import DoctorMainBox from './subComponents/DoctorMainBox'
import { extractPicUrl } from '../../services/api'

const DoctorDash = () => {

  const token = localStorage.getItem('token');

  const [record, setRecord] = useState([]);
  const [prof_pic, setProf_pic] = useState("");
  const [pic_url, setPic_url] = useState("");
  const [doctor, setDoctor] = useState(null);

  const aadhar = useContext(DocContext);

  useEffect(() => {
    if(aadhar){
      handleRecord();
      handleDoctor();
      getProfPicURL();
    }
  }, [aadhar]);

  useEffect(() => {
    if (prof_pic) {
      setPic_url(extractPicUrl(prof_pic));
    }
  }, [prof_pic]);

  async function handleRecord(){
    try {
      const response = await fetch("https://health-yatra.onrender.com/record/fetch-all", {
        method: "GET",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if(response.ok){
        console.log("All health records fetched!");
        const data = await response.json();
        setRecord(Array.isArray(data) ? data : []);
      }
      else{
        console.error("Error while fetching health record!");
      }
    } catch (e) {
      console.error("Error fetching all records:", e);
    }
  }

  async function handleDoctor(){
    try {
      const response = await fetch(`https://health-yatra.onrender.com/doctor/doc/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if(response.ok){
        console.log("Doctor's data fetched!");
        const data = await response.json();
        setDoctor(data);
      }
      else{
        console.log("Doctor's data not fetched!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getProfPicURL() {
    if (!aadhar || String(aadhar).length !== 12) return;
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
            setPic_url(extractPicUrl(rawPic));
          }
        } catch {
          if (text) {
            setProf_pic(text);
            setPic_url(extractPicUrl(text));
          }
        }
      } else {
        setPic_url("");
      }
    } catch (e) {
      setPic_url("");
    }
  }

  return (
    <div className="doc-dash-container">
      <DocSideBar doctor={doctor} pic_url={pic_url}/>
      <DoctorMainBox doctor={doctor} record={record} pic_url={pic_url}/>
    </div>
  )
}

export default DoctorDash;
