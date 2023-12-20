const TeamModel = require('../models/teamSchema');

module.exports = async function getTeamsDictionary(request, response) {
  try {
    console.log('Handling /teams/dictionary request');

    const teams = await TeamModel.find();

    // Map teams to the dictionary format
    const dictionary = teams.map((team) => ({
      id: team.id,
      name: team.name,
      crest: team.crest,
      runningCompetitions: team.runningCompetitions.map((competition) => ({
        id: competition.id,
        name: competition.name,
      })),
    }));

    // Log or send the dictionary as a response
    console.log('Dictionary:', dictionary);
    response.status(200).send(dictionary);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
