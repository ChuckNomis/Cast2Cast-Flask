

import axios from "axios";

// Flask Server URL
const BASE_URL = "http://localhost:5000";


//Get random Actor
export const fetchRandomActor = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchRandomActor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching random actor:", error);
    return null;
  }
};


//Get Actor Data by ID
export const fetchActorById = async (actorId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchActor`, {
      params: {actorId},
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching actor with ID ${actorId}:`, error);
    return null;
  }
};

// Fetch movies by actor (filtered & sorted)
export const fetchMoviesByActor = async (actorId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchMovies`, {
      params: {actorId},
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for actor ${actorId}:`, error);
    return [];
  }
};

// Fetch cast by movie (filtered & sorted)
export const fetchCastByMovie = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchCast`,{
      params: {movieId},
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching cast for movie ${movieId}:`, error);
    return [];
  }
};
