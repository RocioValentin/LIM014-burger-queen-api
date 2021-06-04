const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = model('User', userSchema);
