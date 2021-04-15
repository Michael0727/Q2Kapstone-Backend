const User = require("../models/user.model");
const router = require("express").Router();
const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
//signup new user
router.post(
  "/signup",
  [
    check("username", "please enter a valid username").not().isEmpty(),
    check("email", "Please Enter a Valid Email").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({ msg: "User Already Exists" });
      }

      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          tasks: user.tasks,
        },
      };
      jwt.sign(payload, "randomString", { expiresIn: "24h" }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);
//login user
router.post(
  "/login",
  [
    check("email", "Please enter a valid email address.").isEmail(),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User does not exist." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          tasks: user.tasks,
        },
      };
      //user: { username: user.username, email: user.email, id: user.id, tasks: user.tasks }
      jwt.sign(payload, "randomString", { expiresIn: "24h" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server Error" });
    }
  }
);
//get All Users
router.get("/allusers", async (req, res) => {
  //get all users
  try {
    const allusers = await User.find();
    res.status(200).json(allusers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete users
router.delete("/delete/:id", auth, async (req, res) => {
  User.findByIdAndDelete(req.user.id, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Deleted : ${docs}`);
    }
  });
});
//update users
router.patch("/update/:id", auth, async (req, res) => {
  User.findByIdAndUpdate(
    req.user.id,
    {
      username: req.body.username,
      email: req.body.email,
    },
    (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Updated: ${docs}`);
        res.status(200).send(doc);
      }
    }
  );
});

module.exports = router;
