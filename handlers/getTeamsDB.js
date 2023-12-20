const TeamModel = require('../models/teamSchema');

module.exports = async function getTeamsDB(request, response) {
  try {
    console.log('Handling /teams request');

    const teams = await TeamModel.find();
    // console.log('DB data: ', teams);

    response.status(200).send(teams);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
};
