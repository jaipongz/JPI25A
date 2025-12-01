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
                    href="#contact" 
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