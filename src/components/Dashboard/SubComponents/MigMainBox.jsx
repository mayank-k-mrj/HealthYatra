import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MigDashboard from './MigDashboard'
import MyDiagnosis from './MyDiagnosis'
import Medicine from './Medicine'
import Record from './Record'

const MigMainBox = (props) => {
  return (
    <div className="migrant-main-box">
      <Routes>
        <Route
          path="/"
          element={
            <MigDashboard
              pic_url={props.pic_url}
              setPic_url={props.setPic_url}
              setUser={props.setUser}
              details={props.details}
              data={props.data}
              total_dia={props.total_dia}
              doctor={props.doctor}
              hospital={props.hospital}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <MigDashboard
              pic_url={props.pic_url}
              setPic_url={props.setPic_url}
              setUser={props.setUser}
              details={props.details}
              data={props.data}
              total_dia={props.total_dia}
              doctor={props.doctor}
              hospital={props.hospital}
            />
          }
        />
        <Route
          path="/diagnoses"
          element={
            <MyDiagnosis
              pic_url={props.pic_url}
              details={props.details}
              data={props.data}
              total_dia={props.total_dia}
            />
          }
        />
        <Route
          path="/medicines"
          element={
            <Medicine
              details={props.details}
              pic_url={props.pic_url}
              data={props.data}
            />
          }
        />
        <Route
          path="/reports"
          element={
            <Record
              data={props.data}
              register={props.register}
              details={props.details}
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default MigMainBox
