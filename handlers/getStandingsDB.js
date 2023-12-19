const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getStandingsDB(request, response) {
  try {
    console.log('Handlings /standings request');
    // const filterQuery = {};
    const standings = await LeagueStandingsModel.find();
    console.log('Standings retrieved from db: ', standings);
    response.status(200).send(standings);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
