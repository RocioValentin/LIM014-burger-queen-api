const { Schema, model } = require('mongoose');
const productSchema = require('./products.js');

// Estrcuturar data de order
const orderSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    products: [
      {
        qty: {
          type: Number,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    status: {
      type: String,
      required: true,
    },
    dateEntry: {
      type: new Date(),
      required: true,
    },
    dateProcessed: {
      type: new Date(),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.export = model('order', orderSchema);
