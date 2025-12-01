import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/articles`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ตรวจสอบว่า data เป็น array หรือไม่
            if (Array.isArray(data)) {
                setArticles(data);
            } else if (data && typeof data === 'object') {
                // ถ้าเป็น object ให้แปลงเป็น array
                if (data.error) {
                    throw new Error(data.error);
                }
                // ถ้ามี property ที่เป็น array ให้ใช้มัน
                const arrayData = Object.values(data).find(val => Array.isArray(val));
                setArticles(arrayData || []);
            } else {
                setArticles([]);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError(error.message);
            // ข้อมูลตัวอย่าง
            setArticles([
                {
                    id: 1,
                    thumbnail: 'https://via.placeholder.com/350x200/FFA500/ffffff?text=Web+Trend',
                    title: 'เทรนด์การพัฒนาเว็บปี 2024',
                    description: 'อัพเดทเทรนด์เทคโนโลยีเว็บที่มาแรง',
                    content: 'บทความเกี่ยวกับเทรนด์เว็บไซต์...'
                },
                {
                    id: 2,
                    thumbnail: 'https://via.placeholder.com/350x200/333333/ffffff?text=API+Security',
                    title: 'ความปลอดภัยของ API',
                    description: 'วิธีป้องกัน API จากภัยคุกคาม',
                    content: 'บทความเกี่ยวกับความปลอดภัย...'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section id="articles" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>บทความล่าสุด</h2>
                        <p>กำลังโหลด...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error && articles.length === 0) {
        return (
            <section id="articles" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>บทความล่าสุด</h2>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="articles" className="section">
            <div className="container">
                <div className="section-title">
                    <h2>บทความล่าสุด</h2>
                    <p>อัพเดทความรู้และข่าวสารเกี่ยวกับเทคโนโลยี</p>
                </div>
                
                {/* ... error message ... */}
                
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
                        <p style={{ marginTop: '1rem' }}>กำลังโหลดบทความ...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            color: '#ddd',
                            marginBottom: '1rem'
                        }}>
                            📝
                        </div>
                        <p>ยังไม่มีบทความ</p>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {articles.map((article, index) => (
                            <div 
                                key={article.id || article.title} 
                                className="article-card"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'fadeInUp 0.5s ease forwards',
                                    opacity: 0
                                }}
                            >
                                <div style={{ overflow: 'hidden' }}>
                                    <img 
                                        src={article.thumbnail || 'https://via.placeholder.com/350x200/CCCCCC/333333?text=No+Image'} 
                                        alt={article.title}
                                        className="article-thumbnail"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/350x200/CCCCCC/333333?text=Image+Error';
                                        }}
                                    />
                                </div>
                                <div className="article-content">
                                    <h3>{article.title || 'ไม่มีชื่อบทความ'}</h3>
                                    <p>{article.description || 'ไม่มีคำอธิบาย'}</p>
                                    <button 
                                        className="btn" 
                                        onClick={() => window.open(`#article-${article.id}`, '_blank')}
                                        style={{
                                            alignSelf: 'flex-start',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>อ่านต่อ</span>
                                        <span style={{ fontSize: '1.2rem' }}>→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Articles;