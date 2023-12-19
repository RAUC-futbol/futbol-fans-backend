const axios = require('axios');
const LeagueStandingsModel = require('../models/leagueStandings');

module.exports = async function getStandings(request, response) {
  const leagueCode = request.params.leagueCode.toUpperCase();
  const apiUrl = `http://api.football-data.org/v4/competitions/${leagueCode}/standings`;
  const apiKey = process.env.FB_API_KEY;

  try {
    const headers = {
      'X-Auth-Token': apiKey,
    };

    const standingsResponse = await axios.get(apiUrl, { headers });
    const standingsData = standingsResponse.data.standings;
    
    console.log('API Response:', standingsData);

    // Map the standings data to TeamStanding instances
    const teamStandings = standingsData.map((teamData) => new TeamStanding(teamData, leagueCode));

    console.log('Processed Team Standings:', teamStandings);

    // Save the results to MongoDB
    const savedResult = await saveResultsToMongoDB(teamStandings);

    response.status(200).json(teamStandings);
  } catch (error) {
    console.error('Error:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};


// class
class TeamStanding {
  constructor(teamData, leagueCode) {
    try {
      console.log('Raw data:', teamData);
      this.league = { code: leagueCode };
      this.standings = [];

      const standings = teamData.table || (teamData.standings && teamData.standings[0]?.table);

      if (standings && standings.length > 0) {
        this.standings = standings.map((standing) => {
          const teamInfo = standing.team || (standing.team[0] && standing.team[0].team);

          const teamId = teamInfo?.id || (teamInfo.team && teamInfo.team.id) || 0;
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
async function saveResultsToMongoDB(teamStandings) {
  const leagueCode = teamStandings[0]?.league?.code; // Assuming the league code is the same for all standings

  if (!leagueCode) {
    console.error('League code not found in team standings.');
    return;
  }

  try {
    const leagueDocument = {
      league: { code: leagueCode },
      standings: teamStandings.map((teamStanding) => teamStanding.standings).flat(),
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


  
