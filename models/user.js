const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, default: '', unique: true },
    name: { type: String, default: '' },
    favoriteLeague: { type: String, default: '' },
    favoriteTeam: { type: String, default: '' }
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
