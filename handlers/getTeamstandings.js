const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getTeamStandings(request, response) {
  try {
    console.log('Handling /standings/team request');

    const teamName = request.params.teamName;
    const goodies = [];

    // Use MongoDB's $elemMatch to filter based on team name
    const standings = await LeagueStandingsModel.find({
      teamInstances: {
        $elemMatch: {
          name: teamName,
        },
      },
    });

    // const standings = await LeagueStandingsModel.find();
    for (let standing of standings) {
      for (let team of standing.teamInstances) {
        if (team.name === teamName) {
          goodies.push(team);
        }
        console.log(team.name);
      }
    }

    response.status(200).send(goodies);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
