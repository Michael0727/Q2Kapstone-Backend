const User = require("../models/user.model");
const router = require("express").Router();
const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// router.route("/new").post((req, res) => {
//   const newUser = new User(req.body);

//   newUser
//     .save()
//     .then((user) => res.json(user))
//     .catch((err) => res.status(400).json("Error!" + err));
// });

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
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
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

module.exports = router;

router.route("/allusers").get((req, res) => {
  //get all users
  User.find()
    .then((allUsers) => res.json(allUsers))
    .catch((err) => res.status(400).json(`Error! ${err}`));
});

router.route("/delete/:id").delete((req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((success) => res.json("Success! User removed."))
    .catch((err) => res.status(400).json(`Error! ${err}`));
});

router.route("/update/:id").put((req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((user) => res.json(`Success! User updated.`))
    .catch((err) => res.status(400).json(`Error! ${err}`));
});

module.exports = router;
