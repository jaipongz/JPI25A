import React, { useState, useEffect } from 'react';
import { API_URL,BASE_API_URL } from '../../config';
import { FaEdit, FaTrash, FaPlus, FaEye, FaImage } from 'react-icons/fa';

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        thumbnail: null,
        thumbnailPreview: null
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/articles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError(error.message);
            setArticles([]);
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
            formDataToSend.append('content', formData.content);
            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }

            const url = editingId ? 
                `${API_URL}/articles/${editingId}` : 
                `${API_URL}/articles`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            resetForm();
            fetchArticles();
            setError(null);
        } catch (error) {
            console.error('Error saving article:', error);
            setError(error.message);
        }
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title || '',
            description: article.description || '',
            content: article.content || '',
            thumbnail: null,
            thumbnailPreview: article.thumbnail || null
        });
        setEditingId(article.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
            setError(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            thumbnail: null,
            thumbnailPreview: null
        });
        setEditingId(null);
        setError(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-card">
                <h2>จัดการบทความ</h2>
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
                <h2>จัดการบทความ</h2>
                <span className="badge" style={{ 
                    backgroundColor: '#FFA500', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {articles.length} บทความ
                </span>
            </div>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>รูปภาพบทความ (Thumbnail)</label>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                รองรับไฟล์ JPG, PNG, GIF ขนาดแนะนำ 1200x630px
                            </p>
                        </div>
                        {formData.thumbnailPreview && (
                            <div style={{ 
                                width: '150px', 
                                height: '100px', 
                                border: '1px solid #ddd', 
                                borderRadius: '5px', 
                                overflow: 'hidden',
                                backgroundColor: '#f9f9f9'
                            }}>
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
                    <label>หัวข้อบทความ *</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="เช่น เทรนด์การพัฒนาเว็บปี 2024"
                    />
                </div>

                <div className="form-group">
                    <label>คำอธิบายสั้น ๆ *</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                        placeholder="อธิบายสั้น ๆ เกี่ยวกับบทความ"
                        maxLength="200"
                    />
                    <div style={{ 
                        fontSize: '0.8rem', 
                        color: formData.description.length >= 200 ? '#f44336' : '#666',
                        textAlign: 'right',
                        marginTop: '5px'
                    }}>
                        {formData.description.length}/200 ตัวอักษร
                    </div>
                </div>

                <div className="form-group">
                    <label>เนื้อหาบทความ</label>
                    <textarea
                        name="content"
                        className="form-control"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows="8"
                        placeholder="เนื้อหาบทความเต็ม..."
                    />
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                        สามารถใช้ HTML สำหรับจัดรูปแบบเนื้อหาได้
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button type="submit" className="btn-primary">
                        <FaPlus style={{ marginRight: '8px' }} />
                        {editingId ? 'อัพเดทบทความ' : 'สร้างบทความ'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            ยกเลิกการแก้ไข
                        </button>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ 
                            backgroundColor: '#f0f0f0', 
                            padding: '8px 12px', 
                            borderRadius: '5px',
                            fontSize: '0.9rem',
                            color: '#666'
                        }}>
                            <FaEye style={{ marginRight: '5px' }} />
                            Preview
                        </span>
                        <span style={{ 
                            backgroundColor: '#e8f5e9', 
                            padding: '8px 12px', 
                            borderRadius: '5px',
                            fontSize: '0.9rem',
                            color: '#2e7d32'
                        }}>
                            Draft Saved
                        </span>
                    </div>
                </div>
            </form>

            <h3>บทความทั้งหมด ({articles.length})</h3>
            {articles.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    backgroundColor: '#f9f9f9',
                    borderRadius: '10px',
                    marginTop: '1rem'
                }}>
                    <div style={{ 
                        fontSize: '3rem', 
                        color: '#ddd', 
                        marginBottom: '1rem' 
                    }}>
                        📝
                    </div>
                    <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>ยังไม่มีบทความ</h4>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        เริ่มต้นสร้างบทความแรกของคุณเพื่อแสดงบนเว็บไซต์
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>รูปภาพ</th>
                                <th>หัวข้อ</th>
                                <th style={{ width: '250px' }}>คำอธิบาย</th>
                                <th style={{ width: '120px' }}>วันที่สร้าง</th>
                                <th style={{ width: '150px' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        {article.thumbnail ? (
                                            <div style={{ 
                                                width: '80px', 
                                                height: '60px', 
                                                borderRadius: '5px', 
                                                overflow: 'hidden',
                                                backgroundColor: '#f0f0f0'
                                            }}>
                                                <img 
                                                    src={article.thumbnail.startsWith('http') ? article.thumbnail : `${BASE_API_URL}${article.thumbnail}`}
                                                    alt={article.title}
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
                                                <FaImage />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div>
                                            <strong style={{ 
                                                display: 'block', 
                                                marginBottom: '5px',
                                                fontSize: '1rem'
                                            }}>
                                                {article.title}
                                            </strong>
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '5px', 
                                                flexWrap: 'wrap' 
                                            }}>
                                                <span style={{ 
                                                    backgroundColor: '#e3f2fd', 
                                                    color: '#1976d2',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Published
                                                </span>
                                                <span style={{ 
                                                    backgroundColor: '#f3e5f5', 
                                                    color: '#7b1fa2',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Tech
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ 
                                            maxHeight: '60px', 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {article.description || 'ไม่มีคำอธิบาย'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {formatDate(article.created_at)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleEdit(article)}
                                                className="btn-icon btn-edit"
                                                title="แก้ไข"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(article.id)}
                                                className="btn-icon btn-delete"
                                                title="ลบ"
                                            >
                                                <FaTrash />
                                            </button>
                                            <a
                                                href={`#article-${article.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-icon"
                                                style={{
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#2e7d32'
                                                }}
                                                title="ดูตัวอย่าง"
                                            >
                                                <FaEye />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {articles.length > 0 && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '2rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        แสดง {articles.length} จาก {articles.length} บทความ
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                            className="btn-secondary"
                            style={{ 
                                padding: '8px 12px',
                                fontSize: '0.9rem'
                            }}
                            disabled
                        >
                            ← ก่อนหน้า
                        </button>
                        <button 
                            className="btn-primary"
                            style={{ 
                                padding: '8px 12px',
                                fontSize: '0.9rem'
                            }}
                        >
                            1
                        </button>
                        <button 
                            className="btn-secondary"
                            style={{ 
                                padding: '8px 12px',
                                fontSize: '0.9rem'
                            }}
                            disabled
                        >
                            ถัดไป →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleManager;