const axios = require('axios');

module.exports = async function getHighlights(request, response) {
  const leagueCode = request.params.leagueCode;
  const apiUrl = `https://thesportsdb.com/api/v1/json/3/eventshighlights.php?${leagueCode}`;

  try {
    const apiResponse = await axios.getAdapter(apiUrl);
    const highlightsData = apiResponse.data.tvhighlights;
    console.log('API Response ')
  } catch(error){
    console.error(error.message);
  }
};
