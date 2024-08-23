import axios from "axios";
import React, { useState, useEffect } from "react";
import "./CompanyGrid.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const CompanyGrid = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [pageCount, setPageCount] = useState(20);
  const [expandedRow, setExpandedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  console.log(selectedCompanies);
  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  useEffect(() => {
    setCompanies(JSON.parse(localStorage.getItem("companies")));
  }, []);

  const handleOnClick = async () => {
    setIsLoading(true);
    let payloadData = {
      location: location,
      query: query,
      pageCount: pageCount,
    };
    let configuration = {
      method: "POST",
      url: "http://13.234.217.17:8080/googlemap",
      headers: {
        "Content-Type": "application/json",
      },
      data: payloadData,
    };
    try {
      let fetchData = await axios(configuration);
      if (fetchData.status === 200) {
        console.log(fetchData.data);
        setCompanies(fetchData.data);
        localStorage.setItem("companies", JSON.stringify(fetchData.data));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLLMData = async (company) => {
    console.log(company);
    // setExpandedRow(company.position);
    let configuration = {
      method: "POST",
      url: "http://13.234.217.17:8080/initialDataScrape",
      headers: {
        "Content-Type": "application/json",
      },
      data: { url: company },
    };
    try {
      const investorData = await axios(configuration);
      console.log(investorData.data);
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

  const handleCheckboxChange = (company) => {
    setSelectedCompanies({
      ...selectedCompanies,
      ...company,
    });
  };

  const handleScrapeSelected = async () => {
    const selectedCompanyDetails = companies.filter((company) =>
      selectedCompanies.includes(company.id)
    );
    setIsLoading(true);

    let configuration = {
      method: "POST",
      url: "http://13.234.217.17:8080/webscrap",
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

  const columns = [
    {
      field: "checkbox",
      headerName: "Select",
      width: 50,
      renderCell: (params) => (
        <input
          type="checkbox"
          // checked={selectedCompanies.includes(params.row.id)}
          onChange={() => handleCheckboxChange(params.row)}
        />
      ),
    },
    {
      field: "id",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "title",
      headerName: "Company Name",
      width: 230,
      editable: true,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-all",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "website",
      headerName: "Website",
      width: 300,
      editable: true,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-all",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      type: "number",
      width: 200,
      editable: true,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-all",
            padding: "4px",
            boxSizing: "border-box",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "Mobile Number",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <button
          className="list_scrap_button"
          onClick={() => getLLMData(params.row)}
          disabled={isLoading}
        >
          {isLoading && expandedRow === params.row.position
            ? "Loading..."
            : "Scrap Data"}
        </button>
      ),
    },
  ];

  const getRowHeight = (params) => {
    return "auto";
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
        <button onClick={handleOnClick} disabled={isLoading}>
          {isLoading ? "Loading..." : "Search"}
        </button>
        <button onClick={handleNavigate} className="view_all_btn">
          View all
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
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={companies}
              columns={columns}
              getRowId={(row) => row?.data_id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
              getRowHeight={getRowHeight}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default CompanyGrid;
