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

    const results = new Results(resultsData);
    const matches = matchesData.map((matchData) => new Match(matchData));

    const pastMatches = matches.filter((match) => match.match.status === 'FINISHED');
    const futureMatches = matches.filter((match) => match.match.status === 'SCHEDULED');
    const activeMatches = matches.filter((match) =>
      match.match.status === 'LIVE' ||
      match.match.status === 'IN_PLAY' ||
      match.match.status === 'PAUSED'
    );

    response.status(200).json(
      {
        results: results,
        matches: {
          past: pastMatches,
          future: futureMatches,
          active: activeMatches
        }
      }
    );

  } catch (error) {
    console.error(error.message);
  }
}

// Classes
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

class Results {
  constructor(resultsData) {
    this.totalMatches = resultsData.count;
    this.playedMatches = resultsData.played;
    this.futureMatches = resultsData.count - resultsData.played;
    this.firstMatch = resultsData.first;
    this.lastMatch = resultsData.last;
    this.wins = resultsData.wins;
    this.losses = resultsData.losses;
    this.draws = resultsData.played - (resultsData.wins + resultsData.losses);
  }
}

module.exports = { getTeamMatches };
