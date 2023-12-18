const TeamModel = require('./teamSchema');

// Assume leagueStandingsId is the _id of the LeagueStandings document
const leagueStandingsId = 'your-league-standings-id';

const teamData = {
  name: 'Example Team',
  shortName: 'ET',
  tla: 'EXM',
  crest: 'https://example.com/team-crest.png',
  leagues: [leagueStandingsId],
};

const team = new TeamModel(teamData);
team.save();
