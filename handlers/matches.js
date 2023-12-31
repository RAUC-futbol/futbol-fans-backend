const axios = require('axios');

const apiKey = process.env.FB_API_KEY;
const headers = {
  'X-Auth-Token': apiKey,
};

async function getTeamMatches(request, response) {
  const teamId = request.params.teamId;
  let apiUrl = `https://api.football-data.org/v4/teams/${teamId}/matches`;

  // filter matches by season, competition, or date range
  const query = request.query;
  const params = {
    season: query.season, // expects year 'YYYY'
    competitions: query.competition, // expects competition id
    dateFrom: query.dateFrom, // expects date 'YYYY-MM-DD'
    dateTo: query.dateTo // expects date 'YYYY-MM-DD'
  };

  try {

    // raw response from football-data.org API
    const axiosResponse = await axios.get(apiUrl, { headers, params });
    const resultsData = axiosResponse.data.resultSet;
    const matchesData = axiosResponse.data.matches;
    // shape matches data with classes
    const results = new TeamResults(resultsData);
    const matches = matchesData.map((matchData) => new Match(matchData));
    // sort matches by past, future, and current
    const pastMatches = matches.filter((match) => match.match.status === 'FINISHED');
    const futureMatches = matches.filter((match) => match.match.status === 'SCHEDULED');
    const activeMatches = matches.filter((match) =>
      match.match.status === 'LIVE' ||
      match.match.status === 'IN_PLAY' ||
      match.match.status === 'PAUSED'
    );

    // response with results totals and sorted matches
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

async function getCompetitionMatches(request, response) {
  const competitionId = request.params.competitionId;
  let apiUrl = `https://api.football-data.org/v4/competitions/${competitionId}/matches`;

  // filter matches by season, matchday, or date range
  const query = request.query;
  const params = {
    season: query.season, // expects year 'YYYY'
    matchday: query.matchday, // expects matchday integer
    dateFrom: query.dateFrom, // expects date 'YYYY-MM-DD'
    dateTo: query.dateTo // expects date 'YYYY-MM-DD'
  };

  try {

    // raw response from football-data.org API
    const axiosResponse = await axios.get(apiUrl, { headers, params });
    const resultsData = axiosResponse.data.resultSet;
    const matchesData = axiosResponse.data.matches;
    // shape matches data with classes
    const results = new CompetitionResults(resultsData);
    const matches = matchesData.map((matchData) => new Match(matchData));
    // sort matches by past, future, and current
    const pastMatches = matches.filter((match) => match.match.status === 'FINISHED');
    const futureMatches = matches.filter((match) => match.match.status === 'SCHEDULED');
    const activeMatches = matches.filter((match) =>
      match.match.status === 'LIVE' ||
      match.match.status === 'IN_PLAY' ||
      match.match.status === 'PAUSED'
    );

    // response with results totals and sorted matches
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

class TeamResults {
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

class CompetitionResults {
  constructor(resultsData) {
    this.totalMatches = resultsData.count;
    this.playedMatches = resultsData.played;
    this.firstMatch = resultsData.first;
    this.lastMatch = resultsData.last;
  }
}

module.exports = { getTeamMatches, getCompetitionMatches };
