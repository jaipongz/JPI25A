const Team = require('../models/Team');

exports.getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.getAll();
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTeamMember = async (req, res) => {
    try {
        const { firstname, lastname, position, link_contact } = req.body;
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null;
        
        const teamId = await Team.create({
            profile_image,
            firstname,
            lastname,
            position,
            link_contact
        });
        
        res.status(201).json({ id: teamId, message: 'Team member created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTeamMember = async (req, res) => {
    try {
        const { firstname, lastname, position, link_contact } = req.body;
        const profile_image = req.file ? `/uploads/${req.file.filename}` : req.body.profile_image;
        
        await Team.update(req.params.id, {
            profile_image,
            firstname,
            lastname,
            position,
            link_contact
        });
        
        res.json({ message: 'Team member updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTeamMember = async (req, res) => {
    try {
        await Team.delete(req.params.id);
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};