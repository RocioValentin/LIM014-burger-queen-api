const Product = require('../models/product');
const {
  Paginate,
  isObjectId,
} = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

module.exports = {
  getProducts: async (req, resp, next) => {
    try {
      const url = `${req.protocol}://${req.get('host')}${req.path}`;
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const productPaginate = await Product.paginate({}, options);
      resp.links(Paginate(url, options, productPaginate));
      return resp.status(200).json(productPaginate.docs);
    } catch (err) { next(err); }
  },
  getProductId: async (req, resp, next) => {
    try {
      const productId = req.params.uid;
      if (!isObjectId(productId)) return next(404);
      const findProduct = await Product.findOne({ _id: productId });
      if (!findProduct) return next(404);
      return resp.status(200).json(findProduct);
    } catch (err) {
      return next(err);
    }
  },
  createProducts: async (req, resp, next) => {
    const { name, price } = req.body;
    try {
      if (Object.keys(req.body).length === 0) return next(400);
      const newProduct = new Product({
        name,
        price,
      });
      const product = await newProduct.save(newProduct);
      return resp.status(200).send({
        _id: product._id,
        name: product.name,
        price: product.price,
      });
    } catch (err) {
      next(err);
    }
  },
  updateProduct: async (req, res, next) => {
    if (req.userAuth.roles.admin === false) return next(403);
    const {
      name,
      price,
    } = req.body;
    try {
      const productId = req.params.uid;
      if (typeof (price) !== 'number') return next(400);
      await Product.findByIdAndUpdate({ _id: productId }, {
        name,
        price,
      });
      const findProduct = await Product.findOne({ _id: productId });
      res.status(200).send(findProduct);
    } catch (err) {
      next(404);
    }
  },
  deleteProduct: async (req, resp, next) => {
    const productId = req.params.uid;
    try {
      if (!isAdmin(req)) return next(403);
      const findProduct = await Product.findOne({ _id: productId });
      await Product.findByIdAndDelete({ _id: productId });
      resp.status(200).send(findProduct);
    } catch (err) {
      next(404);
    }
  },
};
