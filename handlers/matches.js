const axios = require('axios');

const apiKey = process.env.FB_API_KEY;
const headers = {
  'X-Auth-Token': apiKey,
};

async function getTeamMatches(request, response) {
  const teamId = request.params.teamId;
  const apiUrl = `https://api.football-data.org/v4/teams/${teamId}/matches`;

  try {

    const axiosResponse = await axios.get(apiUrl, { headers });
    const resultsData = axiosResponse.data.resultSet;
    const matchesData = axiosResponse.data.matches;
    const matches = matchesData.map((matchData) => new Match(matchData));

    response.status(200).json(matches);


  } catch (error) {
    console.error(error.message);
  }
}

// Class for matches
class Match {
  constructor(matchData) {
    // match
    this.match = {
      id: matchData.id,
      name: `${matchData.homeTeam.name} vs. ${matchData.awayTeam.name}`,
      matchday: matchData.matchday,
      date: matchData.utcDate,
      status: matchData.status
    };
    // result
    this.result = {
      winner: matchData.score.winner,
      duration: matchData.score.duration,
      homeScore: matchData.score.fullTime.home,
      awayScore: matchData.score.fullTime.away
    };
    // home team
    this.homeTeam = {
      id: matchData.homeTeam.id,
      name: matchData.homeTeam.name,
      tla: matchData.homeTeam.tla,
      crest: matchData.homeTeam.crest
    };
    // away team
    this.awayTeam = {
      id: matchData.awayTeam.id,
      name: matchData.awayTeam.name,
      tla: matchData.awayTeam.tla,
      crest: matchData.awayTeam.crest
    };
    // competition (league)
    this.competition = {
      id: matchData.competition.id,
      name: matchData.competition.name,
      code: matchData.competition.code,
      emblem: matchData.competition.emblem
    };
    // season (year)
    this.season = {
      id: matchData.season.id,
      startDate: matchData.season.startDate,
      endDate: matchData.season.endDate
    };
  }
}

module.exports = { getTeamMatches };

// {
//   results: {},
//   matches: {
//     past: [],
//     scheduled: [],
//     live: []
//   }
// }
