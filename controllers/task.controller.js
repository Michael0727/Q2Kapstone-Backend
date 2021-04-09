const Task = require("../models/task.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user.model");

//GET my todos
router.get("/mytasks", auth, async (req, res) => {
  try {
    res.json(req.user.tasks);
  } catch (error) {
    res.status(400).send({ message: "ERROR" });
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
    });
    // const payload = {
    //   task: {
    //     id: task.id,
    //     title: task.title,
    //     details: task.details,
    //     dueDate: task.dueDate,
    //     category: task.category,
    //   },
    // };

    User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { tasks: task } },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log(task);
        }
      }
    );
    await task.save();
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Error This sucks");
  }
});
//PATCH/update my todos completed/not completed
// router.patch("/update/:id", auth, async (req, res) => {
//   console.log(req.user.tasks);
//   req.user.tasks.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.username,
//       details: req.body.details,
//       dueDate: req.body.dueDate,
//       category: req.body.category,
//       completed: false ? false : true,
//     },
//     (err, docs) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log(`Updated : ${docs}`);
//       }
//     }
//   );
// });

router.patch("/update/:id", auth, async (req, res) => {
  try {
    console.log(User);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//DELETE my todos

module.exports = router;
