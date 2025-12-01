import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/admin');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="section" style={{ minHeight: '70vh' }}>
            <div className="container">
                <div className="admin-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#FFA500' }}>
                        เข้าสู่ระบบผู้ดูแล
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div style={{ color: 'red', marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            เข้าสู่ระบบ
                        </button>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <p>สำหรับการทดสอบใช้:</p>
                            <p>Username: <strong>admin</strong></p>
                            <p>Password: <strong>password123</strong></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;