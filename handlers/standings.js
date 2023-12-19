const axios = require('axios');
const LeagueStandingsModel = require('../models/leagueStandings');
const TeamInfo = require('./teamInfoClass');

module.exports = async function getStandings(request, response) {
  const leagueCode = request.params.leagueCode.toUpperCase();
  const standingsApiUrl = `http://api.football-data.org/v4/competitions/${leagueCode}/standings`;
  const teamsApiUrl = `http://api.football-data.org/v4/competitions/${leagueCode}/teams`;
  const apiKey = process.env.FB_API_KEY;

  try {
    const headers = {
      'X-Auth-Token': apiKey,
    };

    // Fetch standings
    const standingsResponse = await axios.get(standingsApiUrl, { headers });
    const standingsData = standingsResponse.data.standings;

    console.log('API Response:', standingsData);

    // Map the standings data to TeamStanding instances
    const teamStandings = standingsData.map(
      (teamData) => new TeamStanding(teamData, leagueCode)
    );

    console.log('Processed Team Standings:', teamStandings);

    // Fetch teams
    const teamsResponse = await axios.get(teamsApiUrl, { headers });
    const teamsData = teamsResponse.data.teams;

    console.log('Teams API Response:', teamsData);

    // Extract teamIds from teamsData
    const teamIds = teamsData.map((team) => team.id);
    console.log(teamIds);

    // Map team data
    const teamInstances = teamsData.map((team) => new TeamInfo(team));
    console.log(teamInstances);

    // Save the results to MongoDB
    const savedResult = await saveResultsToMongoDB(teamIds, teamInstances, teamStandings);

    response.status(200).json({ teamIds, teamInstances, teamStandings });
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

// class
class TeamStanding {
  constructor(teamData, leagueCode) {
    try {
      // console.log('Raw data:', teamData);
      this.league = { code: leagueCode };
      this.standings = [];

      const standings =
        teamData.table || (teamData.standings && teamData.standings[0]?.table);

      if (standings && standings.length > 0) {
        this.standings = standings.map((standing) => {
          const teamInfo =
            standing.team || (standing.team[0] && standing.team[0].team);

          const teamId =
            teamInfo?.id || (teamInfo.team && teamInfo.team.id) || 0;
          const crest = `https://crests.football-data.org/${teamId}.png`;

          return {
            position: standing.position || 0,
            id: teamId,
            name: teamInfo?.name || '',
            tla: teamInfo?.tla || '',
            crest: crest,
            playedGames: standing.playedGames || 0,
            won: standing.won || 0,
            draw: standing.draw || 0,
            lost: standing.lost || 0,
            points: standing.points || 0,
            goalsFor: standing.goalsFor || 0,
            goalsAgainst: standing.goalsAgainst || 0,
            goalDifference: standing.goalDifference || 0,
          };
        });
      } else {
        console.error('Unexpected data structure:', teamData);
      }
    } catch (error) {
      console.error('Error in TeamStanding constructor:', error.message);
    }
  }
}

// Function to save results to MongoDB
async function saveResultsToMongoDB(teamIds, teamInstances, teamStandings) {
  const leagueCode = teamStandings[0]?.league?.code; // Assuming the league code is the same for all standings

  if (!leagueCode) {
    console.error('League code not found in team standings.');
    return;
  }

  try {
    const leagueDocument = {
      league: leagueCode,
      teamIds: teamIds,
      teamInstances: teamInstances,
      teamStandings: teamStandings.map((teamStanding) => {
        return {
          league: { code: leagueCode },
          standings: teamStanding.standings,
        };
      }),
    };

    const resultModel = new LeagueStandingsModel(leagueDocument);
    const savedResult = await resultModel.save();
    console.log('Saved to MongoDB:', savedResult);
    return savedResult;
  } catch (error) {
    console.error('Error saving to MongoDB:', error.message);
    throw error;
  }
}
