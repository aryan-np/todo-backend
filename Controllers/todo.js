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


exports.filterTodo = async(req,res)=>{
    const {priority,category,due} = req.body
    
}
