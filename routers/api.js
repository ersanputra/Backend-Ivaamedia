const express = require("express");
const userRouter = require("./api/userRouter");
const api = express.Router();


api.use("/users", userRouter)

module.exports = api;