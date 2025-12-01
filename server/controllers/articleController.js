const Article = require('../models/Article');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.getAll();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getArticle = async (req, res) => {
    try {
        const article = await Article.getById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const { title, description, content } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
        
        const articleId = await Article.create({
            thumbnail,
            title,
            description,
            content
        });
        
        res.status(201).json({ id: articleId, message: 'Article created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { title, description, content } = req.body;
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail;
        
        await Article.update(req.params.id, {
            thumbnail,
            title,
            description,
            content
        });
        
        res.json({ message: 'Article updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        await Article.delete(req.params.id);
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};