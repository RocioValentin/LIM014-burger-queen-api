const Product = require('../models/product');
const {
  Paginate,
  emailOrId,
  isAValidEmail,
  isAWeakPassword,
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
      const findProduct = await Product.findOne({ _id: productId });

      return resp.status(200).json(findProduct);
    } catch (error) {
      return next(404);
    }
  },
  createProducts: async (req, resp, next) => {
    const newProduct = req.body;
    try {
      if (!newProduct) return next(400);
    // const findProduct = await Product.findOne({ name });
    //  if (findProduct) {
    //  return next(40);
    //  }
      // const newProduct = {
      //  name,
      //  price,
      // };
      // if (!isAdmin(req)) return next(400);
      const product = await Product.save(newProduct);
      return resp.json(product);
    } catch (err) {
      next(404);
    }
  },
  updateProduct: async (req, res, next) => {
    if (req.userAuth.roles.admin === false) return next(403);
    const {
      name,
      price,
      image,
      category,
    } = req.body;
    try {
      const productId = req.params.uid;

      await Product.findByIdAndUpdate({ _id: productId }, {
        name,
        price,
        image,
        category,
      });

      const findProduct = await Product.findOne({ _id: productId });
      res.status(200).send(findProduct);
    } catch (err) {
      next(404);
    }
  },
  deleteProduct: async (req, resp, next) => {
    try {
      const productId = req.params.uid;
      const findProduct = await Product.findOne({ _id: productId });
      await Product.findByIdAndDelete({ _id: productId });
      resp.status(200).send(findProduct);
    } catch (err) {
      next(404);
    }
  },
};
