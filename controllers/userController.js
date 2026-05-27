const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validationResult
} = require("express-validator");


exports.register = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

  return res.status(400).json({
    errors: errors.array()
  });
  const existingUser = await User.findOne({
  email: req.body.email
  });

  if (existingUser) {
  return res.status(400).json({
    message: "Email already exists"
  });
  }
  }
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    10
  );

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  await user.save();

  res.json({
    message: "User created"
  });

};

exports.login = async (req, res) => {

  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const isMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      message: "Wrong password"
    });
  }

  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  res.json({
    token
  });

};