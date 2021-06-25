const Order = require('../models/order');
const Product = require('../models/order');
const { isAdmin } = require('../middleware/auth');
const {
  Paginate,
  emailOrId,
  isAValidEmail,
  isAWeakPassword,
} = require('../utils/utils');

module.exports = {
  getOrders: async (req, resp, next) => {
    try {
      const url = `${req.protocol}://${req.get('host')}${req.path}`;
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const orderPaginate = await Order.paginate({}, options);
      resp.links(Paginate(url, options, orderPaginate));
      return resp.status(200).json(orderPaginate.docs);
    } catch (err) { return next(err); }
  },
  getOrderById: async (req, resp, next) => {
    try {
      const orderId = req.params.uid;
      const findOrder = await Order.findOne({ _id: orderId });

      return resp.status(200).json(findOrder);
    } catch (error) {
      return next(404);
    }
  },
  createOrder: async (req, resp, next) => {
    const {
      userId,
      client,
      products,
    } = req.body;
    // console.log('uuuuuuu', req.body, products);
    try {
      if (!products || products.length === 0) return next(400);
      const newOrder = new Order({
        userId,
        client,
        products: products.map((product) => ({
          qty: product.qty,
          product: product.productId,
        })),
      });
      // product = Product.findOne()

      const populatedOrder = await newOrder
        .populate('products.product')
        .execPopulate();

      // console.log(':(', populatedOrder.products);
      const order = await populatedOrder.save();
      // console.log(':v', order);

      return resp.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },
  updateOrder: async (req, res, next) => {
    const {
      userId,
      client,
      products,
    } = req.body;
    try {
      const orderId = req.params.uid;

      await Order.findByIdAndUpdate({ _id: orderId }, {
        userId,
        client,
        products,
      });

      const findOrder = await Order.findOne({ _id: orderId });
      res.status(200).send(findOrder);
    } catch (err) {
      next(err);
    }
  },
  deleteOrder: async (req, resp, next) => {
    try {
      const orderId = req.params.uid;
      const findOrder = await Order.findOne({ _id: orderId });
      await Order.findByIdAndDelete({ _id: orderId });
      resp.status(200).send(findOrder);
    } catch (err) {
      next(err);
    }
  },

};
