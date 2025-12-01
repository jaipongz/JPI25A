const pool = require('../config/database');

class Portfolio {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM portfolios ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const [result] = await pool.query(
            'INSERT INTO portfolios (thumbnail, title, description, link) VALUES (?, ?, ?, ?)',
            [data.thumbnail, data.title, data.description, data.link]
        );
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query(
            'UPDATE portfolios SET thumbnail = ?, title = ?, description = ?, link = ? WHERE id = ?',
            [data.thumbnail, data.title, data.description, data.link, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM portfolios WHERE id = ?', [id]);
    }
}

module.exports = Portfolio;