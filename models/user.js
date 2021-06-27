const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const moongosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  __v: { type: Number, select: false },
  email: {
    type: String,
    // validate: {
    // validator: (email) => /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email),
    // message: (props) => `${props.value} is not a valid email`,
    // },
    required: true,
    lowercase: true,
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

// Encriptar contraseña cuando sea guardado
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Encriptar contraseña cuando sea actualizado
userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  if (!user._update.$set.password) return next();
  bcrypt.hash(user._update.$set.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    user._update.$set.password = passwordHash;
    next();
  });
});

userSchema.plugin(moongosePaginate);
module.exports = model('User', userSchema);
