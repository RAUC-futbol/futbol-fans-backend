const axios = require('axios');
// const LeagueResultModel = require('../models/leagueResults');

module.exports = async function getHighlights(request, response) {
  const apiUrl = 'https://serpapi.com/search.json';
  const apiKey = process.env.SERP_API_KEY;

  try {
    const { q: queryString } = request.query;

    // Fetch data from SerpApi using the queryString
    const params = {
      q: queryString,
      location: 'austin, texas, united states',
      api_key: apiKey,
    };

    const resultResponse = await axios.get(apiUrl, { params });

    // Get the sports_results data
    const sportsResults = resultResponse.data.sports_results;

    // Log and send the structured data in the response
    console.log(sportsResults);

    // Save the results to MongoDB (if needed)
    // const savedResult = await saveResultsToMongoDB(sportsResults);

    // Log and send the structured data in the response (or savedResult if saving to MongoDB)
    // console.log(savedResult);
    response.status(200).json(sportsResults);
  } catch (error) {
    console.error('Error fetching results:', error.message);
    response.status(500).send('Internal Server Error');
  }
};

// class
// class LeagueResults {
//   constructor(data) {
//     this.title = data.title;
//     this.standings = data.league.standings.map((teamData) => ({
//       team_name: teamData.team.name,
//       team_thumbnail: teamData.team.thumbnail,
//       pos: teamData.pos,
//       mp: teamData.mp,
//       w: teamData.w,
//       d: teamData.d,
//       l: teamData.l,
//       gf: teamData.gf,
//       ga: teamData.ga,
//       gd: teamData.gd,
//       pts: teamData.pts,
//       last_5: [...teamData.last_5],
//     }));
//   }
// }

// Function to validate and extract a valid league from the queryString
// function getValidLeague(queryString, allowedLeagues) {
//   const sanitizedQueryString = queryString.toLowerCase().trim();
//   const foundLeague = allowedLeagues.find((league) =>
//     sanitizedQueryString.includes(league.toLowerCase())
//   );

//   if (!foundLeague) {
//     throw new Error('Invalid or missing league parameter.');
//   }

//   return foundLeague;
// }

// // Function to save results to MongoDB
// async function saveResultsToMongoDB(resultsInstance) {
//   const resultModel = new LeagueResultModel(resultsInstance);
//   return resultModel.save();
// }
