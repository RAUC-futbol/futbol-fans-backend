const axios = require('axios');
const leagues = require('../config/league-codes');
const teamIdsByLeague = require('../config/team-ids');
// const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getTeams(request, response) {
  const teamId = request.params.teamId;
  const apiUrl = 'https://api.football-data.org/v4/teams';
  const apiKey = process.env.FB_API_KEY;

  try {
    const headers = {
      'X-Auth-Token': apiKey,
    };

    // Extract additional query parameters
    const { competitions } = request.query;

    // Build dynamic filters
    const filters = [];

    if (competitions) {
      const validCompetitionIds = competitions
        .split(',')
        .filter((compId) => leagues[compId]);
      if (validCompetitionIds.length > 0) {
        filters.push(`competitions=${validCompetitionIds.join(',')}`);
      }
    }

    // Log the constructed URL
    const urlWithFilters = `${apiUrl}/${teamId}?${filters.join('&')}`;
    console.log('Request URL:', urlWithFilters);

    const teamsResponse = await axios.get(urlWithFilters, { headers });
    const standingsData = teamsResponse.data;

    console.log('API Response:', standingsData);

    response.status(200).json(standingsData);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};
