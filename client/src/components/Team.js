import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Team = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/team`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ตรวจสอบว่า data เป็น array หรือไม่
            if (Array.isArray(data)) {
                setTeamMembers(data);
            } else {
                setTeamMembers([]);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
            setError(error.message);
            // ข้อมูลตัวอย่าง
            setTeamMembers([
                {
                    id: 1,
                    profile_image: 'https://via.placeholder.com/150/FFA500/ffffff?text=JD',
                    firstname: 'John',
                    lastname: 'Doe',
                    position: 'Lead Developer',
                    link_contact: '#'
                },
                {
                    id: 2,
                    profile_image: 'https://via.placeholder.com/150/333333/ffffff?text=JS',
                    firstname: 'Jane',
                    lastname: 'Smith',
                    position: 'UI/UX Designer',
                    link_contact: '#'
                },
                {
                    id: 3,
                    profile_image: 'https://via.placeholder.com/150/666666/ffffff?text=BS',
                    firstname: 'Bob',
                    lastname: 'Smith',
                    position: 'Project Manager',
                    link_contact: '#'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="team" className="section">
            <div className="container">
                <div className="section-title">
                    <h2>ทีมงานของเรา</h2>
                    <p>ทีมงานผู้เชี่ยวชาญพร้อมให้บริการ</p>
                </div>
                
                {/* ... error และ loading ... */}
                
                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #FFA500',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}></div>
                        <p style={{ marginTop: '1rem' }}>กำลังโหลดข้อมูลทีมงาน...</p>
                    </div>
                ) : teamMembers.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            color: '#ddd',
                            marginBottom: '1rem'
                        }}>
                            👥
                        </div>
                        <p>ยังไม่มีข้อมูลทีมงาน</p>
                    </div>
                ) : (
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={member.id || `${member.firstname}-${member.lastname}`} 
                                className="team-member"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'fadeInUp 0.5s ease forwards',
                                    opacity: 0
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src={member.profile_image || 'https://via.placeholder.com/150/CCCCCC/333333?text=No+Image'} 
                                        alt={`${member.firstname} ${member.lastname}`}
                                        className="profile-img"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150/CCCCCC/333333?text=Image+Error';
                                        }}
                                    />
                                </div>
                                <h3>{member.firstname} {member.lastname}</h3>
                                <p>{member.position || 'ตำแหน่ง'}</p>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <a 
                                        href={member.link_contact || '#'} 
                                        className="btn" 
                                        style={{ 
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <FaEnvelope /> ติดต่อ
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Team;