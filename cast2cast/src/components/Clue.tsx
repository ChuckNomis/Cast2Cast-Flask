import React, { useEffect, useState } from "react";
import "./Clue.css";
import { fetchMoviesByActor } from "../api/tmdb";

interface ClueProps {
  onClose: () => void;
  targetActor: any;
}

const HowtoPopUp: React.FC<ClueProps> = ({ onClose, targetActor }) => {
  const [closing, setClosing] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    if (targetActor) {
      fetchMoviesByActor(targetActor.id).then((movies) => {
        const top3 = movies.slice(0, 3); // store the sliced result
        setMovies(top3);
      });
    }
  }, [targetActor]);
  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300); // Wait for animation before removing component
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains("popup-overlay")) {
      handleClose();
    }
  };

  return (
    <div
      className={`popup-overlay ${closing ? "fade-out" : "fade-in"}`}
      onClick={handleBackgroundClick}
    >
      <div className={`clue-content ${closing ? "scale-down" : "scale-up"}`}>
        <h1 className="popup-title">Clues</h1>
        <p className="popup-text">
          Movies the target actor appears in
          <br />
        </p>
        <div className="movies-section">
          {movies &&
            movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-image"
                />
                <div className="movie-title">{movie.title}</div>
              </div>
            ))}
        </div>
        <button className="got-it-button" onClick={handleClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HowtoPopUp;
