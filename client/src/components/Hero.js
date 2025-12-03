import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container">
                <h1 className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    สร้างประสบการณ์ดิจิทัลที่โดดเด่น
                </h1>
                <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    JaipongZ Industries ผู้เชี่ยวชาญด้านการพัฒนาเว็บไซต์และบริการ API แบบครบวงจร ด้วยทีมงานมืออาชีพและเทคโนโลยีล่าสุด
                </p>
                <a 
                    href="https://www.facebook.com/people/%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%A7%E0%B8%87%E0%B8%88%E0%B8%A3-Jaipongz-Industry/61576192463551/" 
                    className="btn animate-fade-in-up" 
                    style={{ animationDelay: '0.6s' }}
                >
                    ติดต่อเรา
                </a>
            </div>
        </section>
    );
};

export default Hero;