const axios = require("axios");

const API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = process.env.VITE_TMDB_BASE_URL;

exports.handler = async function (event, context) {
  const movieId = event.queryStringParameters?.movieId;

  if (!movieId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing movieId" }),
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: API_KEY },
    });

    if (!response.data || !response.data.cast) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Cast not found for this movie." }),
      };
    }

    const movies = response.data.cast
      .filter(
        (actor) =>
          actor.profile_path &&
          actor.known_for_department === "Acting"
      )
      .sort((a, b) => b.popularity - a.popularity);

    return {
      statusCode: 200,
      body: JSON.stringify(movies),
    };
  } catch (error) {
    console.error("Fetch error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch cast" }),
    };
  }
};
