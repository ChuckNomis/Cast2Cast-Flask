const axios = require("axios");

const API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = process.env.VITE_TMDB_BASE_URL;

exports.handler = async function (event, context) {
  const actorId = event.queryStringParameters?.actorId;

  if (!actorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing actorId" }),
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/person/${actorId}`, {
      params: { api_key: API_KEY },
    });
    const actor = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify(actor),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch cast" }),
    };
  }
};
