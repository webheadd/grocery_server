const express = require("express");
const router = express.Router();

// controller
const { signIn, signUp } = require("../controllers/usersController");

//get current logged in user
// router.get("/getCurrentUser", getCurrentUser);

//customer signup
router.post("/register", signUp);

//customer signin
router.post("/signin", signIn);

module.exports = router;
