require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6554dcb02d9cf2b44202d068")
    .then(user => {
      req.user = user;
      next();
    }) 
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASS}@mockshop.o4n7ofw.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then(() => {
    User.findOne().then(user=>{
      if(!user) {
        const user = new User({
          name: "Aleks",
          email: "aleks@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    })
    app.listen(3000);
    console.log("App started on Port:3000");
  })
  .catch(err => {
    console.log(err);
  });
