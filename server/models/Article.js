const pool = require('../config/database');

class Article {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const [result] = await pool.query(
            'INSERT INTO articles (thumbnail, title, description, content) VALUES (?, ?, ?, ?)',
            [data.thumbnail, data.title, data.description, data.content]
        );
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query(
            'UPDATE articles SET thumbnail = ?, title = ?, description = ?, content = ? WHERE id = ?',
            [data.thumbnail, data.title, data.description, data.content, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    }
}

module.exports = Article;