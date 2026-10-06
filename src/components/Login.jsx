import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Login.css';

const Login = () => {

    const login_url = "https://health-yatra.onrender.com/authorize/login";
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [view, setView] = useState("password");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    function handleUsername(e) {
        setUsername(e.target.value);
    }

    function handlePass(e) {
        setPass(e.target.value);
    }

    function handleView(){
        setView(prev => prev === "password" ? "text" : "password");
    }

    async function login(e) {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const response = await fetch(login_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: pass
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    console.log("Token saved successfully:", data.token);
                    window.location.href = "/dashboard";
                } else {
                    setErrorMsg("Authentication token not received!");
                }
            }
            else {
                setErrorMsg("Invalid Username or Password! Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setErrorMsg("Network error occurred while logging in!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-container'>
            <form onSubmit={login} className="login-from">
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1d4ed8' }}>HealthYatra Login</h2>
                
                {errorMsg && (
                    <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <label htmlFor="username" className="email">Username</label>
                <br />
                <input 
                    type="text" 
                    id="username"
                    className="email-inp" 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={handleUsername} 
                    required
                />
                <br />
                <label htmlFor="password" className="password">Password</label>
                <br />
                <div className="password-wrapper">
                    <input 
                        type={view} 
                        id="password"
                        className="password-inp" 
                        placeholder="Enter your password" 
                        value={pass}
                        onChange={handlePass} 
                        required
                    />
                    <i className="toggle-password" onClick={handleView} style={{ cursor: 'pointer' }}>
                        {view === 'password' ? '👁️' : '🙈'}
                    </i>
                </div>
                <br />
                <input 
                    type="submit" 
                    value={loading ? "Logging in..." : "Login"} 
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                />  

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#1d4ed8', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
