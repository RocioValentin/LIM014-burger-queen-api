const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const moongosePaginate = require('mongoose-paginate-v2');

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

userSchema.pre('save', function (next) {
  console.log('estas en bycript');
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// userSchema.pre('save', function (next) {
//   const user = this;
//   if (!user.isModified('password')) return next();

//   bcrypt.hash(user.password, 10, (err, hash) => {
//     if (err) return next(err);
//     user.password = hash;
//     next();
//   });
// });

userSchema.plugin(moongosePaginate);
module.exports = model('User', userSchema);
