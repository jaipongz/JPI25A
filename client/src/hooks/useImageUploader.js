import { useCallback, useState } from 'react';

/**
 * Hook สำหรับสร้าง ImageUploader ที่กำหนดค่าได้
 * @param {Object} options - ตัวเลือกการตั้งค่า
 * @param {number} options.width - ความกว้างที่ต้องการ (px)
 * @param {number} options.height - ความสูงที่ต้องการ (px)
 * @param {number} options.aspectRatio - อัตราส่วนกว้าง:สูง
 * @param {string} options.recommendedSize - ขนาดที่แนะนำ (เช่น "300x300px")
 * @param {string} options.buttonText - ข้อความบนปุ่มอัพโหลด
 * @returns {Object} - ข้อมูลและฟังก์ชันของ ImageUploader
 */
const useImageUploader = (options = {}) => {
    const {
        width = 300,
        height = 300,
        aspectRatio = null,
        recommendedSize = null,
        buttonText = "อัพโหลดรูปภาพ"
    } = options;

    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // คำนวณ aspect ratio จาก width และ height
    const calculatedAspect = aspectRatio || (width / height);

    // สร้างคำแนะนำขนาด
    const sizeRecommendation = recommendedSize || `${width}x${height}px`;

    const handleImageUpload = useCallback((file, previewUrl) => {
        if (file) {
            setIsUploading(true);
            
            // ใน production ควรอัพโหลดไปยังเซิร์ฟเวอร์ที่นี่
            // สำหรับตอนนี้ให้ใช้ URL preview
            
            setUploadedImage(file);
            setImagePreview(previewUrl);
            
            // Simulate upload delay
            setTimeout(() => setIsUploading(false), 1000);
        } else if (previewUrl) {
            // ใช้รูปเดิม
            setImagePreview(previewUrl);
            setUploadedImage(null);
        } else {
            // ลบรูป
            setUploadedImage(null);
            setImagePreview(null);
        }
    }, []);

    const resetUploader = useCallback(() => {
        setUploadedImage(null);
        setImagePreview(null);
        setIsUploading(false);
    }, []);

    const getImageUploader = (additionalProps = {}) => ({
        component: ImageUploader,
        props: {
            onImageUpload: handleImageUpload,
            initialImage: imagePreview,
            aspectRatio: calculatedAspect,
            minWidth: Math.min(width, 100),
            minHeight: Math.min(height, 100),
            maxWidth: Math.max(width, 1920),
            maxHeight: Math.max(height, 1080),
            recommendedSize: sizeRecommendation,
            buttonText: buttonText,
            disabled: isUploading,
            ...additionalProps
        }
    });

    return {
        uploadedImage,
        imagePreview,
        isUploading,
        handleImageUpload,
        resetUploader,
        getImageUploader,
        config: {
            width,
            height,
            aspectRatio: calculatedAspect,
            recommendedSize: sizeRecommendation
        }
    };
};

export default useImageUploader;