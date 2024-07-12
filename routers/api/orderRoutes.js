const express = require('express');
const OrderController = require('../../controllers/OrderController');
const UploadExcelController = require('../../controllers/UploadExcelController');

const orderRouter = express.Router();
const orderController = new OrderController();
const uploadExcelController = new UploadExcelController();

orderRouter.get('/custom', orderController.getOrderCustom.bind(orderController)); // Pastikan ini didefinisikan sebelum /:id
orderRouter.post('/', orderController.createOrder.bind(orderController));
orderRouter.get('/', orderController.getAllOrders.bind(orderController));
orderRouter.get('/:id', orderController.getOrderById.bind(orderController));
orderRouter.put('/:order_id', orderController.updateOrder.bind(orderController));
orderRouter.delete('/:id', orderController.deleteOrder.bind(orderController));

// Tambahkan rute unggahan
orderRouter.post('/upload/shopee', uploadExcelController.getUploadMiddleware(), uploadExcelController.uploadFileShopee.bind(uploadExcelController));
orderRouter.post('/upload/tiktok', uploadExcelController.getUploadMiddleware(), uploadExcelController.uploadFileTiktok.bind(uploadExcelController));

module.exports = orderRouter;
