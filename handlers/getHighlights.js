const axios = require('axios');

module.exports = async function getHighlights(request, response) {
  const eventId = request.params.eventId; // Assuming you want to extract eventId from the URL
  const apiUrl = `https://thesportsdb.com/api/v1/json/3/eventshighlights.php?i=${eventId}`;

  try {
    console.log('Handling /highlights request');

    const apiResponse = await axios.get(apiUrl);
    const highlightsData = apiResponse.data.tvhighlights;
    console.log('API Response: ', highlightsData);
    response.status(200).json(highlightsData);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};
