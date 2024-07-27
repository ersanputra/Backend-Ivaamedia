const express = require("express");
const userRouter = require("./api/userRouter");
const orderRouter = require("./api/orderRoutes");
const inventoryRouter = require("./api/InventoryRoutes");
const locationRouter = require("./api/locationRoutes");
const productCategoryRouter = require("./api/productCategoryRoutes");
const uploadRouter = require("./api/uploadRoutes");
const kategoriPaymentRouter = require("./api/kategoriPaymentRoutes");
const bankRouter = require("./api/bankRoutes");
const transaksiRouter = require("./api/transaksiRoutes");
const userBusinessRouter = require("./api/UserBusinessRoutes");
const api = express.Router();


api.use("/users", userRouter)
api.use("/orders", orderRouter)
api.use("/inventories", inventoryRouter)
api.use("/locations", locationRouter)
api.use("/productcategories", productCategoryRouter)
api.use("/upload", uploadRouter)
api.use("/kategori-payments", kategoriPaymentRouter)
api.use("/banks", bankRouter)
api.use("/transaksi", transaksiRouter)
api.use("/user-business", userBusinessRouter)


module.exports = api;