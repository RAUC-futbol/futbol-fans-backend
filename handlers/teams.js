const axios = require('axios');
const leagues = require('../config/league-codes');

module.exports = async function getTeams(request, response) {
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

    // Construct the URL based on whether a teamId is provided or not
    const url = request.params.teamId ? `${apiUrl}/${request.params.teamId}?${filters.join('&')}` : `${apiUrl}?${filters.join('&')}`;
    
    // Log the constructed URL
    console.log('Request URL:', url);

    const teamsResponse = await axios.get(url, { headers });
    const teamData = teamsResponse.data;

    // If a teamId is provided, create an instance of TeamInfo using the provided teamData and teamId
    const teamInfo = request.params.teamId ? new TeamInfo(teamData, request.params.teamId) : teamData;

    // Send the structured team information in the response
    response.status(200).json(teamInfo);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

// class
class TeamInfo {
  constructor(teamData) {
    try {
      this.id = teamData.id;
      this.name = teamData.name;
      this.crest = teamData.crest;
      this.tla = teamData.tla;
      this.founded = teamData.founded;
      this.address = teamData.address;
      this.runningCompetitions = teamData.runningCompetitions.map(
        (competition) => {
          return {
            id: competition.id,
            name: competition.name,
            code: competition.code,
            type: competition.type,
            emblem: competition.emblem,
          };
        }
      );
      this.coachName = `${teamData.coach.firstName} ${teamData.coach.lastName}`;
      this.squad = teamData.squad.map((player) => {
        return {
          id: player.id,
          name: player.name,
          position: player.position,
          nationality: player.nationality,
        };
      });
    } catch (error) {
      console.error('Error in TeamInfo constructor: ', error.message);
    }
  }
}
