const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../controllers/authMiddleware');

router.post('/comments', authMiddleware, commentController.addComment); // Thêm middleware ở đây
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);
router.get('/comments/:recipeId', commentController.getCommentsByRecipe);

module.exports = router;