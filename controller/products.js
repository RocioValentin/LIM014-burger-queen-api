const Product = require('../models/product');

module.exports = {
  getProducts: async (req, resp, next) => {
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
    console.log('fechaa', Date.now());
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
