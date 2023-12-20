const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, default: '', unique: true }
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
