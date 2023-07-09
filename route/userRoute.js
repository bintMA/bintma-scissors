const express = require("express");
const passport = require("passport");
const { signUpUser, signInUser } = require("../controller/userController");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", signInUser);

module.exports = router;
