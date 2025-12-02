import React, { useState, useEffect } from 'react';
import { API_URL,BASE_API_URL } from '../../config';
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

const PortfolioManager = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        thumbnail: null,
        thumbnailPreview: null
    });

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/portfolio`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPortfolios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            setError(error.message);
            setPortfolios([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('link', formData.link);
            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }

            const url = editingId ? 
                `${API_URL}/portfolio/${editingId}` : 
                `${API_URL}/portfolio`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            resetForm();
            fetchPortfolios();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            setError(error.message);
        }
    };

    const handleEdit = (portfolio) => {
        setFormData({
            title: portfolio.title || '',
            description: portfolio.description || '',
            link: portfolio.link || '',
            thumbnail: null,
            thumbnailPreview: portfolio.thumbnail || null
        });
        setEditingId(portfolio.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบผลงานนี้ใช่หรือไม่?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/portfolio/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchPortfolios();
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            setError(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            link: '',
            thumbnail: null,
            thumbnailPreview: null
        });
        setEditingId(null);
        setError(null);
    };

    if (loading) {
        return (
            <div className="admin-card">
                <h2>จัดการผลงาน</h2>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="spinner"></div>
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>จัดการผลงาน</h2>
                <span className="badge" style={{ 
                    backgroundColor: '#FFA500', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {portfolios.length} ผลงาน
                </span>
            </div>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>รูปภาพผลงาน</label>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
                            </p>
                        </div>
                        {formData.thumbnailPreview && (
                            <div style={{ width: '150px', height: '100px', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                                <img 
                                    src={formData.thumbnailPreview} 
                                    alt="Preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>ชื่อผลงาน *</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="เช่น ระบบ E-commerce"
                    />
                </div>

                <div className="form-group">
                    <label>คำอธิบาย *</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                        placeholder="อธิบายรายละเอียดผลงาน"
                    />
                </div>

                <div className="form-group">
                    <label>ลิงก์ผลงาน</label>
                    <input
                        type="url"
                        name="link"
                        className="form-control"
                        value={formData.link}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary">
                        <FaPlus style={{ marginRight: '8px' }} />
                        {editingId ? 'อัพเดทผลงาน' : 'เพิ่มผลงาน'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            ยกเลิก
                        </button>
                    )}
                </div>
            </form>

            <h3>รายการผลงานทั้งหมด</h3>
            {portfolios.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <p>ยังไม่มีข้อมูลผลงาน</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>รูปภาพ</th>
                                <th>ชื่อผลงาน</th>
                                <th>คำอธิบาย</th>
                                <th style={{ width: '150px' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolios.map((portfolio) => (
                                <tr key={portfolio.id}>
                                    <td>
                                        {portfolio.thumbnail ? (
                                            <div style={{ width: '80px', height: '60px', borderRadius: '5px', overflow: 'hidden' }}>
                                                <img 
                                                    src={portfolio.thumbnail.startsWith('http') ? portfolio.thumbnail : `${BASE_API_URL}${portfolio.thumbnail}`}
                                                    alt={portfolio.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                width: '80px', 
                                                height: '60px', 
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '5px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#999'
                                            }}>
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{portfolio.title}</strong>
                                        {portfolio.link && (
                                            <div style={{ marginTop: '5px' }}>
                                                <a 
                                                    href={portfolio.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        fontSize: '0.8rem', 
                                                        color: '#FFA500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <FaExternalLinkAlt size={12} />
                                                    ดูผลงาน
                                                </a>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {portfolio.description}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleEdit(portfolio)}
                                                className="btn-icon btn-edit"
                                                title="แก้ไข"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(portfolio.id)}
                                                className="btn-icon btn-delete"
                                                title="ลบ"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PortfolioManager;