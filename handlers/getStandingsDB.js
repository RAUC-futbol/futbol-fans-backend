const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getStandingsDB(request, response) {
  try {
    console.log('Handling /standings/:leagueCode request');

    const leagueCode = request.params.leagueCode;

    // Use MongoDB's $elemMatch to filter based on league code
    const standings = await LeagueStandingsModel.find({
      'teamStandings.league.code': leagueCode,
    });

    const goodies = [];

    for (let standing of standings) {
      for (let teamStanding of standing.teamStandings) {
        // Assuming you want to include all teams in the league standings
        for (let standingInfo of teamStanding.standings) {
          goodies.push({
            leagueCode: teamStanding.league.code,
            team: standingInfo,
          });
        }
      }
    }

    response.status(200).send(goodies);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};

