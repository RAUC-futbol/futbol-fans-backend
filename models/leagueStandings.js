const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a Mongoose schema for league standings
const leagueStandingsSchema = new Schema({
  league: { type: String, default: ''},
  teamIds: [{ type: Number }],
  teamInstances: [
    {
      id: { type: Number },
      name: { type: String, default: '' },
      crest: { type: String, default: '' },
      tla: { type: String, default: '' },
      founded: { type: Number },
      address: { type: String, default: '' },
      coachName: { type: String, default: '' },
      runningCompetitions: [
        {
          id: { type: Number },
          name: { type: String, default: '' },
          code: { type: String, default: '' },
          type: { type: String, default: '' },
          emblem: { type: String, default: '' },
        },
      ],
      squad: [
        {
          id: { type: Number },
          name: { type: String, default: '' },
          position: { type: String, default: '' },
          nationality: { type: String, default: '' },
        },
      ],
    },
  ],
  teamStandings: [
    {
      league: {
        code: { type: String, default: '' },
      },
      standings: [
        {
          position: { type: Number, default: 0 },
          id: { type: Number, default: 0 },
          name: { type: String, default: '' },
          tla: { type: String, default: '' },
          crest: { type: String, default: '' },
          playedGames: { type: Number, default: 0 },
          won: { type: Number, default: 0 },
          draw: { type: Number, default: 0 },
          lost: { type: Number, default: 0 },
          points: { type: Number, default: 0 },
          goalsFor: { type: Number, default: 0 },
          goalsAgainst: { type: Number, default: 0 },
          goalDifference: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

const LeagueStandingsModel = mongoose.model(
  'LeagueStandings',
  leagueStandingsSchema
);

module.exports = LeagueStandingsModel;
