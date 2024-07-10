const express = require("express");
const userRouter = require("./api/userRouter");
const orderRouter = require("./api/orderRoutes");
const api = express.Router();


api.use("/users", userRouter)
api.use("/orders", orderRouter)

module.exports = api;