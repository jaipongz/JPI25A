const Portfolio = require('../models/Portfolio');

exports.getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.getAll();
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPortfolio = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
        
        const portfolioId = await Portfolio.create({
            thumbnail,
            title,
            description,
            link
        });
        
        res.status(201).json({ id: portfolioId, message: 'Portfolio created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePortfolio = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail;
        
        await Portfolio.update(req.params.id, {
            thumbnail,
            title,
            description,
            link
        });
        
        res.json({ message: 'Portfolio updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        await Portfolio.delete(req.params.id);
        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};