import React, { useContext, useEffect, useState } from 'react';
import '../Dashboard/MigrantDash.css';
import MigSidebar from './SubComponents/MigSidebar';
import MigMainBox from './SubComponents/MigMainBox';
import { MigContext } from '../../App';
import { extractPicUrl } from '../../services/api';

const MigrantDash = () => {

  const [pic_url, setPic_url] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);
  const [prof_pic, setProf_pic] = useState("");
  const [total_dia, setTotal_dia] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [register, setRegister] = useState(null);

  const aadhar = useContext(MigContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (aadhar) {
      fetchRecords();
      getMigrantDetails();
      getProfPicURL();
      handleRegisteredData();
    }
  }, [aadhar]);

  useEffect(() => {
    if (prof_pic) {
      setPic_url(extractPicUrl(prof_pic));
    }
  }, [prof_pic]);

  // Function for fetching Migrant Record.
  async function fetchRecords() {
    try {
      const response = await fetch(`https://health-yatra.onrender.com/record/fetch-health/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const res = await response.json();
        setData(res);
        console.log("Migrant Records fetched successfully!");
        setTotal_dia(res.length);
        handleDoctor(res);
        handleHospital(res);
      }
      else {
        console.log("Migrant Records not fetched!");
      }
    }
    catch (e) {
      console.error("Error occured : ", e);
    }
  }

  // Function for getting total number of doctors.
  function handleDoctor(response) {
    if (response && Array.isArray(response)) {
      const mySet = new Set();
      response.forEach(item => {
        if (Array.isArray(item?.docAadhar)) {
          item.docAadhar.forEach(doc => {
            if (doc?.aadhar) {
              mySet.add(doc.aadhar);
            }
          });
        }
      });
      setDoctor(mySet.size);
    }
  }

  //Function for getting number of hospitals.
  function handleHospital(response){
    if(response && Array.isArray(response)){
      const mySet = new Set();
      response.forEach(item => {
        if(Array.isArray(item?.docAadhar)){
          item.docAadhar.forEach(doc => {
            if(doc?.hospital_name){
              mySet.add(doc.hospital_name);
            }
          });
        }
      });
      setHospital(mySet.size);
    }
  } 

  async function handleRegisteredData(){
    try {
      const response = await fetch(`https://health-yatra.onrender.com/authorize/getReg-data/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if(response.ok){
        const reg = await response.json();
        setRegister(reg);
        console.log("Registered data fetched successfully!");
      }
      else{
        console.log("Error while fetching registered data!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getMigrantDetails() {
    try {
      const response = await fetch(`https://health-yatra.onrender.com/migrant/mig/${aadhar}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const mig_d = await response.json();
        console.log("Got the Migrant details!");
        setDetails(mig_d);
        setUser(mig_d);
      }
      else {
        console.log("Error while fetching Migrant data!");
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
      }
      else {
        console.log("Error while fetching Profile Pic!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='migrant-dashboard-container'>
      <MigSidebar pic_url={pic_url} user={user} />
      <MigMainBox
        pic_url={pic_url}
        setPic_url={setPic_url}
        user={user}
        setUser={setUser}
        data={data}
        details={details}
        total_dia={total_dia}
        doctor={doctor}
        hospital={hospital}
        register={register}
      />
    </div>
  );

};

export default MigrantDash;
