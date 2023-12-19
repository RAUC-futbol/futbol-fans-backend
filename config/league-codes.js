const leagueData = [
  ['Comp-Id', 'League-Code', 'Caption', 'Country/Continent'],
  [2021, 'PL', 'Premier League', 'England'], // free
  [2018, 'EC', 'European Championship', 'Europe'], // free
  [2001, 'CL', 'UEFA Champions League', 'Europe'], // free
  [2015, 'FL1', 'Ligue 1', 'France'], // free
  [2002, 'BL1', 'Bundesliga', 'Germany'], // free
  [2019, 'SA', 'Serie A', 'Italy'], // free
  [2003, 'DED', 'Eredivisie', 'Netherlands'], // free
  [2017, 'PPL', 'Primeira Liga', 'Portugal'], // free
  [2014, 'PD', 'Primera Division', 'Spain'], // free
  [2000, 'WC', 'FIFA World Cup', 'World'], // free
];

const headers = leagueData[0];

const leagues = leagueData.slice(1).reduce((obj, row) => {
  const leagueObj = row.reduce((league, value, index) => {
    league[headers[index]] = value;
    return league;
  }, {});

  obj[leagueObj['League-Code']] = leagueObj;

  return obj;
}, {});

console.log(leagues);

module.exports = leagues;
