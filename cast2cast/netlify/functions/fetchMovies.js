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
    const response = await axios.get(`${BASE_URL}/person/${actorId}/movie_credits`, {
      params: { api_key: API_KEY },
    });
    if (!response.data || response.data.success === false) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Movie credits not found for this actor." }),
      };
    }
    const movies = response.data.cast
      .filter(
        (movie) =>
          movie.poster_path &&
          movie.release_date &&
          movie.vote_count > 10 &&
          movie.genre_ids && !movie.genre_ids.includes(99)
      )
      .sort((a, b) => b.popularity - a.popularity);
      
    return {
      statusCode: 200,
      body: JSON.stringify(movies),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch movies" }),
    };
  }
};
