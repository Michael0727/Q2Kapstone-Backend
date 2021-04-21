const Task = require("../models/task.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
const { Router } = require("express");

//GET my todos
router.get("/mytasks", auth, async (req, res) => {
  try {
    // const user = await User.findById({ _id: req.user._id });
    const tasks = await Task.find({ user: req.user.id });
    console.log(req.user.id);
    // console.log(tasks);
    // console.log(user);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).send({ message: "ERROR" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id });
    await res.status(200).json(task);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

//POST my todos
router.post("/mytasks", auth, async (req, res) => {
  // const { title, details, dueDate, category, createdBy } = req.body;
  try {
    task = new Task({
      title: req.body.title,
      details: req.body.details,
      dueDate: req.body.dueDate,
      category: req.body.category,
      createdBy: req.user.username,
      user: req.body.user,
    });

    // User.findOneAndUpdate({ _id: req.user.id }, { $push: { tasks: task } }, (error, success) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(task);
    //     res.status(201).send(success);
    //   }
    // });
    console.log(task);
    task.save((err, success) => {
      if (err) {
        console.error(err);
      } else {
        res.status(201).send(success);
      }
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(`Error: ${e.message}`);
  }
});

router.patch("/update/completion/:id", auth, async (req, res) => {
  try {
    let currentTask = Task.findById(req.params.id);
    let currentId = (await currentTask)._id;
    let completionStatus = (await currentTask).completed;

    let task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { completed: !completionStatus } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Updated ${doc}`);
        }
      }
    );

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { "tasks.$[el].completed": task.completed } },
      { arrayFilters: [{ "el._id": currentId }], new: true },
      (err, docs) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Updated ${docs}`);
          res.status(200).send(docs);
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "ERROR THIS SUCKS" });
  }
});

router.patch("/update/task/:id", auth, async (req, res) => {
  try {
    let currentTask = Task.findById(req.params.id);
    let currentId = (await currentTask)._id;
    let completionStatus = (await currentTask).completed;

    let task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { title: req.body.title, details: req.body.details, dueDate: req.body.dueDate } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Updated ${doc}`);
          res.status(200).send(doc);
        }
      }
    );
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          "tasks.$[el].title": req.body.title,
          "tasks.$[el].details": req.body.details,
          "tasks.$[el].dueDate": req.body.dueDate,
        },
      },
      { arrayFilters: [{ "el._id": currentId }], new: true },
      (err, docs) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Updated ${docs}`);
          res.status(200).send(doc);
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});

//DELETE my todos
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    let currentTask = Task.findById(req.params.id);
    let currentId = (await currentTask)._id;
    // await console.log(currentId);
    await User.updateOne({ _id: req.user.id }, { $pull: { tasks: { _id: currentId } } }, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Deleted : ${docs}`);
      }
    });
    await Task.findOneAndDelete({ _id: req.params.id }, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Deleted : ${docs}`);
        res.status(200).send(docs);
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
