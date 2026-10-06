import React, { useEffect, useRef, useState } from 'react'
import "../components/ProPic.css"

const ProPic = (props) => {
    const picRef = useRef();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (props.aadhar) {
            console.log("Aadhar loaded successfully: ", props.aadhar);
        } else {
            console.log("Waiting for Aadhar to load...");
        }
    }, [props.aadhar])
    
    
    async function handleSubmit(){
        if (!props.aadhar) {
            alert("Aadhar value is not available yet! Please wait for it to load.");
            console.log("Aadhar is undefined, upload aborted.");
            return;
        }

        const pic = picRef.current?.files[0];
        if (!pic) {
            alert("Select an image first!");
            return;
        }

        console.log("Uploading file for Aadhar: ", props.aadhar);
        const formData = new FormData();
        formData.append("file", pic);

        try {
            const response = await fetch(`https://health-yatra.onrender.com/migrant/upload/${props.aadhar}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                console.log("Image successfully uploaded for Aadhar: ", props.aadhar);
                alert("Profile image uploaded successfully!");
            } else {
                console.log("Image uploading failed! Status: ", response.status);
                alert("Image uploading failed!");
            }
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    }

    return (
        <div className='ProfPic_container'>
            <label htmlFor="" className='profile_pic'>Set profile pic</label>
            <input type="file" ref={picRef}/>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default ProPic
