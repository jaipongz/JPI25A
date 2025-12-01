import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        JaipongZ Industries
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/">หน้าแรก</Link></li>
                        <li><Link to="#services">บริการ</Link></li>
                        <li><Link to="#portfolio">ผลงาน</Link></li>
                        <li><Link to="#team">ทีมงาน</Link></li>
                        <li><Link to="#articles">บทความ</Link></li>
                        <li><Link to="/login" style={{ color: '#FFA500' }}>เข้าสู่ระบบ</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;