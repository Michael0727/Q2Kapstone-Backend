const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now() },
  completed: { type: Boolean, default: false },
  category: { type: String, required: true },
  //   createdBy: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
//foreign keys-----------
