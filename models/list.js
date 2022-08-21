const mongoose = require("mongoose");
const { todoSchema } = require("./todo");

const listSchema = new mongoose.Schema({
  list: String,
  items: [todoSchema],
});

const List = mongoose.model("List", listSchema);

module.exports = List;
