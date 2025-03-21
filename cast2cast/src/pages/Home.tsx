import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css"; // Import CSS for styling
import logo from "../assets/Big-logo.png";
import HowtoPopUp from "../components/HowtoPopUp";

const Home = () => {
  const navigate = useNavigate(); // Enables navigation
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="home-container">
      {/* Game Logo */}
      <img src={logo} alt="Cast2Cast Logo" className="home-logo" />
      <div className="home-container-buttons">
        {/* Start Button */}
        <button className="button" onClick={() => navigate("/Select")}>
          START
        </button>
        {/* How to play Button */}
        <button
          className="button questionbtn"
          onClick={() => setShowPopup(true)}
        >
          How To Play
        </button>

        {/* Show the popup only when triggered */}
        {showPopup && <HowtoPopUp onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default Home;
