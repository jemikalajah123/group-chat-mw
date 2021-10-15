const Validator = require("validatorjs");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require("../logger");



const createUser = async (req, res) => {
  try {
    const rules = {
      email: "required|email",
      fullName: "required|string",
      password: "required|confirmed|min:6",
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: "failed",
        message: "Validation Errors",
        errors: validation.errors.all(),
      });
    }

    const {
      fullName,
      email,
      password,
    } = req.body;

    const checkUsername = await User.findOne({
      email: email.toLowerCase(),
    })

    if (checkUsername !== null) {
      return res.status(422).json({
        status: "failed",
        message: `User already exists`,
      });
    } 

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hash,
    });
    await user.save();


    const { _id, isActive, avatar } = user;

    const userData = {
      _id,
      fullName,
      email,
      avatar,
      isActive
    };

    const token = await jwt.sign(userData, process.env.JWT_KEY, {
      expiresIn: "2hr",
    });

    return res.status(201).json({
      responseCode: "00",
      status: "success",
      message: "User Successfully Created",
      token,
      data: userData,
    });
  } catch (error) {
    await log("Create user error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "An error Occurred Please Try again",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const rules = {
      email: "required|string",
      password: "required",
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: "failed",
        message: "Validation Errors",
        errors: validation.errors.all(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({email: email.toLowerCase() });
    if (user === null) {
      return res.status(404).json({
        status: "failed",
        message: `user with Email Address ${email} does not exist`,
        errors: {
          email: ["Email does not exist please Sign Up"],
        },
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword === false) {
      return res.status(422).json({
        status: "failed",
        message: `Password does not match`,
        errors: {
          password: ["Passwords does not match"],
        },
      });
    }

    if (user.isActive !== true) {
      return res.status(422).json({
        status: "failed",
        message: `Your Account has been disabled, Contact Support`,
      });
    }

    const {
      _id,
      isActive,
      fullName,
      avatar,
    } = user

    const userData = {
      _id,
      fullName,
      isActive,
      avatar,
      email
    }

    const token = await jwt.sign(userData, process.env.JWT_KEY, {
      expiresIn: "2hr",
    });

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "User Logged In",
      token,
      expiresIn: "2 Hours",
      data: userData,
    });
  } catch (error) {
    await log("Login user errror", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "internal Server Error",
    });
  }
};


module.exports = {
  createUser,
  loginUser,
};
