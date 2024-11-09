// PreviousHistory.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./PreviousHistory.css"; // Import custom CSS for styling

const PreviousHistory = () => {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("companyData")) || {};

  // Convert the object into a list of history items
  const historyItems = Object.keys(storedData).map((key) => {
    const [location, query] = key.split("_");
    return { location, query };
  });

  const handleItemClick = (location, query) => {
    navigate("/", { state: { location, query } });
  };

  return (
    <div className="history-grid">
      {historyItems.map((item, index) => (
        <div
          key={index}
          className="history-item"
          onClick={() => handleItemClick(item.location, item.query)}
        >
          <h3>{item.location}</h3>
          <p>{item.query}</p>
        </div>
      ))}
    </div>
  );
};

export default PreviousHistory;
