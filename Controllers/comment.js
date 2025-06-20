// controllers/commentController.js

const Comment = require('../Models/comment');

// 📌 Create a new comment
exports.createComment = async (req, res) => {
  const { todo, text } = req.body;

  try {
    const comment = new Comment({
      todo,
      text,
      by: req.user.userId // from JWT middleware
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create comment', error: err.message });
  }
};

// 📌 Get all comments for a todo
exports.getCommentsByTodo = async (req, res) => {
  try {
    const comments = await Comment.find({ todo: req.params.todoId })
      .populate('by', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// 📌 Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ message: 'Comment not found' });

    // Optional: Only allow comment author or admin to delete
    if (comment.by.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};

