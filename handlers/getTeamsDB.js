const TeamModel = require('../models/teamSchema');

module.exports = async function getTeamsDB(request, response) {
  try {
    console.log('Handling /teams request');

    const teamId = request.params.teamId;

    const query = {id:teamId};

    const teams = await TeamModel.find(query);
    // console.log('DB data: ', teams);

    response.status(200).send(teams);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
