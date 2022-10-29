const authRouter = require("express").Router();
const bcryptjs = require("bcryptjs");
const authController = require("../controllers/authController");
authRouter.post("/signup", authController.signupController);
authRouter.post("/login", authController.loginController);