import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCrop, FaRedo, FaTimes, FaCheck, FaImage, FaExpandArrowsAlt, FaCompressArrowsAlt, FaArrowsAlt, FaExpandAlt } from 'react-icons/fa';

const ImageUploader = ({
    onImageUpload,
    initialImage = null,
    aspectRatio = 16/9,
    buttonText = "อัพโหลดรูปภาพ",
    className = "",
    disabled = false
}) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Refs
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    
    // State สำหรับการควบคุม crop
    const [cropState, setCropState] = useState({
        x: 100,
        y: 100,
        width: 300,
        height: 300 / aspectRatio,
        isDragging: false,
        isResizing: false,
        resizeHandle: null,
        startX: 0,
        startY: 0,
        startCropX: 0,
        startCropY: 0,
        startCropWidth: 0,
        startCropHeight: 0
    });
    
    // State สำหรับภาพ
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageScale, setImageScale] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    // Initialize with initial image
    useEffect(() => {
        if (initialImage) {
            setImagePreview(initialImage);
        }
    }, [initialImage]);

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB');
            return;
        }

        setError(null);
        setSelectedFile(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target.result);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
    };

    // เมื่อภาพโหลดเสร็จ
    const handleImageLoad = (e) => {
        const img = e.target;
        const container = containerRef.current;
        
        if (!container) return;
        
        // บันทึกขนาดภาพจริง
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
        
        // คำนวณ scale เพื่อให้ภาพพอดีกับ container
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        
        const scaleX = containerWidth / img.naturalWidth;
        const scaleY = containerHeight / img.naturalHeight;
        const scale = Math.min(scaleX, scaleY, 1);
        
        setImageScale(scale);
        
        // คำนวณตำแหน่งเพื่อให้ภาพอยู่กึ่งกลาง
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        
        setImagePosition({
            x: (containerWidth - scaledWidth) / 2,
            y: (containerHeight - scaledHeight) / 2
        });
        
        // กำหนดค่าเริ่มต้นของ crop area (80% ของภาพ)
        const cropWidth = Math.min(scaledWidth * 0.8, 400);
        const cropHeight = cropWidth / aspectRatio;
        
        const cropX = (containerWidth - cropWidth) / 2;
        const cropY = (containerHeight - cropHeight) / 2;
        
        setCropState(prev => ({
            ...prev,
            x: cropX,
            y: cropY,
            width: cropWidth,
            height: cropHeight
        }));
    };

    // เริ่มลาก crop area
    const handleCropMouseDown = (e, action, handle = null) => {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        
        setCropState(prev => ({
            ...prev,
            isDragging: action === 'drag',
            isResizing: action === 'resize',
            resizeHandle: handle,
            startX,
            startY,
            startCropX: prev.x,
            startCropY: prev.y,
            startCropWidth: prev.width,
            startCropHeight: prev.height
        }));
        
        // เพิ่ม event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // การเคลื่อนไหวของเมาส์
    const handleMouseMove = (e) => {
        if (!cropState.isDragging && !cropState.isResizing) return;
        
        const deltaX = e.clientX - cropState.startX;
        const deltaY = e.clientY - cropState.startY;
        const container = containerRef.current;
        
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const minSize = 50;
        
        if (cropState.isDragging) {
            // ลากทั้งกล่อง
            const newX = cropState.startCropX + deltaX;
            const newY = cropState.startCropY + deltaY;
            
            // ตรวจสอบขอบเขต
            const maxX = container.clientWidth - cropState.width;
            const maxY = container.clientHeight - cropState.height;
            
            setCropState(prev => ({
                ...prev,
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            }));
            
        } else if (cropState.isResizing) {
            // ปรับขนาดจาก handle ต่างๆ
            let newX = cropState.startCropX;
            let newY = cropState.startCropY;
            let newWidth = cropState.startCropWidth;
            let newHeight = cropState.startCropHeight;
            
            switch (cropState.resizeHandle) {
                case 'nw': // มุมบนซ้าย
                    newWidth = Math.max(minSize, cropState.startCropWidth - deltaX);
                    newHeight = newWidth / aspectRatio;
                    newX = cropState.startCropX + (cropState.startCropWidth - newWidth);
                    newY = cropState.startCropY + (cropState.startCropHeight - newHeight);
                    break;
                    
                case 'ne': // มุมบนขวา
                    newWidth = Math.max(minSize, cropState.startCropWidth + deltaX);
                    newHeight = newWidth / aspectRatio;
                    newY = cropState.startCropY + (cropState.startCropHeight - newHeight);
                    break;
                    
                case 'sw': // มุมล่างซ้าย
                    newWidth = Math.max(minSize, cropState.startCropWidth - deltaX);
                    newHeight = newWidth / aspectRatio;
                    newX = cropState.startCropX + (cropState.startCropWidth - newWidth);
                    break;
                    
                case 'se': // มุมล่างขวา
                    newWidth = Math.max(minSize, cropState.startCropWidth + deltaX);
                    newHeight = newWidth / aspectRatio;
                    break;
                    
                case 'n': // ขอบบน
                    newHeight = Math.max(minSize, cropState.startCropHeight - deltaY);
                    newWidth = newHeight * aspectRatio;
                    newY = cropState.startCropY + (cropState.startCropHeight - newHeight);
                    newX = cropState.startCropX + (cropState.startCropWidth - newWidth) / 2;
                    break;
                    
                case 's': // ขอบล่าง
                    newHeight = Math.max(minSize, cropState.startCropHeight + deltaY);
                    newWidth = newHeight * aspectRatio;
                    newX = cropState.startCropX + (cropState.startCropWidth - newWidth) / 2;
                    break;
                    
                case 'w': // ขอบซ้าย
                    newWidth = Math.max(minSize, cropState.startCropWidth - deltaX);
                    newHeight = newWidth / aspectRatio;
                    newX = cropState.startCropX + (cropState.startCropWidth - newWidth);
                    newY = cropState.startCropY + (cropState.startCropHeight - newHeight) / 2;
                    break;
                    
                case 'e': // ขอบขวา
                    newWidth = Math.max(minSize, cropState.startCropWidth + deltaX);
                    newHeight = newWidth / aspectRatio;
                    newY = cropState.startCropY + (cropState.startCropHeight - newHeight) / 2;
                    break;
            }
            
            // ตรวจสอบขอบเขต
            const maxX = container.clientWidth - newX;
            const maxY = container.clientHeight - newY;
            
            newWidth = Math.min(newWidth, maxX);
            newHeight = newWidth / aspectRatio;
            
            setCropState(prev => ({
                ...prev,
                x: Math.max(0, newX),
                y: Math.max(0, newY),
                width: newWidth,
                height: newHeight
            }));
        }
        
        // อัพเดท preview
        updatePreview();
    };

    // หยุดการลาก/ปรับขนาด
    const handleMouseUp = () => {
        setCropState(prev => ({
            ...prev,
            isDragging: false,
            isResizing: false,
            resizeHandle: null
        }));
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // อัพเดท preview
    const updatePreview = () => {
        if (!imageRef.current || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;
        
        // คำนวณตำแหน่งและขนาดบนภาพจริง
        const actualX = (cropState.x - imagePosition.x) / imageScale;
        const actualY = (cropState.y - imagePosition.y) / imageScale;
        const actualWidth = cropState.width / imageScale;
        const actualHeight = cropState.height / imageScale;
        
        // กำหนดขนาด output
        const outputWidth = 400;
        const outputHeight = outputWidth / aspectRatio;
        
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        // ล้าง canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // วาดภาพที่ตัดแล้ว
        ctx.drawImage(
            img,
            Math.max(0, actualX), Math.max(0, actualY), 
            Math.min(actualWidth, img.naturalWidth - actualX), 
            Math.min(actualHeight, img.naturalHeight - actualY),
            0, 0, outputWidth, outputHeight
        );
    };

    // ตัดภาพ
    const applyCrop = () => {
        if (!imageRef.current || !canvasRef.current) return;
        
        setLoading(true);
        
        const canvas = canvasRef.current;
        const img = imageRef.current;
        
        // สร้าง canvas ชั่วคราวสำหรับ crop
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // คำนวณตำแหน่งและขนาดบนภาพจริง
        const actualX = (cropState.x - imagePosition.x) / imageScale;
        const actualY = (cropState.y - imagePosition.y) / imageScale;
        const actualWidth = cropState.width / imageScale;
        const actualHeight = cropState.height / imageScale;
        
        // กำหนดขนาด output (ใหญ่กว่า preview)
        const outputWidth = 1200;
        const outputHeight = outputWidth / aspectRatio;
        
        tempCanvas.width = outputWidth;
        tempCanvas.height = outputHeight;
        
        // วาดภาพที่ตัดแล้วในขนาดใหญ่
        tempCtx.drawImage(
            img,
            Math.max(0, actualX), Math.max(0, actualY), 
            Math.min(actualWidth, img.naturalWidth - actualX), 
            Math.min(actualHeight, img.naturalHeight - actualY),
            0, 0, outputWidth, outputHeight
        );
        
        // แปลงเป็น blob
        tempCanvas.toBlob((blob) => {
            if (blob) {
                const croppedImageUrl = URL.createObjectURL(blob);
                setImagePreview(croppedImageUrl);
                setIsCropping(false);
                
                // ส่งไปยัง parent component
                if (onImageUpload) {
                    const croppedFile = new File([blob], 'cropped-image.jpg', { 
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    onImageUpload(croppedFile, croppedImageUrl);
                }
            }
            setLoading(false);
        }, 'image/jpeg', 0.9);
    };

    // ยกเลิกการ crop
    const cancelCrop = () => {
        setIsCropping(false);
        setImageSrc(null);
        setError(null);
    };

    // ลบภาพ
    const removeImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        setImageSrc(null);
        setIsCropping(false);
        
        if (onImageUpload) {
            onImageUpload(null, null);
        }
    };

    // เปิด file input
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // รีเซ็ต
    const resetUploader = () => {
        setImageSrc(null);
        setImagePreview(initialImage);
        setIsCropping(false);
        setSelectedFile(null);
        setError(null);
        
        if (onImageUpload && initialImage) {
            onImageUpload(null, initialImage);
        } else if (onImageUpload) {
            onImageUpload(null, null);
        }
    };

    // Zoom controls
    const handleZoom = (factor) => {
        const newScale = Math.max(0.1, Math.min(3, imageScale * factor));
        setImageScale(newScale);
        
        // อัพเดท preview หลังจากเปลี่ยน scale
        setTimeout(updatePreview, 100);
    };

    return (
        <div className={`image-uploader ${className}`}>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={disabled || loading}
            />

            {/* Error message */}
            {error && (
                <div style={{
                    backgroundColor: '#FFEBEE',
                    color: '#C62828',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            {/* Image preview or upload button */}
            <div className="image-preview-container">
                {isCropping ? (
                    // Cropping Interface
                    <div style={{ 
                        backgroundColor: '#f5f5f5',
                        padding: '1rem',
                        borderRadius: '8px',
                        position: 'relative'
                    }}>
                        <h4 style={{ 
                            marginBottom: '1rem', 
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <FaCrop />
                            ตัดรูปภาพ ({aspectRatio.toFixed(2)}:1)
                            <span style={{
                                fontSize: '0.8rem',
                                color: '#666',
                                marginLeft: '10px'
                            }}>
                                ลากกรอบสีเหลืองเพื่อปรับตำแหน่ง • ดึงมุมเพื่อปรับขนาด
                            </span>
                        </h4>
                        
                        {/* Zoom Controls */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 10,
                            display: 'flex',
                            gap: '5px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            padding: '8px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <button
                                onClick={() => handleZoom(1.2)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                                title="ซูมเข้า"
                            >
                                <FaExpandAlt />
                            </button>
                            <button
                                onClick={() => handleZoom(0.8)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                                title="ซูมออก"
                            >
                                <FaCompressArrowsAlt />
                            </button>
                            <div style={{
                                padding: '8px 12px',
                                fontSize: '0.9rem',
                                color: '#666',
                                minWidth: '60px',
                                textAlign: 'center'
                            }}>
                                {Math.round(imageScale * 100)}%
                            </div>
                        </div>
                        
                        {/* Image container with crop overlay */}
                        <div 
                            ref={containerRef}
                            style={{ 
                                position: 'relative',
                                width: '100%',
                                height: '400px',
                                overflow: 'hidden',
                                marginBottom: '1rem',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '5px',
                                cursor: 'default'
                            }}
                        >
                            {imageSrc && (
                                <div style={{
                                    position: 'absolute',
                                    left: `${imagePosition.x}px`,
                                    top: `${imagePosition.y}px`,
                                    transform: `scale(${imageScale})`,
                                    transformOrigin: 'top left'
                                }}>
                                    <img
                                        ref={imageRef}
                                        src={imageSrc}
                                        alt="Original"
                                        onLoad={handleImageLoad}
                                        style={{
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Crop Area */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${cropState.x}px`,
                                    top: `${cropState.y}px`,
                                    width: `${cropState.width}px`,
                                    height: `${cropState.height}px`,
                                    border: '3px solid #FFA500',
                                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                    cursor: cropState.isDragging ? 'grabbing' : 'move',
                                    boxSizing: 'border-box'
                                }}
                                onMouseDown={(e) => handleCropMouseDown(e, 'drag')}
                            >
                                {/* Resize handles - Corners */}
                                {['nw', 'ne', 'sw', 'se'].map((corner) => (
                                    <div
                                        key={corner}
                                        style={{
                                            position: 'absolute',
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: '#FFA500',
                                            border: '2px solid white',
                                            borderRadius: '2px',
                                            cursor: `${corner}-resize`,
                                            ...(corner === 'nw' && { top: '-6px', left: '-6px' }),
                                            ...(corner === 'ne' && { top: '-6px', right: '-6px' }),
                                            ...(corner === 'sw' && { bottom: '-6px', left: '-6px' }),
                                            ...(corner === 'se' && { bottom: '-6px', right: '-6px' })
                                        }}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleCropMouseDown(e, 'resize', corner);
                                        }}
                                    />
                                ))}
                                
                                {/* Resize handles - Edges */}
                                {['n', 's', 'w', 'e'].map((edge) => (
                                    <div
                                        key={edge}
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: '#FFA500',
                                            border: '1px solid white',
                                            ...(edge === 'n' && { 
                                                top: '-3px', 
                                                left: '20px', 
                                                right: '20px', 
                                                height: '6px',
                                                cursor: 'ns-resize'
                                            }),
                                            ...(edge === 's' && { 
                                                bottom: '-3px', 
                                                left: '20px', 
                                                right: '20px', 
                                                height: '6px',
                                                cursor: 'ns-resize'
                                            }),
                                            ...(edge === 'w' && { 
                                                left: '-3px', 
                                                top: '20px', 
                                                bottom: '20px', 
                                                width: '6px',
                                                cursor: 'ew-resize'
                                            }),
                                            ...(edge === 'e' && { 
                                                right: '-3px', 
                                                top: '20px', 
                                                bottom: '20px', 
                                                width: '6px',
                                                cursor: 'ew-resize'
                                            })
                                        }}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleCropMouseDown(e, 'resize', edge);
                                        }}
                                    />
                                ))}
                                
                                {/* Center move handle */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        border: '2px solid #FFA500',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'move'
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleCropMouseDown(e, 'drag');
                                    }}
                                    title="ลากเพื่อย้ายตำแหน่ง"
                                >
                                    <FaArrowsAlt style={{ color: '#FFA500', fontSize: '14px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Crop preview */}
                        <div style={{ 
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>
                            <h5 style={{ marginBottom: '10px', color: '#555' }}>
                                ตัวอย่างที่ตัดแล้ว 
                                <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.9rem' }}>
                                    ({Math.round(cropState.width)}x{Math.round(cropState.height)}px)
                                </span>
                            </h5>
                            <div style={{
                                display: 'inline-block',
                                border: '2px solid #FFA500',
                                backgroundColor: '#f9f9f9',
                                padding: '5px',
                                borderRadius: '5px'
                            }}>
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        display: 'block',
                                        width: '200px',
                                        height: `${200 / aspectRatio}px`,
                                        backgroundColor: '#f0f0f0'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Crop controls */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '1rem',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <button
                                type="button"
                                onClick={applyCrop}
                                className="btn-primary"
                                disabled={loading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    fontSize: '1rem'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid white',
                                            borderTop: '2px solid transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        กำลังตัดรูป...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck />
                                        ตัดรูปภาพ
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={cancelCrop}
                                className="btn-secondary"
                                disabled={loading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    fontSize: '1rem'
                                }}
                            >
                                <FaTimes />
                                ยกเลิก
                            </button>
                        </div>
                        
                        {/* Instructions */}
                        <div style={{
                            marginTop: '1rem',
                            fontSize: '0.85rem',
                            color: '#666',
                            textAlign: 'center',
                            padding: '10px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '5px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '15px', height: '15px', backgroundColor: '#FFA500', borderRadius: '2px' }}></div>
                                    <span>ลากกรอบสีเหลืองเพื่อย้ายตำแหน่ง</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '12px', height: '12px', backgroundColor: '#FFA500', borderRadius: '2px' }}></div>
                                    <span>ดึงมุมหรือขอบเพื่อปรับขนาด</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaExpandAlt size={12} color="#666" />
                                    <span>ใช้ปุ่มซูมเพื่อขยาย/ย่อภาพ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : imagePreview ? (
                    // Image preview with controls
                    <div className="preview-with-controls">
                        <div style={{ 
                            marginBottom: '1rem',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '8px'
                        }}>
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={{ 
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '5px',
                                    border: '2px solid #FFA500',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="btn-secondary"
                                disabled={disabled}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 15px'
                                }}
                            >
                                <FaUpload />
                                เปลี่ยนรูป
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (imagePreview) {
                                        setImageSrc(imagePreview);
                                        setIsCropping(true);
                                    } else {
                                        triggerFileInput();
                                    }
                                }}
                                className="btn-secondary"
                                disabled={disabled}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 15px'
                                }}
                            >
                                <FaCrop />
                                ตัดรูปใหม่
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="btn-danger"
                                disabled={disabled}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 15px'
                                }}
                            >
                                <FaTimes />
                                ลบรูป
                            </button>
                        </div>
                    </div>
                ) : (
                    // Upload area
                    <div 
                        className="upload-area"
                        onClick={triggerFileInput}
                        style={{ 
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.6 : 1
                        }}
                    >
                        <div style={{ 
                            textAlign: 'center',
                            padding: '3rem 2rem',
                            border: '2px dashed #FFA500',
                            borderRadius: '10px',
                            backgroundColor: '#FFF9F0',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ 
                                fontSize: '48px',
                                color: '#FFA500',
                                marginBottom: '1rem'
                            }}>
                                <FaImage />
                            </div>
                            <div>
                                <h4 style={{ 
                                    marginBottom: '0.5rem',
                                    color: '#333'
                                }}>
                                    {buttonText}
                                </h4>
                                <p style={{ 
                                    marginBottom: '0.5rem',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}>
                                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden canvas for preview */}
            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUploader;