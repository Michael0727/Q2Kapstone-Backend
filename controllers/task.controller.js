const Task = require("../models/task.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user.model");

//GET my todos
router.get("/mytasks", auth, async (req, res) => {
  try {
    const tasks = await Task.map((ele) => ele.createdBy === User.email);
    res.json(tasks);
  } catch (error) {
    res.status(400).send({ message: "ERROR" });
  }
});
//POST my todos
router.post("/mytasks", auth, async (req, res) => {
  const { title, details, dueDate, category, createdBy } = req.body;
  try {
    task = new Task({
      title: req.body.title,
      details: req.body.details,
      dueDate: req.body.dueDate,
      category: req.body.category,
      createdBy: req.body.createdBy,
    });
    await task.save();
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Error This sucks");
  }
});
//PATCH/update my todos completed/not completed
//DELETE my todos

module.exports = router;
