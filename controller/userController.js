const User = require("../models/userModel.js");

const dotenv = require("dotenv");
dotenv.config();
const genToken = require("../utils/genToken.js");

exports.signUpUser = async function (req, res, next) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    user.password = undefined; // so the password won't show in the output and as payload in the token
    user.confirmPassword = undefined; // so the password won't show in the output and as payload in the token
    user.__v = undefined;
    const token = genToken(user);
    console.log(user, token);

    res.cookie("user", user, { httpOnly: true });
    // return res.redirect("/");
    return res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.signInUser = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    console.log(req.cookies);
    if (!email || !password)
      return next(new Error("Bad request! Email and Password is required."));
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user || !(await user.isCorrectPassword(password)))
      return next(new Error("Unauthenticated! Email or Password incorrect."));
    user.password = undefined;
    user.__v = undefined;
    const token = genToken(user);
    res.cookie("user", user, { httpOnly: true });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
