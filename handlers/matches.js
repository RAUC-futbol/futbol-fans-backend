const axios = require('axios');

const apiKey = process.env.FB_API_KEY;
const headers = {
  'X-Auth-Token': apiKey,
};

async function getTeamMatches(request, response) {
  const teamId = request.params.teamId;
  const apiUrl = `https://api.football-data.org/v4/teams/${teamId}/matches?status=SCHEDULED`;

  try {

    const axiosResponse = await axios.get(apiUrl, { headers });
    const matchesData = axiosResponse.data;

    response.status(200).json(matchesData);

  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { getTeamMatches };
