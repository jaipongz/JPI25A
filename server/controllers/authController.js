const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../config/database');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // ใน production ควรใช้ prepared statement
        const [users] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // สำหรับการทดสอบ ใช้ password ตรงๆ
        // ใน production ควรใช้ bcrypt.compare
        const isValidPassword = password === 'password123'; // เปลี่ยนเป็น bcrypt.compare ใน production
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};