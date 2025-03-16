import React, { useState } from "react";
import "./HowtoPopUp.css";

interface HowtoPopUpProps {
  onClose: () => void;
}

const HowtoPopUp: React.FC<HowtoPopUpProps> = ({ onClose }) => {
  const [closing, setClosing] = useState(false);

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
      <div className={`popup-content ${closing ? "scale-down" : "scale-up"}`}>
        <h1 className="popup-title">How to Play</h1>
        <p className="popup-text">
          - Start with an actor and try to reach the target actor. <br />
          - Click on a Movie to see its cast. <br />
          - Click on an Actor to see their movies. <br />- Continue this process
          to find the shortest path!
        </p>
        <button className="got-it-button" onClick={handleClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HowtoPopUp;
