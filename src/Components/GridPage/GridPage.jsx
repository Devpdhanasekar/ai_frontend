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
        VC Investors
      </div>
      <div className="grid-item" onClick={() => handleNavigate("angel")}>
        Angel Networks
      </div>
      <div
        className="grid-item"
        onClick={() => handleNavigate("accelerators and incubators")}
      >
        Accelerators and Incubators
      </div>
      <div
        className="grid-item"
        onClick={() => handleNavigate("corporate venture capital")}
      >
        Corporate Venture Capital
      </div>
      <div
        className="grid-item"
        onClick={() => handleNavigate("goverment grants & schemes")}
      >
        Goverment Grants & Schemes
      </div>
    </div>
  );
};

export default GridPage;
