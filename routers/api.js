const express = require("express");
const userRouter = require("./api/userRouter");
const orderRouter = require("./api/orderRoutes");
const inventoryRouter = require("./api/InventoryRoutes");
const locationRouter = require("./api/locationRoutes");
const productCategoryRouter = require("./api/productCategoryRoutes");
const api = express.Router();


api.use("/users", userRouter)
api.use("/orders", orderRouter)
api.use("/inventories", inventoryRouter)
api.use("/locations", locationRouter)
api.use("/productcategories", productCategoryRouter)

module.exports = api;