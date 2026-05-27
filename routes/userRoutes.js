const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const {
  body
} = require("express-validator");


const {
  register,
  login
} = require("../controllers/userController");

const auth = require("../middleware/auth");

const User = require("../models/User");

router.post(
  "/register",

  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Invalid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars")
  ],

  register
);

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    res.json({
      message: "Image uploaded",
      file: req.file.filename
    });

  }
);

router.post("/login", login);

router.get("/profile", auth, async (req, res) => {

  const user = await User.findById(
    req.user.id
  ).select("-password");

  res.json(user);

});

module.exports = router;