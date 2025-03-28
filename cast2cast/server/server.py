from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
import random
import json

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

CORS(app)  # Enable CORS for all routes

with open('actors.json', 'r') as Actorsfile:
    actors_data = json.load(Actorsfile)["actors"]


API_KEY = os.environ.get('VITE_TMDB_API_KEY')
BASE_URL = os.environ.get('VITE_TMDB_BASE_URL')

# Fetch Movies by Actor ID Function


@app.route('/fetchMovies', methods=['GET'])
def fetch_movies():
    actor_id = request.args.get('actorId')
    if not actor_id:
        return jsonify({'error': 'Actor ID is required'}), 400

    response = requests.get(
        f"{BASE_URL}/person/{actor_id}/movie_credits", params={"api_key": API_KEY})

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch movies'}), response.status_code

    movies = response.json().get('cast', [])
    # Apply filters
    movies = [
        movie for movie in movies
        if movie.get('poster_path') and
        movie.get('vote_count', 0) > 10 and
        movie.get('genre_ids') and 99 not in movie['genre_ids']
    ]
    # Sort by Popularity
    movies.sort(key=lambda x: x.get('popularity', 0), reverse=True)
    return jsonify(movies)

# Fetch Actor Function


@app.route('/fetchActor', methods=['GET'])
def fetch_actor():
    actor_id = request.args.get('actorId')
    if not actor_id:
        return jsonify({'error': 'Actor ID is required'}), 400

    response = requests.get(
        f"{BASE_URL}/person/{actor_id}", params={"api_key": API_KEY})

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch actor'}), response.status_code

    actor = response.json()
    return jsonify(actor)


# Fetch Actors by Movie ID Function
@app.route('/fetchCast', methods=['GET'])
def fetch_cast():
    movie_id = request.args.get('movieId')
    if not movie_id:
        return jsonify({'error': 'Movie ID is required'}), 400

    response = requests.get(
        f"{BASE_URL}/movie/{movie_id}/credits", params={"api_key": API_KEY})

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch credits'}), response.status_code

    cast = response.json().get('cast', [])
    # Apply filters
    cast = [
        actor for actor in cast
        if actor.get('profile_path') and
        actor.get('known_for_department') == "Acting"
    ]
    # Sort by Popularity
    cast.sort(key=lambda x: x.get('popularity', 0), reverse=True)
    return jsonify(cast)


# Fetch random Actor
@app.route('/fetchRandomActor', methods=['GET'])
def fetch_random_actor():
    excluded_nationalities = ["Japan", "India",
                              "South Korea", "China", "Pakistan"]
    actor = None
    attempts = 0

    while not actor and attempts < 10:
        try:
            # Choose a random actor from the actors.json
            random_index = random.randint(0, len(actors_data) - 1)
            actor_id = actors_data[random_index]

            # Fetch actor details using TMDB API
            response = requests.get(
                f"{BASE_URL}/person/{actor_id}", params={"api_key": API_KEY})

            if response.status_code != 200:
                print(f"Failed to fetch actor with ID {actor_id}")
                attempts += 1
                continue

            data = response.json()

            # Check conditions: profile_path, place_of_birth, excluded nationalities
            if (data.get('profile_path') and
                data.get('place_of_birth') and
                    not any(country in data['place_of_birth'] for country in excluded_nationalities)):
                actor = data

        except Exception as e:
            print(f"Error fetching actor: {e}")

        attempts += 1

    if actor:
        return jsonify(actor)
    else:
        return jsonify({"error": "Failed to find a suitable actor after 10 attempts"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
