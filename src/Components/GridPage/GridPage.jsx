import React from "react";
import "./GridPage.css";
import { useNavigate } from "react-router-dom";

const GridPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    console.log(route);
    navigate("/details", { state: { route } });
  };

  return (
    <div className="grid-container">
      <div className="grid-item" onClick={() => handleNavigate("vc")}>
        VM Investors
      </div>
      <div className="grid-item" onClick={() => handleNavigate("angel")}>
        Angel Networks
      </div>
    </div>
  );
};

export default GridPage;
