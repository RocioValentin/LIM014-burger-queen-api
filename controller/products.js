const Product = require('../models/product');

module.exports = {
  getProducts: async (req, resp, next) => {
    try {
      const url = `${req.protocol}://${req.get('host')}${req.path}`;
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const productPaginate = await Product.paginate({}, options);
      resp.links({
        first: `${url}?limit=${options.limit}&page=${1}`,
        prev: `${url}?limit=${options.limit}&page=${options.page - 1}`,
        next: `${url}?limit=${options.limit}&page=${options.page + 1}`,
        last: `${url}?limit=${options.limit}&page=${productPaginate.totalPages}`,
      });
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
    const {
      name,
      price,
      image,
      category,
    } = req.body;
    try {
      if (!name || !price || !image || !category) return next(400);

      const findProduct = await Product.findOne({ name });
      if (findProduct) {
        return next(403);
      }
      const newProduct = new Product({
        name,
        price,
        image,
        category,
      });

      const product = await newProduct.save(newProduct);
      resp.status(200).send({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        dateEntry: product.dateEntry,
      });
    } catch (err) {
      next(err);
    }
  },
  updateProduct: async (req, res, next) => {
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
      next(err);
    }
  },
  deleteProduct: async (req, resp, next) => {
    try {
      const productId = req.params.uid;
      const findProduct = await Product.findOne({ _id: productId });
      await Product.findByIdAndDelete({ _id: productId });
      resp.status(200).send(findProduct);
    } catch (err) {
      next(err);
    }
  },
};
