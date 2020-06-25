const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const Users = require("../models/Users");

//variables

const salt = 15;

//get current logged in user
router.get("/getCurrentUser", async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("You are not authorized");
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "SECRET_KEY");

    const user = await Users.findOne({
      customerID: decodedToken.subject
    }).select("-password");
    return res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong", err);
  }
});

//customer signup
router.post("/register", async (req, res) => {
  try {
    const user = await Users.findOne({ mobile: req.body.mobile }); //check if mobile number is taken

    if (!user) {
      const customer = new Users({
        customerID: uniqid(),
        mobile: req.body.mobile,
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address
      });
      customer.password = await bcrypt.hash(req.body.password, salt);
      const saveCustomer = await customer.save();
      return res.status(200).send(saveCustomer);
    }

    return res.send("Username already in use");
  } catch (error) {
    return res.status(500).send("ERROR: " + error);
  }
});

//customer signin
router.post("/signin", async (req, res) => {
  try {
    const user = await Users.findOne({
      mobile: req.body.mobile
    });

    //check if user is not registered
    if (user === null || !user)
      return res.status(403).send("Username does not exist");

    const payload = { subject: user.customerID };
    const token = jwt.sign(payload, "SECRET_KEY");

    //compare password
    const passwordIsMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //if correct send the user object.
    if (passwordIsMatched) {
      return res.send({ token });
    } else {
      return res.status(401).send("Username or password is incorrect");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
