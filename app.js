const userRoutes = require("./controllers/user.controller");
const taskRoutes = require("./controllers/task.controller");
let express = require("express");
const moment = require("moment");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user.model");
require("dotenv").config();
const source = process.env.ATLAS_CONNECTION;
let app = express();
const PORT = process.env.PORT || 3000;
let date = new Date();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use(`/tasks`, taskRoutes);
//mongoDB connect ---------------------------------------
mongoose.connect(source, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection to MongoDB established succesfully.");
});
//end connect code------------------------------------------

// let db = {
//   username: [
//     {
//       id: nanoid(),
//       title: "test",
//       details: "testing",
//       dueDate: moment(date).format("MMMM Do, YYYY"),
//       createdAt: moment(date).format("MMMM Do, YYYY"),
//       completed: false,
//       category: "origin",
//       username: "username",
//     },
//   ],
// };
app.get("/", (req, res) => {
  res.status(200).json("Welcome to You Can Dos API");
});

// app.get("/main", (req, res) => {
//   res.status(200).send(db.username);
// });

// app.get("/main/:id", (req, res) => {
//   let selectedTask = db.username.find((task) => task.id === req.params.id);
//   if (selectedTask) {
//     res.status(200).json(selectedTask);
//   } else {
//     res.status(404).send(`task at ${req.params.id} was not found`);
//   }
// });

// app.post("/main", (req, res) => {
//   const task = {
//     id: nanoid(),
//     title: req.body.title,
//     details: req.body.details,
//     dueDate: moment(date).format("MMMM Do, YYYY"),
//     createdAt: moment(date).format("MMMM Do, YYYY"),
//     completed: false,
//     category: "origin",
//     username: "username",
//   };
//   db.username.push(task);
//   res.status(201).json(task);
// });

// app.patch("/main/:id", (req, res) => {
//   const selectedTask = db.username.find((task) => {
//     if (task.id === req.params.id) {
//       return true;
//     } else {
//       return false;
//     }
//   });
//   //error handling will go on this line
//   if (req.body.title === "") {
//     return res.status(400).send("Invalid Title");
//   }
//   if (req.body.details === "") {
//     return res.status(400).send("Invalid details");
//   }
//   if (req.body.dueDate === "") {
//     return res.status(400).send("Invalid Due Date");
//   }
//   if (req.body.completed === "") {
//     return res.status(400).send("Invalid completed status");
//   }
//   if (req.body.category === "") {
//     return res.status(400).send("Invalid category");
//   }
//   //error handling ends here
//   selectedTask.title = req.body.title;
//   selectedTask.details = req.body.details;
//   selectedTask.dueDate = req.body.dueDate;
//   selectedTask.completed = req.body.completed;
//   selectedTask.category = req.body.category;
//   res.status(200).json(selectedTask);
// });

// app.delete("/main/:id", (req, res) => {
//   const selectedTask = db.username.filter((task) => {
//     if (task.id !== req.params.id) {
//       return true;
//     } else {
//       return false;
//     }
//   });
//   //error handling goes on this line
//   if (selectedTask.length === db.username.length) {
//     res.status(404).send(`${req.params.id} not found`);
//   }
//   //error handling ends here
//   db.username = selectedTask;
//   res.send(db.username);
// });

app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
