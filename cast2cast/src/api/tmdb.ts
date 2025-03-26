

//Get random Actor
export const fetchRandomActor = async () => {
  try {
    const response = await fetch(`/.netlify/functions/fetchRandomActor`);
    const actor = await response.json();
    return actor;
  } catch (error) {
    console.error("Error fetching random actor:", error);
    return null;
  }
};


//Get Actor Data by ID
export const fetchActorById = async (actorId: number) => {
  try {
    const response = await fetch(`/.netlify/functions/fetchActor?actorId=${actorId}`);
    const data = await response.json();
    return data; // Returns full actor details
  } catch (error) {
    console.error(`Error fetching actor with ID ${actorId}:`, error);
    return null;
  }
};

// Fetch movies by actor (filtered & sorted)
export const fetchMoviesByActor = async (actorId: number) => {
  try {
    const response = await fetch(`/.netlify/functions/fetchMovies?actorId=${actorId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movies for actor ${actorId}:`, error);
    return [];
  }
};

// Fetch cast by movie (filtered & sorted)
export const fetchCastByMovie = async (movieId: number) => {
  try {
    const response = await fetch(`/.netlify/functions/fetchCast?movieId=${movieId}`);
    const data = response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching cast for movie ${movieId}:`, error);
    return [];
  }
};
