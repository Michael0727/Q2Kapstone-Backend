const User = require("../models/user.model");
const router = require("express").Router();
const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    //const { username, email, password, age } = req.body;
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
        age: req.body.age,
      });
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: { id: user.id },
      };
      jwt.sign(payload, "randomString", { expiresIn: 10000 }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

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
      const payload = { user: { id: user.id } };

      jwt.sign(payload, "randomString", { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

router.get("/allusers", async (req, res) => {
  //get all users
  try {
    const allusers = await User.find();
    res.json(allusers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.route("/allusers").get((req, res) => {
//   //get all users
//   User.find()
//     .then((allUsers) => res.json(allUsers))
//     .catch((err) => res.status(400).json(`Error! ${err}`));
// });

// router.route("/delete/:id").delete((req, res) => {
//   User.deleteOne({ _id: req.params.id })
//     .then((success) => res.json("Success! User removed."))
//     .catch((err) => res.status(400).json(`Error! ${err}`));
// });

// router.route("/update/:id").put((req, res) => {
//   User.findByIdAndUpdate(req.params.id, req.body)
//     .then((user) => res.json(`Success! User updated.`))
//     .catch((err) => res.status(400).json(`Error! ${err}`));
// });

module.exports = router;
