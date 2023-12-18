const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a Mongoose schema for league results
const leagueResultsSchema = new Schema({
  title: String,
  standings: [
    {
      team_name: String,
      team_thumbnail: String,
      pos: Number,
      mp: Number,
      w: Number,
      d: Number,
      l: Number,
      gf: Number,
      ga: Number,
      gd: Number,
      pts: Number,
      last_5: [String],
    },
  ],
});

const LeagueResultModel = mongoose.model('LeagueResult', leagueResultsSchema);

module.exports = LeagueResultModel;
