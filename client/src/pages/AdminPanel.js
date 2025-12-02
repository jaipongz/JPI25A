import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleManager from '../components/Admin/ArticleManager';
import ServiceManager from '../components/Admin/ServiceManager';
import PortfolioManager from '../components/Admin/PortfolioManager';
import TeamManager from '../components/Admin/TeamManager';
import { THEME } from '../config';
import Dashboard from '../components/Admin/Dashboard';
const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('articles');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'articles':
                return <ArticleManager />;
            case 'services':
                return <ServiceManager />;
            case 'portfolio':
                return <PortfolioManager />;
            case 'team':
                return <TeamManager />;
            case 'dashboard':
                return <Dashboard />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar" style={{ backgroundColor: THEME.darkGray }}>
                <div className="sidebar-header" style={{ padding: '2rem', color: THEME.primary }}>
                    <h2>Admin</h2>
                </div>
                <nav>
                    <ul style={{ listStyle: 'none' }}>
                        <li>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 2rem',
                                    background: activeTab === 'dashboard' ? THEME.primary : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                แดชบอร์ด
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('articles')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 2rem',
                                    background: activeTab === 'articles' ? THEME.primary : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                บทความ
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('services')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 2rem',
                                    background: activeTab === 'services' ? THEME.primary : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                บริการ
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('portfolio')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 2rem',
                                    background: activeTab === 'portfolio' ? THEME.primary : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                ผลงาน
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('team')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 2rem',
                                    background: activeTab === 'team' ? THEME.primary : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                ทีมงาน
                            </button>
                        </li>

                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;