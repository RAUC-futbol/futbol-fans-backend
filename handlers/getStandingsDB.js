const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getStandingsDB(request, response) {
  try {
    console.log('Handling /standings request');

    const standings = await LeagueStandingsModel.find();
    console.log('DB data: ', standings);

    response.status(200).send(standings);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};

