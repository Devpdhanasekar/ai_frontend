import axios from "axios";
import React, { useState } from "react";
import "./CompanyGrid.css";
import { useNavigate } from "react-router-dom";

const CompanyGrid = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [pageCount, setPageCount] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleOnClick = async () => {
    setIsLoading(true);
    let payloadData = {
      location: location,
      query: query,
      pageCount: pageCount,
    };
    let configuration = {
      method: "POST",
      url: "http://54.214.162.14:8080/googlemap",
      headers: {
        "Content-Type": "application/json",
      },
      data: payloadData,
    };
    try {
      let fetchData = await axios(configuration);
      if (fetchData.status === 200) {
        console.log(fetchData.data);
        setCompanies(fetchData.data.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLLMData = async (company) => {
    setIsLoading(true);
    setExpandedRow(company.position);
    let configuration = {
      method: "POST",
      url: "http://54.214.162.14:8080/webscrap",
      headers: {
        "Content-Type": "application/json",
      },
      data: { url: company },
    };
    try {
      const investorData = await axios(configuration);
      if (investorData.status === 200) {
        alert(
          investorData.data.message
            ? investorData.data.message
            : "Data scraped successfully"
        );
      } else {
        alert("Please try again");
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/details");
  };

  const handleCheckboxChange = (companyId) => {
    setSelectedCompanies((prevSelected) => {
      if (prevSelected.includes(companyId)) {
        return prevSelected.filter((id) => id !== companyId);
      } else {
        return [...prevSelected, companyId];
      }
    });
  };

  const handleScrapeSelected = async () => {
    const selectedCompanyDetails = companies.filter((company) =>
      selectedCompanies.includes(company.id)
    );
    setIsLoading(true);

    let configuration = {
      method: "POST",
      url: "http://54.214.162.14:8080/webscrap",
      headers: {
        "Content-Type": "application/json",
      },
      data: { companies: selectedCompanyDetails },
    };

    try {
      const investorData = await axios(configuration);
      if (investorData.status === 200) {
        console.log("Scraped data:", investorData.data);
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="company-grid-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleNavigate}>View all</button>
        <button onClick={handleOnClick} disabled={isLoading}>
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <button
            onClick={handleScrapeSelected}
            disabled={selectedCompanies.length === 0 || isLoading}
          >
            {isLoading ? "Loading..." : "Scrape Selected"}
          </button>
          <div className="grid-container">
            <div className="grid-header">
              <div>Select</div>
              <div>Company Name</div>
              <div>Website</div>
              <div>Type</div>
              <div>Mobile Number</div>
              <div>Actions</div>
              <div></div>
            </div>
            {companies.map((company) => (
              <React.Fragment key={company.id}>
                <div className="grid-row">
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => handleCheckboxChange(company.id)}
                    />
                  </div>
                  <div>{company.title}</div>
                  <div>{company.website}</div>
                  <div>{company.type}</div>
                  <div>{company.phone}</div>
                  <div>
                    <button
                      onClick={() => getLLMData(company)}
                      disabled={isLoading}
                    >
                      {isLoading && expandedRow === company.position
                        ? "Loading..."
                        : "Scrap Data"}
                    </button>
                  </div>
                  <div>
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(company.position)}
                    >
                      {expandedRow === company.position ? "▲" : "▼"}
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyGrid;
