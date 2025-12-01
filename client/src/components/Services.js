import React, { useState, useEffect } from 'react';
import { FaCode, FaMobileAlt, FaDatabase, FaCloud, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { API_URL } from '../config';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/services`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ตรวจสอบว่า data เป็น array หรือไม่
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error.message);
            // ข้อมูลตัวอย่าง
            setServices([
                {
                    id: 1,
                    icon: 'code',
                    title: 'Web Development',
                    description: 'พัฒนาเว็บไซต์ Responsive ทุกรูปแบบ'
                },
                {
                    id: 2,
                    icon: 'mobile',
                    title: 'Mobile App',
                    description: 'สร้างแอปพลิเคชัน iOS และ Android'
                },
                {
                    id: 3,
                    icon: 'database',
                    title: 'Database Design',
                    description: 'ออกแบบและพัฒนาระบบฐานข้อมูล'
                },
                {
                    id: 4,
                    icon: 'cloud',
                    title: 'Cloud Services',
                    description: 'บริการคลาวด์และโฮสติ้ง'
                },
                {
                    id: 5,
                    icon: 'security',
                    title: 'Security',
                    description: 'ตรวจสอบและเพิ่มความปลอดภัยระบบ'
                },
                {
                    id: 6,
                    icon: 'rocket',
                    title: 'API Development',
                    description: 'พัฒนาระบบ API สำหรับแอปพลิเคชัน'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const iconMap = {
        code: FaCode,
        mobile: FaMobileAlt,
        database: FaDatabase,
        cloud: FaCloud,
        security: FaShieldAlt,
        rocket: FaRocket
    };

    return (
        <section id="services" className="section">
            <div className="container">
                <div className="section-title">
                    <h2>บริการของเรา</h2>
                    <p>เรามอบบริการครบวงจรสำหรับธุรกิจดิจิทัลของคุณ</p>
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
                        <p style={{ marginTop: '1rem' }}>กำลังโหลดบริการ...</p>
                    </div>
                ) : (
                    <div className="services-grid">
                        {services.map((service, index) => {
                            const Icon = iconMap[service.icon] || FaCode;
                            return (
                                <div 
                                    key={service.id || index} 
                                    className="service-card"
                                    style={{ 
                                        animationDelay: `${index * 0.1}s`,
                                        animation: 'fadeInUp 0.5s ease forwards',
                                        opacity: 0
                                    }}
                                >
                                    <div className="service-icon">
                                        <Icon />
                                    </div>
                                    <h3>{service.title || 'บริการ'}</h3>
                                    <p>{service.description || 'คำอธิบายบริการ'}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <style jsx="true">{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default Services;