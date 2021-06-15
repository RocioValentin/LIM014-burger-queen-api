const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      url: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dateEntry: {
      type: new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.export = model('products', productSchema);
