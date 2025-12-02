import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { 
    FaNewspaper, FaTasks, FaUsers, FaChartLine, 
    FaArrowUp, FaArrowDown, FaEye, FaEdit 
} from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({
        articles: 0,
        services: 0,
        portfolios: 0,
        teamMembers: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch all data in parallel
            const [articlesRes, servicesRes, portfoliosRes, teamRes] = await Promise.all([
                fetch(`${API_URL}/articles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/services`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/portfolio`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/team`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // Process responses
            const articles = await articlesRes.json();
            const services = await servicesRes.json();
            const portfolios = await portfoliosRes.json();
            const team = await teamRes.json();

            setStats({
                articles: Array.isArray(articles) ? articles.length : 0,
                services: Array.isArray(services) ? services.length : 0,
                portfolios: Array.isArray(portfolios) ? portfolios.length : 0,
                teamMembers: Array.isArray(team) ? team.length : 0
            });

            // Create recent activity from all data
            const activity = [];
            
            if (Array.isArray(articles)) {
                articles.slice(0, 3).forEach(article => {
                    activity.push({
                        type: 'article',
                        title: article.title,
                        date: new Date(article.created_at).toLocaleDateString('th-TH'),
                        icon: <FaNewspaper />,
                        color: '#4CAF50'
                    });
                });
            }

            if (Array.isArray(portfolios)) {
                portfolios.slice(0, 2).forEach(portfolio => {
                    activity.push({
                        type: 'portfolio',
                        title: portfolio.title,
                        date: new Date(portfolio.created_at).toLocaleDateString('th-TH'),
                        icon: <FaTasks />,
                        color: '#2196F3'
                    });
                });
            }

            // Sort by date (newest first)
            activity.sort((a, b) => new Date(b.date) - new Date(a.date));
            setRecentActivity(activity.slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, change }) => {
        return (
            <div className="stat-card" style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    backgroundColor: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: color
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>{value}</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>{title}</p>
                    {change && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            marginTop: '5px',
                            fontSize: '0.9rem',
                            color: change > 0 ? '#4CAF50' : '#F44336'
                        }}>
                            {change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                            <span>{Math.abs(change)}% จากเดือนที่แล้ว</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="admin-card">
                <h2>แดชบอร์ด</h2>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-card">
                <h2>แดชบอร์ด</h2>
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>แดชบอร์ด</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                        backgroundColor: '#FFA500', 
                        color: 'white', 
                        padding: '5px 15px', 
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FaChartLine />
                        ภาพรวมระบบ
                    </span>
                    <button 
                        onClick={fetchDashboardData}
                        style={{ 
                            padding: '8px 15px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <StatCard 
                    title="บทความทั้งหมด" 
                    value={stats.articles} 
                    icon={<FaNewspaper />} 
                    color="#4CAF50"
                    change={stats.articles > 0 ? 12 : 0}
                />
                <StatCard 
                    title="บริการ" 
                    value={stats.services} 
                    icon={<FaTasks />} 
                    color="#2196F3"
                    change={stats.services > 0 ? 8 : 0}
                />
                <StatCard 
                    title="ผลงาน" 
                    value={stats.portfolios} 
                    icon={<FaTasks />} 
                    color="#FF9800"
                    change={stats.portfolios > 0 ? 15 : 0}
                />
                <StatCard 
                    title="สมาชิกทีม" 
                    value={stats.teamMembers} 
                    icon={<FaUsers />} 
                    color="#9C27B0"
                    change={stats.teamMembers > 0 ? 5 : 0}
                />
            </div>

            {/* Recent Activity */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEye />
                    กิจกรรมล่าสุด
                </h3>
                
                {recentActivity.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        <p>ยังไม่มีกิจกรรมล่าสุด</p>
                    </div>
                ) : (
                    <div>
                        {recentActivity.map((activity, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '1rem',
                                    borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: `${activity.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: activity.color,
                                    fontSize: '1.2rem'
                                }}>
                                    {activity.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500', color: '#333' }}>
                                        {activity.title}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                        <span style={{ 
                                            backgroundColor: '#f0f0f0', 
                                            padding: '2px 8px', 
                                            borderRadius: '10px',
                                            marginRight: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {activity.type === 'article' ? 'บทความ' : 'ผลงาน'}
                                        </span>
                                        {activity.date}
                                    </div>
                                </div>
                                <button style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.9rem'
                                }}>
                                    <FaEdit size={12} />
                                    ดูรายละเอียด
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
                <h3 style={{ marginBottom: '1.5rem' }}>การดำเนินการด่วน</h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem'
                }}>
                    <button 
                        onClick={() => window.location.hash = 'articles'}
                        style={{ 
                            padding: '1rem',
                            backgroundColor: '#E8F5E9',
                            border: '2px dashed #4CAF50',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <FaNewspaper size={24} color="#4CAF50" />
                        <span>เพิ่มบทความใหม่</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.hash = 'services'}
                        style={{ 
                            padding: '1rem',
                            backgroundColor: '#E3F2FD',
                            border: '2px dashed #2196F3',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <FaTasks size={24} color="#2196F3" />
                        <span>เพิ่มบริการใหม่</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.hash = 'portfolio'}
                        style={{ 
                            padding: '1rem',
                            backgroundColor: '#FFF3E0',
                            border: '2px dashed #FF9800',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <FaTasks size={24} color="#FF9800" />
                        <span>เพิ่มผลงานใหม่</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.hash = 'team'}
                        style={{ 
                            padding: '1rem',
                            backgroundColor: '#F3E5F5',
                            border: '2px dashed #9C27B0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <FaUsers size={24} color="#9C27B0" />
                        <span>เพิ่มสมาชิกทีม</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;