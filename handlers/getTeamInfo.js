const express = require('express');
const axios = require('axios');
const teamIdsByLeague = require('../config/team-ids');
const TeamInfo = require('./teamInfoClass');
const TeamModel = require('../models/teamSchema');

const router = express.Router();
const apiUrl = 'https://api.football-data.org/v4/teams';
const apiKey = process.env.FB_API_KEY;

async function getTeamInfo(teamId) {
  try {
    const headers = {
      'X-Auth-Token': apiKey,
    };

    const url = `${apiUrl}/${teamId}`;
    const response = await axios.get(url, { headers });
    console.log('API Response:', response.data);
    if (response.data) {
      const teamInfo = new TeamInfo(response.data);
      console.log('Shaped Team Info:', teamInfo);


      // Save or update reshaped team information in MongoDB
      await TeamModel.findOneAndUpdate(
        { id: teamInfo.id }, // Query
        { $set: teamInfo }, // Update with the reshaped team info
        { upsert: true, new: true } // Upsert and return the modified document
      );
      return teamInfo;
    } else {
      console.error('Error in getTeamInfo: Empty response data');
      return null;
    }
  } catch (error) {
    console.error(`Error for teamId ${teamId}:`, error.message);
    console.log('Full API Response:', error.response.data);
    return null;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAllTeamInfo(leagueCode) {
  const teamIds = teamIdsByLeague[leagueCode] || [];
  const delayBetweenRequests = 6000;

  const allTeamInfo = [];
  for (const teamId of teamIds) {
    const teamInfo = await getTeamInfo(teamId);
    if (teamInfo) {
      allTeamInfo.push(teamInfo);
    }

    // Introduce a delay before the next request
    await sleep(delayBetweenRequests);
  }

  return allTeamInfo;
}

// Define a route that triggers the logic
router.get('/:leagueCode', async (req, res) => {
  const { leagueCode } = req.params;

  try {
    const teamInfoArray = await getAllTeamInfo(leagueCode);
    res.json({ success: true, teamInfoArray });
  } catch (error) {
    console.error(`Error for leagueCode ${leagueCode}:`, error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
