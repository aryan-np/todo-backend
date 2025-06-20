// routes/todo.js

const express = require('express');
const router = express.Router();
const todoController = require('../Controllers/todo');
const authMiddleware = require('../Middlewares/auth'); // Verifies JWT & sets req.user
const isAdmin = require('../Middlewares/isAdmin');  // Checks if req.user.role === 'admin'

// User/Admin: View all todos
router.get('/', authMiddleware, todoController.getTodos);

// Admin-only: Create, Update, Delete
router.post('/', authMiddleware, isAdmin, todoController.createTodo);
router.put('/:id', authMiddleware, isAdmin, todoController.updateTodo);
router.delete('/:id', authMiddleware, isAdmin, todoController.deleteTodo);

router.post('/filter', authMiddleware, todoController.filterTodo);
router.post('/shift', authMiddleware, todoController.shiftTodo); // or allow users if needed


module.exports = router;
