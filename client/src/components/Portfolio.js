import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/portfolio`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ตรวจสอบว่า data เป็น array หรือไม่
            if (Array.isArray(data)) {
                setPortfolios(data);
            } else {
                setPortfolios([]);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            setError(error.message);
            // ข้อมูลตัวอย่าง
            setPortfolios([
                {
                    id: 1,
                    thumbnail: 'https://via.placeholder.com/350x250/FFA500/ffffff?text=E-commerce',
                    title: 'ระบบ E-commerce',
                    description: 'พัฒนาเว็บขายของออนไลน์ครบวงจร',
                    link: '#'
                },
                {
                    id: 2,
                    thumbnail: 'https://via.placeholder.com/350x250/333333/ffffff?text=Mobile+App',
                    title: 'แอปมือถือ',
                    description: 'แอปพลิเคชันสำหรับธุรกิจร้านอาหาร',
                    link: '#'
                },
                {
                    id: 3,
                    thumbnail: 'https://via.placeholder.com/350x250/666666/ffffff?text=CRM+System',
                    title: 'ระบบ CRM',
                    description: 'ระบบจัดการลูกค้าสัมพันธ์สำหรับธุรกิจ',
                    link: '#'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="portfolio" className="section">
            <div className="container">
                <div className="section-title">
                    <h2>ผลงานของเรา</h2>
                    <p>โปรเจคที่เราได้สร้างให้ลูกค้า</p>
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
                        <p style={{ marginTop: '1rem' }}>กำลังโหลดผลงาน...</p>
                    </div>
                ) : portfolios.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            color: '#ddd',
                            marginBottom: '1rem'
                        }}>
                            📁
                        </div>
                        <p>ยังไม่มีผลงาน</p>
                    </div>
                ) : (
                    <div className="portfolio-grid">
                        {portfolios.map((item, index) => (
                            <div 
                                key={item.id || item.title} 
                                className="portfolio-item"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'fadeInUp 0.5s ease forwards',
                                    opacity: 0
                                }}
                            >
                                <div style={{ overflow: 'hidden' }}>
                                    <img 
                                        src={item.thumbnail || 'https://via.placeholder.com/350x250/CCCCCC/333333?text=No+Image'} 
                                        alt={item.title}
                                        className="portfolio-img"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/350x250/CCCCCC/333333?text=Image+Error';
                                        }}
                                    />
                                </div>
                                <div className="portfolio-content">
                                    <h3>{item.title || 'ไม่มีชื่อผลงาน'}</h3>
                                    <p>{item.description || 'ไม่มีคำอธิบาย'}</p>
                                    {item.link && (
                                        <a 
                                            href={item.link} 
                                            className="btn" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>ดูรายละเอียด</span>
                                            <span style={{ fontSize: '1.2rem' }}>→</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Portfolio;