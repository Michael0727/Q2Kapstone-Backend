const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    details: { type: String, required: true },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now() },
    completed: { type: Boolean, default: false },
    category: { type: String, required: true },
    createdBy: { type: String, ref: "User" },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: [true, "A user is rquired to create Task"] },
  },
  { versionKey: false }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
//foreign keys-----------
