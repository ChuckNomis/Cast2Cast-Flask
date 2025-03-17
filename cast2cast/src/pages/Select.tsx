import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Select.css"; // Import CSS for styling
import logo from "../assets/Small-logo.png";
import arrow from "../assets/Arrow.png";
import RandomActorPhoto from "../assets/RandomActor.png";
import { fetchRandomActor, fetchActorById } from "../api/tmdb";

const Select = () => {
  const [startActor, setStartActor] = useState<any>(null);
  const [targetActor, setTargetActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Enable navigation

  useEffect(() => {
    loadActors();
  }, []);

  // Function to fetch random actors
  const loadActors = async () => {
    try {
      setLoading(true);
      let actor1 = null;
      let actor2 = null;
      let retries = 0;
      // Retry fetching actors if null is returned
      while (!actor1 && retries < 5) {
        actor1 = await fetchRandomActor();
        retries++;
      }
      retries = 0;
      while ((!actor2 || actor2.id === actor1.id) && retries < 5) {
        actor2 = await fetchRandomActor();
        retries++;
      }
      // If still null, stop execution
      if (!actor1 || !actor2) {
        console.error("Failed to fetch valid actors.");
        setLoading(false);
        return;
      }
      console.log("Actor 1:", actor1);
      console.log("Actor 2:", actor2);
      // Fetch additional actor data
      let actor1Data = await fetchActorById(actor1.id);
      let actor2Data = await fetchActorById(actor2.id);
      // Ensure fetched data is valid before setting state
      if (!actor1Data || !actor2Data) {
        console.error("Failed to fetch full actor details.");
        setLoading(false);
        return;
      }
      setStartActor(actor1Data);
      setTargetActor(actor2Data);
    } catch (error) {
      console.error("Error in loadActors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reroll actors by fetching new ones
  const handleReroll = () => {
    loadActors();
  };

  // Navigate to Game Page with selected actors
  const handleGoClick = () => {
    if (startActor && targetActor) {
      navigate("/game", { state: { startActor, targetActor } });
    }
  };
  //Function to go back to Home Page
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="select-container">
      <img
        src={logo}
        alt="Cast2Cast Logo"
        className="top-logo"
        onClick={handleLogoClick}
      />
      {loading ? (
        <div className="selected-actors-container">
          <div className="actor-card">
            <img className="actor-image" src={RandomActorPhoto} />
          </div>
          <img src={arrow} alt="Arrow icon" className="arrow-icon" />
          <div className="actor-card">
            <img className="actor-image" src={RandomActorPhoto} />
          </div>
        </div>
      ) : (
        <div className="selected-actors-container">
          <div className="actor-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${startActor.profile_path}`}
              alt={startActor.name}
              className="actor-image"
            />
            <div className="actor-title">{startActor.name}</div>
          </div>
          <img src={arrow} alt="Arrow icon" className="arrow-icon" />
          <div className="actor-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${targetActor.profile_path}`}
              alt={targetActor.name}
              className="actor-image"
            />
            <div className="actor-title">{targetActor.name}</div>
          </div>
        </div>
      )}

      <div className="button-container">
        {/* GO Button */}
        <button className="button" onClick={handleGoClick}>
          GO
        </button>
        {/* Reroll Button */}
        <button className="button" onClick={handleReroll}>
          Reroll
        </button>
      </div>
    </div>
  );
};

export default Select;
