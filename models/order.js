const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const moongosePaginate = require('mongoose-paginate-v2');
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
    products: [{
      qty: {
        type: Number,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    }],
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
orderSchema.plugin(moongosePaginate);
module.exports = model('Order', orderSchema);
