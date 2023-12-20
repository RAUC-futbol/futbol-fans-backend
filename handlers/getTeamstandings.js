const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getTeamStandings(request, response) {
  try {
    console.log('Handling /standings/:leagueCode/:teamName request');

    const leagueCode = request.params.leagueCode;
    const teamName = request.params.teamName;
    const goodies = [];

    // Use MongoDB's $elemMatch to filter based on team name
    const standings = await LeagueStandingsModel.find({
        'teamStandings.league.code': leagueCode,
        'teamStandings.standings': {
          $elemMatch: {
            name: teamName,
          },
        },
      });

    // const standings = await LeagueStandingsModel.find();
    for (let standing of standings) {
        for (let teamStanding of standing.teamStandings) {
          const matchingStanding = teamStanding.standings.find(
            (standingInfo) => standingInfo.name === teamName
          );
  
          if (matchingStanding) {
            goodies.push({
              leagueCode: teamStanding.league.code,
              team: matchingStanding,
            });
          }
  
          console.log(matchingStanding?.name);
        }
      }

    response.status(200).send(goodies);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
