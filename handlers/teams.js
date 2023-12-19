const axios = require('axios');
// const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getTeams(request, response) {
  const teamId = request.params.teamId;
  const apiUrl = `https://api.football-data.org/v4/teams`;
  const apiKey = process.env.FB_API_KEY;

  try {
    const headers = {
      'X-Auth-Token': apiKey,
    };

    const teamsResponse = await axios.get(apiUrl, { headers });
    const standingsData = teamsResponse.data;

    console.log('API Response:', standingsData);

    // Map the standings data to TeamStanding instances
    // const teamStandings = standingsData.map((teamData) => new TeamStanding(teamData, teamId));

    // console.log('Processed Team Standings:', teamStandings);

    // // Save the results to MongoDB
    // const savedResult = await saveResultsToMongoDB(teamStandings);

    // response.status(200).json(teamStandings);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};
