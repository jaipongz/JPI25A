const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/auth');

const articleController = require('../controllers/articleController');
const serviceController = require('../controllers/serviceController');
const portfolioController = require('../controllers/portfolioController');
const teamController = require('../controllers/teamController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Public routes
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticle);
router.get('/services', serviceController.getAllServices);
router.get('/portfolio', portfolioController.getAllPortfolios);
router.get('/team', teamController.getAllTeamMembers);

// Protected routes (require authentication)
router.post('/articles', authenticate, upload.single('thumbnail'), articleController.createArticle);
router.put('/articles/:id', authenticate, upload.single('thumbnail'), articleController.updateArticle);
router.delete('/articles/:id', authenticate, articleController.deleteArticle);

router.post('/services', authenticate, serviceController.createService);
router.put('/services/:id', authenticate, serviceController.updateService);
router.delete('/services/:id', authenticate, serviceController.deleteService);

router.post('/portfolio', authenticate, upload.single('thumbnail'), portfolioController.createPortfolio);
router.put('/portfolio/:id', authenticate, upload.single('thumbnail'), portfolioController.updatePortfolio);
router.delete('/portfolio/:id', authenticate, portfolioController.deletePortfolio);

router.post('/team', authenticate, upload.single('profile_image'), teamController.createTeamMember);
router.put('/team/:id', authenticate, upload.single('profile_image'), teamController.updateTeamMember);
router.delete('/team/:id', authenticate, teamController.deleteTeamMember);

// Auth routes
router.post('/login', require('../controllers/authController').login);

// เพิ่ม route สำหรับตรวจสอบ API ทำงาน
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'JaipongZ Industries API is running',
        timestamp: new Date().toISOString()
    });
});

// เพิ่ม route สำหรับข้อมูลตัวอย่าง (ถ้าไม่มีข้อมูลใน database)
router.get('/articles/sample', (req, res) => {
    const sampleArticles = [
        {
            id: 1,
            thumbnail: 'https://via.placeholder.com/350x200/FFA500/ffffff?text=Web+Trend',
            title: 'เทรนด์การพัฒนาเว็บปี 2024',
            description: 'อัพเดทเทรนด์เทคโนโลยีเว็บที่มาแรง',
            content: 'บทความเกี่ยวกับเทรนด์เว็บไซต์...',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            thumbnail: 'https://via.placeholder.com/350x200/333333/ffffff?text=API+Security',
            title: 'ความปลอดภัยของ API',
            description: 'วิธีป้องกัน API จากภัยคุกคาม',
            content: 'บทความเกี่ยวกับความปลอดภัย...',
            created_at: new Date().toISOString()
        }
    ];
    res.json(sampleArticles);
});

module.exports = router;