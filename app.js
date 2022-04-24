require("dotenv").config();
const express = require("express");
const bodyParser =require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({ extended: true }))
// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.static("public"));

//Connect local Host
mongoose.connect("mongodb://localhost:27017/userDetails");

//creating schema for userDetails
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

///model for userDetails
const User = new mongoose.model("user",userSchema)
////////////////////Request from the client//////////////////////////////////
app.get("/",function(req,res)
{
  res.render("home");
});

///<---section Register------->/////
app.get("/register",function(req,res)
{
  res.render("register");
});

app.post("/register",function(req,res)
{
  const userName = req.body.username;
  const password = req.body.password;

  const userData = new User({
    email:userName,
    password:password
  });
  userData.save();
  res.render("secrets");
});

///<---section login------->/////
app.get("/login",function(req,res)
{
  res.render("login");
});

app.post("/login",function(req,res)
  {
    User.findOne({email:req.body.username},function(err,foundUser)
     {
       if(foundUser)
        {
          if(foundUser.password === req.body.password)
           {
             res.render("secrets");
           }
           else{
             console.log(err);
           }
        }
        else{
          console.log("USer not found");
        }
     });
  });

app.listen(3000,function(){
  console.log("Local host 3000 is working");
});
