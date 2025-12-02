import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        icon: 'code',
        title: '',
        description: ''
    });

    const iconOptions = [
        { value: 'code', label: 'Code', icon: '💻' },
        { value: 'mobile', label: 'Mobile', icon: '📱' },
        { value: 'database', label: 'Database', icon: '🗄️' },
        { value: 'cloud', label: 'Cloud', icon: '☁️' },
        { value: 'security', label: 'Security', icon: '🔒' },
        { value: 'rocket', label: 'Rocket', icon: '🚀' },
        { value: 'design', label: 'Design', icon: '🎨' },
        { value: 'support', label: 'Support', icon: '🛠️' }
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/services`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error.message);
            setServices([]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingId ? 
                `${API_URL}/services/${editingId}` : 
                `${API_URL}/services`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            resetForm();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            setError(error.message);
        }
    };

    const handleEdit = (service) => {
        setFormData({
            icon: service.icon || 'code',
            title: service.title || '',
            description: service.description || ''
        });
        setEditingId(service.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบบริการนี้ใช่หรือไม่?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            setError(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            icon: 'code',
            title: '',
            description: ''
        });
        setEditingId(null);
        setError(null);
    };

    if (loading) {
        return (
            <div className="admin-card">
                <h2>จัดการบริการ</h2>
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
                <h2>จัดการบริการ</h2>
                <span className="badge" style={{ 
                    backgroundColor: '#FFA500', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {services.length} บริการ
                </span>
            </div>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>ไอคอน</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                        {iconOptions.map((option) => (
                            <label key={option.value} style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '10px',
                                border: formData.icon === option.value ? '2px solid #FFA500' : '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: formData.icon === option.value ? '#FFF3E0' : 'white'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                                <input
                                    type="radio"
                                    name="icon"
                                    value={option.value}
                                    checked={formData.icon === option.value}
                                    onChange={handleInputChange}
                                    style={{ display: 'none' }}
                                />
                                <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>ชื่อบริการ *</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="เช่น Web Development"
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
                        placeholder="อธิบายรายละเอียดของบริการ"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary">
                        <FaPlus style={{ marginRight: '8px' }} />
                        {editingId ? 'อัพเดทบริการ' : 'เพิ่มบริการ'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            ยกเลิก
                        </button>
                    )}
                </div>
            </form>

            <h3>รายการบริการทั้งหมด</h3>
            {services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <p>ยังไม่มีข้อมูลบริการ</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ไอคอน</th>
                                <th>ชื่อบริการ</th>
                                <th>คำอธิบาย</th>
                                <th style={{ width: '150px' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => {
                                const iconOption = iconOptions.find(opt => opt.value === service.icon) || iconOptions[0];
                                return (
                                    <tr key={service.id}>
                                        <td style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                                            {iconOption.icon}
                                        </td>
                                        <td>
                                            <strong>{service.title}</strong>
                                        </td>
                                        <td>
                                            {service.description}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleEdit(service)}
                                                    className="btn-icon btn-edit"
                                                    title="แก้ไข"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)}
                                                    className="btn-icon btn-delete"
                                                    title="ลบ"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ServiceManager;