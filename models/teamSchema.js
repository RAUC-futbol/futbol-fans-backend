const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  id: { type: Number },
  name: { type: String, default: '' },
  crest: { type: String, default: '' },
  tla: { type: String, default: '' },
  founded: { type: Number },
  address: { type: String, default: '' },
  runningCompetitions: [
    {
      id: { type: Number },
      name: { type: String, default: '' },
      code: { type: String, default: '' },
      type: { type: String, default: '' },
      emblem: { type: String, default: '' },
    },
  ],
  coach: {
    name: { type: String, default: '' },
  },
  squad: [
    {
      id: { type: Number },
      name: { type: String, default: '' },
      position: { type: String, default: '' },
      nationality: { type: String, default: '' },
    },
  ],
});

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel;
