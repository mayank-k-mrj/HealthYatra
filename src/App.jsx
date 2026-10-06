import { createContext, useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import DoctorDash from './components/Doc_Dadhboard/DoctorDash'
import MigrantDash from './components/Dashboard/MigrantDash'
import Login from './components/Login'
import Register from './components/Register'

export const MigContext = createContext();
export const DocContext = createContext();

function App() {

    const token = localStorage.getItem('token');
    const [aadhar, setAadhar] = useState(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(!!token);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        getAadhar();
    }, [token]);

    useEffect(() => {
        if (aadhar) {
            getRole();
        }
    }, [aadhar]);

    async function getAadhar() {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("https://health-yatra.onrender.com/authorize/loggedIn", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const val = await response.text();
                setAadhar(val);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Aadhar:", error);
            setLoading(false);
        }
    }

    async function getRole() {
        if (!aadhar) return;
        try {
            const response = await fetch(`https://health-yatra.onrender.com/authorize/getReg-data/${aadhar}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const rle = await response.json();
                setRole(rle.role);
                console.log("Role Fetched! ", rle.role);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='app-container'>
            <BrowserRouter>
                <MigContext.Provider value={aadhar}>
                    <DocContext.Provider value={aadhar}>
                        <Routes>
                            {/* Public Auth Routes */}
                            <Route path='/register' element={<Register />}/>
                            <Route path='/login' element={<Login />}/>

                            {/* Guarded Role-Based Application Routes */}
                            <Route 
                                path='/*' 
                                element={
                                    loading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
                                            Loading HealthYatra...
                                        </div>
                                    ) : token ? (
                                        role === "USER" ? <MigrantDash /> : <DoctorDash />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                } 
                            />
                        </Routes>
                    </DocContext.Provider>
                </MigContext.Provider>
            </BrowserRouter>
        </div>
    )
}

export default App;
