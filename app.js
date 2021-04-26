require("dotenv").config();
const md5 = require("md5")
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")

});

app.get("/login", function(req, res) {
  res.render("login")
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        } else {
          res.send("<h1>Not correct password :/</h1>")
        }
      } else {
        res.send("<h1>No user with that Name :/</h1>")
      }
    }
  })
});

app.get("/register", function(req, res) {
  res.render("register")

});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (!err) {
      console.log("Registered!")
    } else {
      console.log(err)
    }
  })
  res.render("secrets");
});

app.get("/secrets", function(req, res) {
  res.render("secrets")

});




app.listen(3000, function() {
  console.log("Server started on 3000");
});
