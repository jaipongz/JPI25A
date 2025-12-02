import React, { useState, useEffect } from 'react';
import { API_URL,BASE_API_URL } from '../../config';
import { FaEdit, FaTrash, FaPlus, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa';

const TeamManager = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        position: '',
        link_contact: '',
        profile_image: null,
        profilePreview: null
    });

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/team`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTeamMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching team members:', error);
            setError(error.message);
            setTeamMembers([]);
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
                profile_image: file,
                profilePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('firstname', formData.firstname);
            formDataToSend.append('lastname', formData.lastname);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('link_contact', formData.link_contact);
            if (formData.profile_image) {
                formDataToSend.append('profile_image', formData.profile_image);
            }

            const url = editingId ? 
                `${API_URL}/team/${editingId}` : 
                `${API_URL}/team`;
            
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
            fetchTeamMembers();
        } catch (error) {
            console.error('Error saving team member:', error);
            setError(error.message);
        }
    };

    const handleEdit = (member) => {
        setFormData({
            firstname: member.firstname || '',
            lastname: member.lastname || '',
            position: member.position || '',
            link_contact: member.link_contact || '',
            profile_image: null,
            profilePreview: member.profile_image || null
        });
        setEditingId(member.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบสมาชิกทีมนี้ใช่หรือไม่?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/team/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchTeamMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
            setError(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            firstname: '',
            lastname: '',
            position: '',
            link_contact: '',
            profile_image: null,
            profilePreview: null
        });
        setEditingId(null);
        setError(null);
    };

    if (loading) {
        return (
            <div className="admin-card">
                <h2>จัดการทีมงาน</h2>
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
                <h2>จัดการทีมงาน</h2>
                <span className="badge" style={{ 
                    backgroundColor: '#FFA500', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {teamMembers.length} สมาชิก
                </span>
            </div>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>รูปโปรไฟล์</label>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                รูปภาพควรเป็นสัดส่วน 1:1 (สี่เหลี่ยมจตุรัส) สำหรับแสดงผลเป็นวงกลม
                            </p>
                        </div>
                        {formData.profilePreview && (
                            <div style={{ 
                                width: '120px', 
                                height: '120px', 
                                border: '3px solid #FFA500', 
                                borderRadius: '50%', 
                                overflow: 'hidden',
                                background: '#f0f0f0'
                            }}>
                                <img 
                                    src={formData.profilePreview} 
                                    alt="Preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>ชื่อ *</label>
                        <input
                            type="text"
                            name="firstname"
                            className="form-control"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            required
                            placeholder="เช่น John"
                        />
                    </div>

                    <div className="form-group">
                        <label>นามสกุล *</label>
                        <input
                            type="text"
                            name="lastname"
                            className="form-control"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                            placeholder="เช่น Doe"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>ตำแหน่ง *</label>
                    <input
                        type="text"
                        name="position"
                        className="form-control"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        placeholder="เช่น Senior Developer"
                    />
                </div>

                <div className="form-group">
                    <label>ช่องทางการติดต่อ</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #ddd', 
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9'
                            }}
                            onChange={(e) => {
                                if (e.target.value && !formData.link_contact.includes(e.target.value)) {
                                    setFormData(prev => ({
                                        ...prev,
                                        link_contact: e.target.value
                                    }));
                                }
                            }}
                        >
                            <option value="">เพิ่ม prefix</option>
                            <option value="mailto:">อีเมล (mailto:)</option>
                            <option value="https://linkedin.com/in/">LinkedIn</option>
                            <option value="https://twitter.com/">Twitter</option>
                            <option value="tel:">โทรศัพท์ (tel:)</option>
                        </select>
                        <input
                            type="text"
                            name="link_contact"
                            className="form-control"
                            value={formData.link_contact}
                            onChange={handleInputChange}
                            placeholder="เช่น john@example.com หรือ https://linkedin.com/in/johndoe"
                        />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                        สามารถใส่ลิงก์อีเมล (mailto:...) หรือลิงก์โซเชียลมีเดีย
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary">
                        <FaPlus style={{ marginRight: '8px' }} />
                        {editingId ? 'อัพเดทสมาชิก' : 'เพิ่มสมาชิก'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            ยกเลิก
                        </button>
                    )}
                </div>
            </form>

            <h3>รายการสมาชิกทีมทั้งหมด</h3>
            {teamMembers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <p>ยังไม่มีข้อมูลสมาชิกทีม</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>รูป</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>ตำแหน่ง</th>
                                <th>ช่องทางติดต่อ</th>
                                <th style={{ width: '150px' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        {member.profile_image ? (
                                            <div style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                borderRadius: '50%', 
                                                overflow: 'hidden',
                                                border: '2px solid #FFA500'
                                            }}>
                                                <img 
                                                    src={member.profile_image.startsWith('http') ? member.profile_image : `${BASE_API_URL}${member.profile_image}`}
                                                    alt={`${member.firstname} ${member.lastname}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    // onError={(e) => {
                                                    //     e.target.src = 'https://via.placeholder.com/60x60/CCCCCC/333333?text=Avatar';
                                                    // }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                borderRadius: '50%', 
                                                backgroundColor: '#f0f0f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#999',
                                                border: '2px solid #FFA500'
                                            }}>
                                                {member.firstname?.charAt(0)}{member.lastname?.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{member.firstname} {member.lastname}</strong>
                                    </td>
                                    <td>
                                        {member.position}
                                    </td>
                                    <td>
                                        {member.link_contact ? (
                                            <a 
                                                href={member.link_contact} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ 
                                                    fontSize: '0.9rem', 
                                                    color: '#FFA500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {member.link_contact.includes('mailto:') && <FaEnvelope size={14} />}
                                                {member.link_contact.includes('linkedin.com') && <FaLinkedin size={14} />}
                                                {member.link_contact.includes('tel:') && <FaPhone size={14} />}
                                                ติดต่อ
                                            </a>
                                        ) : (
                                            <span style={{ color: '#999', fontSize: '0.9rem' }}>ไม่มีข้อมูล</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleEdit(member)}
                                                className="btn-icon btn-edit"
                                                title="แก้ไข"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member.id)}
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

export default TeamManager;