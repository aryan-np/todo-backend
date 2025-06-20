const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/comment');
const authMiddleware = require('../Middlewares/auth');

// 📝 Create comment (Authenticated users)
router.post('/', authMiddleware, commentController.createComment);

// 🔍 Get all comments for a todo
router.get('/:todoId', authMiddleware, commentController.getCommentsByTodo);

// ❌ Delete a comment (by owner or admin)
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
