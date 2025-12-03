import ImageUploader from '../components/ImageUploader';

/**
 * Factory function สำหรับสร้าง ImageUploader component ที่กำหนดค่าได้
 * @param {Object} config - การกำหนดค่า
 * @param {number} config.width - ความกว้าง
 * @param {number} config.height - ความสูง
 * @param {string} config.type - ประเภท (profile, thumbnail, banner, etc.)
 * @returns {React.Component} - ImageUploader component ที่กำหนดค่าแล้ว
 */
export const createImageUploader = (config = {}) => {
    const {
        width = 300,
        height = 300,
        type = 'default',
        buttonText = "อัพโหลดรูปภาพ",
        className = ""
    } = config;

    // กำหนดค่าเริ่มต้นตามประเภท
    const typeConfigs = {
        profile: {
            width: 400,
            height: 400,
            aspectRatio: 1,
            recommendedSize: '400x400px (สี่เหลี่ยมจัตุรัส)',
            buttonText: 'อัพโหลดรูปโปรไฟล์',
            className: 'image-uploader-profile'
        },
        thumbnail: {
            width: 800,
            height: 450,
            aspectRatio: 16/9,
            recommendedSize: '800x450px (16:9)',
            buttonText: 'อัพโหลดรูปหน้าปก',
            className: 'image-uploader-thumbnail'
        },
        banner: {
            width: 1920,
            height: 400,
            aspectRatio: 4.8,
            recommendedSize: '1920x400px (4.8:1)',
            buttonText: 'อัพโหลดแบนเนอร์',
            className: 'image-uploader-banner'
        },
        square: {
            width: 500,
            height: 500,
            aspectRatio: 1,
            recommendedSize: '500x500px (สี่เหลี่ยมจัตุรัส)',
            buttonText: 'อัพโหลดรูปภาพ',
            className: 'image-uploader-square'
        },
        portrait: {
            width: 400,
            height: 600,
            aspectRatio: 2/3,
            recommendedSize: '400x600px (2:3)',
            buttonText: 'อัพโหลดรูปแนวตั้ง',
            className: 'image-uploader-portrait'
        },
        landscape: {
            width: 800,
            height: 400,
            aspectRatio: 2,
            recommendedSize: '800x400px (2:1)',
            buttonText: 'อัพโหลดรูปแนวนอน',
            className: 'image-uploader-landscape'
        }
    };

    const typeConfig = typeConfigs[type] || {};
    
    const finalConfig = {
        width: config.width || typeConfig.width || width,
        height: config.height || typeConfig.height || height,
        aspectRatio: config.aspectRatio || typeConfig.aspectRatio || (width / height),
        recommendedSize: config.recommendedSize || typeConfig.recommendedSize || `${width}x${height}px`,
        buttonText: config.buttonText || typeConfig.buttonText || buttonText,
        className: `${typeConfig.className || ''} ${className}`.trim()
    };

    // Return a configured ImageUploader component
    const ConfiguredImageUploader = (props) => (
        <ImageUploader
            aspectRatio={finalConfig.aspectRatio}
            minWidth={Math.min(finalConfig.width, 100)}
            minHeight={Math.min(finalConfig.height, 100)}
            maxWidth={Math.max(finalConfig.width, 1920)}
            maxHeight={Math.max(finalConfig.height, 1080)}
            recommendedSize={finalConfig.recommendedSize}
            buttonText={finalConfig.buttonText}
            className={finalConfig.className}
            {...props}
        />
    );

    return ConfiguredImageUploader;
};

/**
 * Shortcut functions สำหรับสร้าง ImageUploader ประเภทต่างๆ
 */
export const imageUploader = {
    profile: (customProps = {}) => createImageUploader({ type: 'profile', ...customProps }),
    thumbnail: (customProps = {}) => createImageUploader({ type: 'thumbnail', ...customProps }),
    banner: (customProps = {}) => createImageUploader({ type: 'banner', ...customProps }),
    square: (customProps = {}) => createImageUploader({ type: 'square', ...customProps }),
    portrait: (customProps = {}) => createImageUploader({ type: 'portrait', ...customProps }),
    landscape: (customProps = {}) => createImageUploader({ type: 'landscape', ...customProps }),
    custom: (width, height, customProps = {}) => 
        createImageUploader({ width, height, type: 'custom', ...customProps })
};