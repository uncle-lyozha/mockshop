require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
//adds flash messages, like errors
const flash = require("connect-flash");

const MONGODB_URI = `mongodb+srv://${process.env.USER}:${process.env.PASS}@mockshop.o4n7ofw.mongodb.net/shop?retryWrites=true&w=majority`;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();
const store = new MongoStore({ uri: MONGODB_URI, collection: "sessions" });
const csrfProtector = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "some secret string",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtector);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
    console.log("App started on Port:3000");
  })
  .catch(err => {
    console.log(err);
  });
