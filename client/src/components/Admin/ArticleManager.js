import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        thumbnail: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/articles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
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
        setFormData(prev => ({
            ...prev,
            thumbnail: e.target.files[0]
        }));
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

            if (editingId) {
                await fetch(`${API_URL}/articles/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataToSend
                });
            } else {
                await fetch(`${API_URL}/articles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataToSend
                });
            }

            resetForm();
            fetchArticles();
        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title,
            description: article.description,
            content: article.content || '',
            thumbnail: null
        });
        setEditingId(article.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${API_URL}/articles/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchArticles();
            } catch (error) {
                console.error('Error deleting article:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            thumbnail: null
        });
        setEditingId(null);
    };

    return (
        <div className="admin-card">
            <h2>จัดการบทความ</h2>
            
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>หัวข้อ</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>คำอธิบาย</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>เนื้อหา</label>
                    <textarea
                        name="content"
                        className="form-control"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows="5"
                    />
                </div>
                
                <div className="form-group">
                    <label>รูปภาพ (Thumbnail)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                
                <button type="submit" className="btn-primary">
                    {editingId ? 'อัพเดทบทความ' : 'สร้างบทความ'}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>
                        ยกเลิก
                    </button>
                )}
            </form>
            
            <h3>บทความทั้งหมด</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>รูปภาพ</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>หัวข้อ</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>คำอธิบาย</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article, index) => (
                            <tr key={article.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>
                                    {article.thumbnail && (
                                        <img 
                                            src={`http://localhost:5000${article.thumbnail}`} 
                                            alt={article.title}
                                            style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                                        />
                                    )}
                                </td>
                                <td style={{ padding: '12px' }}>{article.title}</td>
                                <td style={{ padding: '12px' }}>{article.description}</td>
                                <td style={{ padding: '12px' }}>
                                    <button 
                                        onClick={() => handleEdit(article)}
                                        className="btn-primary"
                                        style={{ marginRight: '8px' }}
                                    >
                                        แก้ไข
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(article.id)}
                                        className="btn-danger"
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleManager;