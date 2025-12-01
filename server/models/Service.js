const pool = require('../config/database');

class Service {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const [result] = await pool.query(
            'INSERT INTO services (icon, title, description) VALUES (?, ?, ?)',
            [data.icon, data.title, data.description]
        );
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query(
            'UPDATE services SET icon = ?, title = ?, description = ? WHERE id = ?',
            [data.icon, data.title, data.description, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM services WHERE id = ?', [id]);
    }
}

module.exports = Service;