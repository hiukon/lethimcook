const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../controllers/authMiddleware'); // Import middleware

// Đảm bảo tất cả các route này đều được bảo vệ bằng middleware xác thực token
router.get('/favorites', authMiddleware, getFavorites);
router.post('/addfavorites', authMiddleware, addFavorite);
router.delete('/removefavorites', authMiddleware, removeFavorite);

module.exports = router;
