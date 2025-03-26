const axios = require("axios");
const actorsData = require("./actors.json");


const API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = process.env.VITE_TMDB_BASE_URL;

const excludedNationalities = ["Japan", "India", "South Korea", "China", "Pakistan"];

exports.handler = async function(event, context) {
  let actor = null;
  let attempts = 0;

  while (!actor && attempts < 10) {
    try {
      const randomIndex = Math.floor(Math.random() * actorsData.actors.length);
      const actorId = actorsData.actors[randomIndex];

      const response = await axios.get(`${BASE_URL}/person/${actorId}`, {
        params: {
          api_key: API_KEY,
        },
      });

      const data = response.data;

      if (
        data &&
        data.profile_path &&
        data.place_of_birth &&
        !excludedNationalities.some((country) => data.place_of_birth.includes(country))
      ) {
        actor = data;
      }
    } catch (error) {
      console.error("Fetch actor failed:", error.message);
    }

    attempts++;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(actor),
  };
};
