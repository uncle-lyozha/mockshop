const express = require("express");

const bcrypt = require("bcryptjs");

const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("E-mail is not valid.")
      .normalizeEmail()
      .trim(),
    body("password", "Password must have at least 6 characters")
      .isLength({
        min: 6,
      })
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("E-mail is not valid.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject("User with this e-mail already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password must have at least 6 characters")
      .isLength({
        min: 6,
      })
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignUp
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.post("/new-pass", authController.postNewPass);

module.exports = router;
