const { Schema, model } = require('mongoose');

// Estrcuturar data de order
const orderSchema = new Schema(
  {
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
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: 'pending',
      required: true,
    },
    dateEntry: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateProcessed: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Order', orderSchema);
