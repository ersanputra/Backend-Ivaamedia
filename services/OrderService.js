const { sequelize, Order, User, Business, Marketplace, Customer, Detail, Address } = require('../models');
const { format } = require('date-fns');

class OrderService {
  async createOrder(orderData) {
    const t = await sequelize.transaction();
    try {
        // Check if order number already exists with active status
        const existingOrder = await Order.findOne({
            where: {
                order_number: orderData.order_number,
                active: true
            },
            transaction: t
        });

        if (existingOrder) {
            // Check if any of the SKUs already exist for the existing order
            const existingDetails = await Detail.findAll({
                where: {
                    order_id: existingOrder.id,
                    sku: orderData.details.map(detail => detail.sku)
                },
                transaction: t
            });

            if (existingDetails.length > 0) {
                await t.rollback();
                throw new Error('One or more SKUs already exist for this order.');
            }

            // Create new details for the existing order
            const details = orderData.details.map(detail => ({
                ...detail,
                order_id: existingOrder.id
            }));
            await Detail.bulkCreate(details, { transaction: t });

            await t.commit();
            return existingOrder;
        } else {
            const customer = await Customer.create(orderData.customer, { transaction: t });
            const address = await Address.create({
                ...orderData.address,
                customer_id: customer.id
            }, { transaction: t });

            const order = await Order.create({
                user_id: orderData.user_id,
                business_id: orderData.business_id,
                marketplace_id: orderData.marketplace_id,
                order_id: orderData.order_id,
                order_number: orderData.order_number,
                customer_id: customer.id,
                address_id: address.id,
                status: orderData.status,
                courier: orderData.courier,
                payment_method: orderData.payment_method,
                tracking_number: orderData.tracking_number,
                notes: orderData.notes,
                order_date: orderData.order_date,
                shipping_cost: orderData.shipping_cost,
                product_price: orderData.product_price,
                gross_amount: orderData.gross_amount,
                active: orderData.active || true
            }, { transaction: t });

            // Create multiple details
            const details = orderData.details.map(detail => ({
                ...detail,
                order_id: order.id
            }));
            await Detail.bulkCreate(details, { transaction: t });

            await t.commit();
            return order;
        }
    } catch (error) {
        await t.rollback();
        console.error('Failed to create order:', error);
        throw error;
    }
}



  async getOrderCustom() {
    try {
      const orders = await Order.findAll({
        where: { active: true },
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' },
          { model: Marketplace, as: 'marketplace' },
          { model: Customer, as: 'customer' },
          { model: Detail, as: 'details' }, // Update this line
          { model: Address, as: 'address' }
        ]
      });

      const formattedOrders = orders.map(order => ({
        id: `#${order.order_id}`,
        order: order.marketplace.name,
        numberOrder: order.order_number,
        productName: order.details.map(detail => detail.name).join(', '), // Update this line
        nama: order.customer.name,
        nomer: order.customer.phone_number,
        alamat: order.address.address,
        kecamatan: order.address.sub_district,
        kabupaten: order.address.district,
        provinsi: order.address.province,
        status: order.status,
        courier: order.courier,
        paymentMethod: order.payment_method,
        resi: order.tracking_number,
        notes: order.notes,
        date: format(new Date(order.order_date), 'dd-MM-yyyy - HH:mm'),
        harga: order.product_price,
        gross: `Rp${order.gross_amount.toLocaleString('id-ID')}`,
        action: 'Action'
      }));

      return formattedOrders;
    } catch (error) {
      console.error('Failed to fetch custom orders:', error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await Order.findAll({
        where: { active: true },
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' },
          { model: Marketplace, as: 'marketplace' },
          { model: Customer, as: 'customer' },
          { model: Detail, as: 'details' }, // Update this line
          { model: Address, as: 'address' }
        ]
      });

      // Format tanggal
      const formattedOrders = orders.map(order => ({
        ...order.get(),
        order_date: format(new Date(order.order_date), 'dd-MM-yyyy - HH:mm')
      }));

      return formattedOrders;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const order = await Order.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' },
          { model: Marketplace, as: 'marketplace' },
          { model: Customer, as: 'customer' },
          { model: Detail, as: 'details' }, // Update this line
          { model: Address, as: 'address' }
        ]
      });
      if (!order) {
        throw new Error('Order tidak ditemukan');
      }
      return order;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  async updateOrder(order_id, updateData) {
    const sanitizeNumericFields = (data, fields) => {
        fields.forEach(field => {
            if (data[field] !== undefined) {
                data[field] = parseFloat(data[field].toString().replace(/[^0-9]/g, ''));
            }
        });
    };

    const t = await sequelize.transaction();
    try {
        const order = await Order.findOne({ where: { order_id }, transaction: t });
        if (!order) {
            throw new Error('Order tidak ditemukan');
        }

        // List of fields to sanitize
        const numericFields = ['jumlah', 'shipping_cost', 'product_price', 'gross_amount'];

        // Sanitize numeric fields in updateData
        sanitizeNumericFields(updateData, numericFields);

        // Update customer, detail, and address if they exist in updateData
        if (updateData.customer) {
            await Customer.update(updateData.customer, {
                where: { id: order.customer_id },
                transaction: t
            });
        }

        if (updateData.details) {
            await Promise.all(updateData.details.map(async detailData => {
                await Detail.update(detailData, {
                    where: { id: detailData.id, order_id: order.id },
                    transaction: t
                });
            }));
        }

        if (updateData.address) {
            await Address.update(updateData.address, {
                where: { id: order.address_id },
                transaction: t
            });
        }

        // Ensure gross_amount is not null if it's required
        if (updateData.gross_amount === null || updateData.gross_amount === undefined) {
            updateData.gross_amount = order.gross_amount;
        }

        await Order.update(updateData, {
            where: { order_id },
            transaction: t
        });

        await t.commit();
        return await Order.findOne({
            where: { order_id },
            include: [
                { model: User, as: 'user' },
                { model: Business, as: 'business' },
                { model: Marketplace, as: 'marketplace' },
                { model: Customer, as: 'customer' },
                { model: Detail, as: 'details' }, // Update this line
                { model: Address, as: 'address' }
            ]
        });
    } catch (error) {
        await t.rollback();
        console.error('Failed to update order:', error);
        throw error;
    }
}

  async deleteOrder(id) {
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        throw new Error('Order tidak ditemukan');
      }

      await Order.update({ active: false }, { where: { id } });
      return { message: 'Order berhasil dihapus.' };
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }
}

module.exports = OrderService;
