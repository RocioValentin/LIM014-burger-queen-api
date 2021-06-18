const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const moongosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  __v: { type: Number, select: false },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.plugin(moongosePaginate);
module.exports = model('User', userSchema);
