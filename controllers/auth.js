const bcrypt = require("bcryptjs");

const User = require("../models/user");

const nodemailer = require("nodemailer");

const { validationResult } = require("express-validator");

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: `${process.env.BREVO_USER}`,
    pass: `${process.env.BREVO_PASS}`,
  },
});

// verify connection configuration
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login.",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const valErrors = validationResult(req);
  if (!valErrors.isEmpty()) {
    console.log(valErrors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login.",
      errorMessage: valErrors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: valErrors.array(),
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("User not found");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login.",
          errorMessage: "Invalid e-mail or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: valErrors.array(),
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          console.log("Invalid password");
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login.",
            errorMessage: "Invalid e-mail or password.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: valErrors.array(),
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const valErrors = validationResult(req);
  if (!valErrors.isEmpty()) {
    console.log(valErrors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: valErrors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: valErrors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPass => {
      const newUser = new User({
        email: email,
        password: hashedPass,
        cart: { items: [] },
      });
      return newUser.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "shop@lyozha.com",
        subject: "Signup succeeded!",
        html: "<h1>Signup succeeded!</h1>",
      });
    })
    .catch(err => {
      console.log(err);
    })
    .catch(err => {
      console.log(err);
    });
};
