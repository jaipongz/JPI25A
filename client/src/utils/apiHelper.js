/**
 * ฟังก์ชันช่วยเหลือสำหรับการจัดการ response จาก API
 */

export const handleApiResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // ถ้ามี error ใน response
    if (data && data.error) {
        throw new Error(data.error);
    }
    
    return data;
};

/**
 * แปลงข้อมูลให้เป็น array เสมอ
 */
export const ensureArray = (data) => {
    if (Array.isArray(data)) {
        return data;
    }
    
    if (data && typeof data === 'object') {
        // ลองหาค่าแรกที่เป็น array
        const arrayValue = Object.values(data).find(val => Array.isArray(val));
        if (arrayValue) {
            return arrayValue;
        }
        
        // แปลง object เป็น array
        return Object.values(data);
    }
    
    return [];
};

/**
 * ดึงข้อมูลจาก API พร้อมจัดการ error
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const data = await handleApiResponse(response);
        return { success: true, data };
    } catch (error) {
        console.error('Fetch error:', error);
        return { success: false, error: error.message };
    }
};