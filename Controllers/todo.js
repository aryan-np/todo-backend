// controllers/todoController.js

const Todo = require('../Models/todo');

// GET all todos (users and admins)
exports.getTodos = async (req, res) => {
  try {
    let todos
    if (req.user.role=='admin'){
    todos = await Todo.find();
    }
    if (req.user.role=='user'){
        todos = await Todo.find({assignedTo:req.user.userId})
    }
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error'+err });
  }
};

// CREATE todo (admin only)
exports.createTodo = async (req, res) => {
  const { title, description, date, priority, category, assignedTo, assignedBy, status } = req.body;

  try {
    const newTodo = new Todo({ title, description, date, priority, category, assignedTo, assignedBy, status });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create todo', error: err.message });
  }
};

// UPDATE todo (admin only)
exports.updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Todo not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update todo', error: err.message });
  }
};

// DELETE todo (admin only)
exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete todo', error: err.message });
  }
};


exports.filterTodo = async (req, res) => {
  const { priority, status, category } = req.body;

  try {
    const query = {};

    // Filter by priority if provided
    if (priority) query.priority = priority;

    // Filter by category if provided
    if (status) query.status = status;

    if (category) query.status = category;

    // Filter by due date if provided
    // if (due) {
    //   const dueDate = new Date(due);
    //   // Match todos with the exact same day (ignoring time)
    //   query.date = {
    //     $gte: new Date(dueDate.setHours(0, 0, 0, 0)),
    //     $lte: new Date(dueDate.setHours(23, 59, 59, 999)),
    //   };
    // }

    // Role-based filtering (user vs admin)
    if (req.user.role === 'user') {
      query.assignedTo = req.user.userId;
    }

    const filteredTodos = await Todo.find(query).populate('assignedTo assignedBy', 'name email');
    res.json(filteredTodos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to filter todos', error: err.message });
  }
};


// Shift todo status: from pending ➝ in-progress ➝ completed
exports.shiftTodo = async (req, res) => {
  const { todoId, to } = req.body;

  const validStatuses = ['pending', 'in-progress', 'completed'];

  if (!validStatuses.includes(to)) {
    return res.status(400).json({ message: 'Invalid status transition' });
  }

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.status = to;
    await todo.save();

    res.json({ message: 'Todo status updated', todo });
  } catch (err) {
    res.status(500).json({ message: 'Failed to shift todo status', error: err.message });
  }
};
