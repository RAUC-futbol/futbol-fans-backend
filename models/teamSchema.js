const mongoose = require('mongoose');
const { Schema } = mongoose;


const teamSchema = new Schema({
  name: { type: String, default: '' },
  shortName: { type: String, default: '' },
  tla: { type: String, default: '' },
  crest: { type: String, default: '' },
  leagues: [{ type: Schema.Types.ObjectId, ref: 'League' }],
});

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel;
