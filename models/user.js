const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, default: '', unique: true },
    name: { type: String, default: '' },
    favLeague: { type: Number, default: 2021 },
    favTeam: { type: Number, default: 57 }
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
