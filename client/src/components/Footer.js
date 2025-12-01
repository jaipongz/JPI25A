import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>JaipongZ Industries</h3>
                        <p>ผู้เชี่ยวชาญด้านการพัฒนาเว็บไซต์และบริการ API แบบครบวงจร</p>
                    </div>
                    <div className="footer-section">
                        <h3>ติดต่อเรา</h3>
                        <p>Email: contact@jaipongz.com</p>
                        <p>โทรศัพท์: 02-123-4567</p>
                    </div>
                    <div className="footer-section">
                        <h3>ลิงก์ด่วน</h3>
                        <ul>
                            <li><a href="#services">บริการ</a></li>
                            <li><a href="#portfolio">ผลงาน</a></li>
                            <li><a href="#team">ทีมงาน</a></li>
                            <li><a href="#articles">บทความ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid #444' }}>
                    <p>© 2024 JaipongZ Industries. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;