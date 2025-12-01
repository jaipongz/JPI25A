const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.getAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const { icon, title, description } = req.body;
        
        const serviceId = await Service.create({
            icon,
            title,
            description
        });
        
        res.status(201).json({ id: serviceId, message: 'Service created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { icon, title, description } = req.body;
        
        await Service.update(req.params.id, {
            icon,
            title,
            description
        });
        
        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        await Service.delete(req.params.id);
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};