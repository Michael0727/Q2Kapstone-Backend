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

    User.findOneAndUpdate({ _id: req.user.id }, { $push: { tasks: task } }, (error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("task");
        res.status(201).send(success);
      }
    });
    await task.save();
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Error This sucks");
  }
});

// router.patch("/update/completion/:id", auth, async (req, res) => {
//   try {
//     let currentUser = User.findById(req.user.id);
//     console.log(currentUser);
//     let toggleTask = await Task.findById(req.params.id);
//     let currentTask = await Task.findByIdAndUpdate(req.params.id, { completed: !toggleTask.completed }, (err, docs) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log(`Updated: ${docs}`);
//       }
//     });
//     console.log(currentTask);
//     currentTask = await currentTask.save().then(
//       (await currentUser).save((err) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(`Updated ${currentUser}`);
//         }
//       })
//     );
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "ERROR THIS SUCKS" });
//   }
// });

router.patch("/update/completion/:id", auth, async (req, res) => {
  try {
    let currentTask = Task.findById(req.params.id);
    let currentUser = User.findById(req.user.id);
    console.log((await currentUser).tasks);
    console.log((await currentTask).completed);
    await User.findOneAndUpdate(
      { _id: req.userid, "tasks._id": req.params.id },
      { $set: { "tasks.$.completed": req.body.completed } },
      (err, docs) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`SUCCESS : ${currentUser.tasks} -- ${docs}`);
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).send(`Server Error:  ${e}`);
  }
});

// router.patch("/update/completion/:id", auth, async (req, res) => {
//   // const { title, details, dueDate, category, createdBy } = req.body;
//   try {
//     let toggleTask = Task.findById(req.params.id);
//     let currentTask = Task.findByIdAndUpdate(req.params.id, { completed: !toggleTask.completed }, (err, docs) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log("task update success", currentTask.completed);
//       }
//     });

//     User.findOneAndUpdate({ _id: req.user.id }, { $set: { tasks: task } }, (error, success) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("task");
//       }
//     });
//     await User.save();
//   } catch (e) {
//     console.log(e.message);
//     res.status(500).send("Error This sucks");
//   }
// });

//--------------------WHERE MIKE AND I LEFT OFF WHEN WORKING TOGETHER-----------------------------------------------

// router.patch("/update/completion/:id", auth, async (req, res) => {
//   try {
//     let currentUser = await User.findById(req.user.id);
//     let toggleTask = await Task.findById(req.params.id);
//     let indexOfTask = currentUser.tasks.findIndex((ele) => ele.title === toggleTask.title);
//     console.log(toggleTask);
//     let currentTask = await Task.findByIdAndUpdate(req.params.id, { completed: !toggleTask.completed }, (err, docs) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log(`Updated :  ${docs}`);
//       }
//     });
//     User.findOne(currentUser).then((tasks) => {
//       tasks[indexOfTask] = currentTask;
//     });
// User.findByIdAndUpdate(currentUser, { tasks: currentUser.tasks.splice(indexOfTask, 1, currentTask) }, (err, docs) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`Updated: ${docs}`);
//   }
// });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Server Error" });
//   }
// });
//--------------------WHERE MIKE AND I LEFT OFF WHEN WORKING TOGETHER-----------------------------------------------

// router.patch("/update/task/:id", auth, async (req, res) => {
//   try {
//     let currentTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       { title: req.body.title, details: req.body.details, dueDate: req.body.dueDate },
//       (err, docs) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(docs);
//         }
//       }
//     );
//     currentTask = await currentTask.save().then((modifiedTask) => res.status(200).send(modifiedTask));
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "something went wrong" });
//   }
// });

//DELETE my todos

module.exports = router;
