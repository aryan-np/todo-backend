// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./database');

const authRoutes = require('./Routes/auth')
const todoRoutes = require('./Routes/todo')
const commentRoutes = require('./Routes/comment')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use("/auth",authRoutes);
app.use("/todo",todoRoutes);
app.use("/comment",commentRoutes);


// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});
