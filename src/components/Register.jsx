import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../components/Register.css"

const Register = () => {

    const pass1Ref = useRef();
    const pass2Ref = useRef();
    const emailRef = useRef();
    const otpRef = useRef();
    const userRef = useRef();
    const aadharRef = useRef();
    const phoneRef = useRef();
    const roleRef = useRef();

    const [stat, setStat] = useState(false);
    const [send, setSend] = useState("Verify Email");
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState(true);
    const [pass_stat, setPass_stat] = useState("");
    const [register, setRegister] = useState("Register");
    const [feedbackMsg, setFeedbackMsg] = useState({ text: "", isError: false });

    const navigate = useNavigate();

    function handlePassword() {
        const symbols = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "`"];
        const pass = pass1Ref.current.value;

        const correct_pass = symbols.some(symbol => pass.includes(symbol));

        if (correct_pass) {
            if (pass.length >= 8) {
                if (pass.includes(" ")) {
                    setPass_stat("No spaces allowed in password!");
                    return false;
                }
                else {
                    if (pass === pass2Ref.current.value) {
                        setPass_stat("Password Matched!");
                        return true;
                    }
                    else {
                        setPass_stat("Passwords do not match!");
                        return false;
                    }
                }
            }
            else {
                setPass_stat("Minimum 8 characters required!");
                return false;
            }
        }
        else {
            setPass_stat("Password must contain at least one special symbol (~, !, @, #, $, %, ^, &, *)!");
            return false;
        }
    }

    function handleAadhar() {
        let aadhar = aadharRef.current.value;
        if (aadhar.length === 12) {
            return true;
        }
        else {
            setFeedbackMsg({ text: "Aadhar must be exactly 12 digits!", isError: true });
            return false;
        }
    }

    async function emailVerification(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        if (!email) {
            setFeedbackMsg({ text: "Please enter an email address!", isError: true });
            return;
        }
        setSend("Sending OTP...");
        setFeedbackMsg({ text: "", isError: false });
        try {
            const response = await fetch("https://health-yatra.onrender.com/authorize/verifyemail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                })
            });
            if (response.ok) {
                setStat(true);
                setSend("OTP Sent");
                setFeedbackMsg({ text: `OTP sent successfully to ${email}. Check your inbox!`, isError: false });
            }
            else {
                setSend("Verify Email");
                setFeedbackMsg({ text: "Error sending OTP. Please verify email address.", isError: true });
            }
        }
        catch (e) {
            console.error(e);
            setSend("Verify Email");
            setFeedbackMsg({ text: "Network error occurred while sending OTP.", isError: true });
        }
    }

    async function handleOTP(e) {
        e.preventDefault();
        const otp_val = otpRef.current.value;
        const email_val = emailRef.current.value;
        if (!otp_val) {
            setFeedbackMsg({ text: "Please enter the OTP!", isError: true });
            return;
        }
        try {
            const response = await fetch("https://health-yatra.onrender.com/authorize/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email_val,
                    otp: otp_val
                })
            });
            if (response.ok) {
                setVerified(true);
                setFeedbackMsg({ text: "Email Verified Successfully!", isError: false });
                return true;
            }
            else {
                setFeedbackMsg({ text: "Invalid or expired OTP! Please try again.", isError: true });
                return false;
            }
        }
        catch (e) {
            console.error(e);
            setFeedbackMsg({ text: "Network error during OTP verification.", isError: true });
        }
    }

    function handlePassToggle() {
        setPassword(prev => !prev);
    }

    async function handleRegister(e) {
        e.preventDefault();
        setFeedbackMsg({ text: "", isError: false });

        if (!verified) {
            setFeedbackMsg({ text: "Please verify your email address via OTP first!", isError: true });
            return;
        }

        const validPass = handlePassword();
        const validAadhar = handleAadhar();

        if (validPass && verified && validAadhar) {
            try {
                setRegister("Registering...");
                const details = {
                    username: userRef.current.value,
                    name: emailRef.current.value, // Backend 'name' field stores Email address
                    aadhar: aadharRef.current.value,
                    password: pass1Ref.current.value,
                    phone: phoneRef.current.value,
                    role: roleRef.current.value
                };

                const response = await fetch("https://health-yatra.onrender.com/authorize/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(details)
                });
                if (response.ok) {
                    setRegister("Registered Successfully!");
                    setFeedbackMsg({ text: "Registration Successful! Redirecting to login...", isError: false });
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
                else {
                    setRegister("Register");
                    setFeedbackMsg({ text: "Registration failed. Username, email, or Aadhar may already exist.", isError: true });
                }
            }
            catch (e) {
                console.error(e);
                setRegister("Register");
                setFeedbackMsg({ text: "Network error occurred during registration.", isError: true });
            }
        }
    }

    return (
        <div className='register-container'>
            <form className='register-form' onSubmit={handleRegister}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1d4ed8' }}>HealthYatra Registration</h2>

                {feedbackMsg.text && (
                    <div style={{ 
                        color: feedbackMsg.isError ? '#ef4444' : '#15803d', 
                        backgroundColor: feedbackMsg.isError ? '#fef2f2' : '#f0fdf4', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        marginBottom: '15px', 
                        fontSize: '13px', 
                        textAlign: 'center' 
                    }}>
                        {feedbackMsg.text}
                    </div>
                )}

                <label htmlFor="user-inp" className='username'>Username</label>
                <input type="text" id="user-inp" className='user-inp' ref={userRef} required />

                <label htmlFor="email-inp" className='email'>Email</label>
                <input type="email" id="email-inp" className='email-inp' required ref={emailRef} />
                <button type='button' onClick={emailVerification} style={{ margin: '8px 0 15px 0' }}>{send}</button>

                <label htmlFor="otp-inp" className={stat ? "otp" : "no_otp"}>OTP Code</label>
                <input type="text" id="otp-inp" className={stat ? "otp-inp" : "no_otp-inp"} ref={otpRef} />
                <button type='button' className={stat ? "otp_btn" : "no_otp_btn"} onClick={handleOTP} style={{ margin: '8px 0 15px 0' }}>Verify OTP</button>

                <label htmlFor="aadhar-inp" className='aadhar'>Aadhar Number (12 Digits)</label>
                <input type="text" id="aadhar-inp" className='aadhar-inp' required ref={aadharRef} maxLength={12} />

                <div className="password-box">
                    <label htmlFor="password-inp" className='password'>Password</label>
                    <div className="inp-box">
                        <input type={password ? "password" : "text"} id="password-inp" className='password-inp' required ref={pass1Ref} />
                        <span className='eye' onClick={handlePassToggle} style={{ cursor: 'pointer' }}>{password ? "👁️" : "🙈"}</span>
                    </div>
                </div>

                <label htmlFor="password-inp1" className='password1'>Confirm Password</label>
                <input type="password" id="password-inp1" className='password-inp1' required ref={pass2Ref} />
                {pass_stat && <p style={{ fontSize: '12px', color: pass_stat.includes('Matched') ? '#15803d' : '#ef4444', margin: '4px 0 10px 0' }}>{pass_stat}</p>}

                <label htmlFor="phone-inp" className='phone'>Phone Number</label>
                <input type="text" id="phone-inp" className='phone-inp' ref={phoneRef} required />

                <label htmlFor="role" className='role'>Register As</label>
                <select name="role" id="role" ref={roleRef} style={{ padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }}>
                    <option value="USER">USER (Migrant Patient)</option>
                    <option value="DOCTOR">DOCTOR</option>
                </select>

                <button type='submit' style={{ marginTop: '15px' }}>{register}</button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: '#1d4ed8', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
