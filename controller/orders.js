const Order = require('../models/order');

module.exports = {
  getOrders: async (req, resp, next) => {},
  getOrderById: async (req, resp, next) => {},
  createOrder: async (req, resp, next) => {
    const {
      userId,
      client,
      products,
    } = req.body;
    try {
      if (!userId || !client) return next(400);

      const findOrder = await Order.findOne({ userId });
      if (findOrder) {
        return next(403);
      }
      const newOrder = new Order({
        userId,
        client,
        products,
      });

      const order = await newOrder.save(newOrder);
      resp.status(200).send(order);
    } catch (err) {
      next(err);
    }
  },
  updateOrder: async (req, res, next) => {},
  deleteOrder: async (req, resp, next) => {},

};
