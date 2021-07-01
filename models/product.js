const { Schema, model } = require('mongoose');
const moongosePaginate = require('mongoose-paginate-v2');

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
      type: String,
    },
    type: {
      type: String,
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(moongosePaginate);
module.exports = model('Product', productSchema);
