const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = { todoSchema, Todo };
