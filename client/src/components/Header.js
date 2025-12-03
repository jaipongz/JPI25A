import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        JaipongZ <span style={{color: '#FFFFF'}}>Industries</span>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/">หน้าแรก</a></li>
                        <li><a href="#services">บริการ</a></li>
                        <li><a href="#portfolio">ผลงาน</a></li>
                        <li><a href="#team">ทีมงาน</a></li>
                        <li><a href="#articles">บทความ</a></li>
                        <li><a href="/login" style={{ color: '#FFA500' }}>เข้าสู่ระบบ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;