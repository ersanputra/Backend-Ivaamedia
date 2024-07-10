const OrderService = require('../services/OrderService');
const orderService = new OrderService();

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json({
        status: 'success',
        data: orders,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getOrderCustom(req, res) {
    try {
      const orders = await orderService.getOrderCustom();
      res.status(200).json({
        status: 'success',
        data: orders,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await orderService.updateOrder(req.params.order_id, req.body);
      res.status(200).json({
        status: 'success',
        data: order,
      });
    } catch (error) {
      console.error('Failed to update order:', error); // Improved error logging
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async deleteOrder(req, res) {
    try {
      await orderService.deleteOrder(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Order successfully deactivated.',
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
