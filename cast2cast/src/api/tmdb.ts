import axios from "axios";
import actorsData from "../assets/actors.json";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Function to filter and sort movies by popularity
const filterAndSortMovies = (movies: any[]) => {
  return movies
    .filter(
      (movie) =>
        movie.poster_path && // Must have an image
        movie.release_date && // Must have a release date
        movie.vote_count > 10 &&// Must have at least 10 votes
        movie.genre_ids && !movie.genre_ids.includes(99) // Exclude documentaries
    )
    .sort((a, b) => b.popularity - a.popularity); // Sort by popularity (descending)
};

// Function to filter and sort actors by popularity
const filterAndSortActors = (cast: any[]) => {
  return cast
    .filter(
      (actor) =>
        actor.profile_path && // Must have a profile picture
        actor.known_for_department === "Acting" // Must be an actor (not a director, writer, etc.)
    )
    .sort((a, b) => b.popularity - a.popularity); // Sort by popularity (descending)
};



export const fetchRandomActor = async () => {
  try {
    let actor = null;
    let attempts = 0;
    const excludedNationalities = ["Japan", "India", "South Korea", "China", "Pakistan"];

    while (!actor && attempts < 10) { // Max 10 retries
      const randomIndex = Math.floor(Math.random() * actorsData.actors.length);
      const actorId = actorsData.actors[randomIndex];

      // Fetch actor details
      const fullActor = await fetchActorById(actorId);

      // Check if actor is valid and doesn't match excluded nationalities
      if (
        fullActor &&
        fullActor.profile_path &&
        fullActor.place_of_birth &&
        !excludedNationalities.some((country) => fullActor.place_of_birth.includes(country))
      ) {
        actor = fullActor;
      }

      attempts++;
    }

    return actor;
  } catch (error) {
    console.error("Error fetching random actor:", error);
    return null;
  }
};





//Get Actor Data by ID
export const fetchActorById = async (actorId: number) => {
  try {
    const response = await apiClient.get(`/person/${actorId}`);
    return response.data; // Returns full actor details
  } catch (error) {
    console.error(`Error fetching actor with ID ${actorId}:`, error);
    return null;
  }
};

// Fetch movies by actor (filtered & sorted)
export const fetchMoviesByActor = async (actorId: number) => {
  try {
    const response = await apiClient.get(`/person/${actorId}/movie_credits`);
    return filterAndSortMovies(response.data.cast);
  } catch (error) {
    console.error(`Error fetching movies for actor ${actorId}:`, error);
    return [];
  }
};

// Fetch cast by movie (filtered & sorted)
export const fetchCastByMovie = async (movieId: number) => {
  try {
    const response = await apiClient.get(`/movie/${movieId}/credits`);
    return filterAndSortActors(response.data.cast);
  } catch (error) {
    console.error(`Error fetching cast for movie ${movieId}:`, error);
    return [];
  }
};
