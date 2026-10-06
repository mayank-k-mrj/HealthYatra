import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DocDashboard from './DocDashboard'
import AddHealthR from '../../AddHealthR'
import Register from '../../Register'
import Migrant from '../../Migrant'
import Doctor from '../../Doctor'
import './DoctorMainBox.css'

const DoctorMainBox = (props) => {
  return (
    <div className="doc-main-box">
      <Routes>
        <Route 
          path="/dashboard" 
          element={<DocDashboard doctor={props.doctor} record={props.record} pic_url={props.pic_url} />} 
        />
        <Route 
          path="/register-migrant" 
          element={<Register />} 
        />
        <Route 
          path="/add-health" 
          element={<AddHealthR />} 
        />
        <Route 
          path="/register-doctor" 
          element={<Doctor aadhar={null} />} 
        />
        <Route 
          path="/" 
          element={<DocDashboard doctor={props.doctor} record={props.record} pic_url={props.pic_url} />} 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default DoctorMainBox;
