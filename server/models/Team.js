const pool = require('../config/database');

class Team {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM team_members ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const [result] = await pool.query(
            'INSERT INTO team_members (profile_image, firstname, lastname, position, link_contact) VALUES (?, ?, ?, ?, ?)',
            [data.profile_image, data.firstname, data.lastname, data.position, data.link_contact]
        );
        return result.insertId;
    }

    static async update(id, data) {
        await pool.query(
            'UPDATE team_members SET profile_image = ?, firstname = ?, lastname = ?, position = ?, link_contact = ? WHERE id = ?',
            [data.profile_image, data.firstname, data.lastname, data.position, data.link_contact, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
    }
}

module.exports = Team;