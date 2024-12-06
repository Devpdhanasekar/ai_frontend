import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./CompanyGrid.css";

const CompanyGrid = () => {
  // const navigate = useNavigate();
  const locationData = useLocation();

  const [location, setLocation] = useState(locationData.state?.location || "");
  const [query, setQuery] = useState(locationData.state?.query || "");
  const [companies, setCompanies] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [pageCount, setPageCount] = useState(20);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFieldLoading, setIsFieldLoading] = useState({});
  const [currentTitle, setCurrentTitle] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(true); // State for the popup modal
  const [openAdvancedModal, setOpenAdvancedModal] = useState(false); // State for advanced options modal
  const [advancedUrl, setAdvancedUrl] = useState(""); // URL input for advanced modal
  const [investorType, setInvestorType] = useState(""); // Investor type for advanced modal

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("companyData")) || {};
    const savedCompanies = storedData[`${location}_${query}`] || [];
    setCompanies(savedCompanies);
  }, [location, query]);

  const handleNavigateHistory = () => {
    navigate("/previous-history");
  };
  const handleCellEditStart = (params) => {
    // Directly use params.value instead of relying on the state
    console.log("edit start", params.key); // Log the value directly
    setEditedValue(params.key);
  };

  const handleCellEditStop = (params) => {
    const updatedRow = params.row; // The updated row data

    // Check if the edited field is "website"
    if (params.field === "website") {
      // Update the corresponding row in the state or backend
      const updatedCompanies = companies.map((company) => {
        if (company.data_id === updatedRow.data_id) {
          return { ...company, website: updatedRow.website }; // Assuming website is the field being edited
        }
        return company;
      });

      // Update local state with the new row data
      setCompanies(updatedCompanies);

      // Optionally, store the updated data in localStorage or send to backend
      const storedData = JSON.parse(localStorage.getItem("companyData")) || {};
      const queryKey = `${location}_${query}`;
      storedData[queryKey] = updatedCompanies;
      localStorage.setItem("companyData", JSON.stringify(storedData));

      console.log("Row updated:", updatedRow);
    }
  };

  const handleOnClick = async () => {
    setIsLoading(true);
    const queryKey = `${location}_${query}`;

    let payloadData = {
      location: location,
      query: query + " in " + location,
      pageCount: pageCount,
    };
    let configuration = {
      method: "POST",
      url: "https://mohur-ai.onrender.com/googlemap",
      headers: {
        "Content-Type": "application/json",
      },
      data: payloadData,
    };

    try {
      const fetchData = await axios(configuration);
      console.log(fetchData.data);
      if (fetchData.status === 200) {
        // Check if the query is related to "vc investors" or similar terms
        const filteredData = fetchData.data; // If the query doesn't match, don't filter
        const uniqueData = filteredData.reduce(
          (acc, current) => {
            const identifier = `${current.title}_${current.address}`;
            if (!acc.map.has(identifier)) {
              acc.map.set(identifier, true);
              acc.list.push(current);
            }
            return acc;
          },
          { map: new Map(), list: [] }
        ).list;

        // Check if companies for the queryKey already exist in localStorage
        const storedData =
          JSON.parse(localStorage.getItem("companyData")) || {};
        const existingCompanies = storedData[queryKey] || [];

        // Append new companies to existing ones if they are unique
        const combinedCompanies = [...existingCompanies, ...uniqueData];
        const uniqueCombinedCompanies = combinedCompanies.reduce(
          (acc, company) => {
            const identifier = `${company.title}_${company.address}`;
            if (!acc.map.has(identifier)) {
              acc.map.set(identifier, true);
              acc.list.push(company);
            }
            return acc;
          },
          { map: new Map(), list: [] }
        ).list;

        // Update companies and store the result
        setCompanies(uniqueCombinedCompanies);
        storedData[queryKey] = uniqueCombinedCompanies;
        localStorage.setItem("companyData", JSON.stringify(storedData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleScrapeAdvanced = async () => {
    try {
      setIsLoading(true);
      const domain = advancedUrl.replace(/(^\w+:|^)\/\//, "");
      const response = {
        website: advancedUrl,
        type: investorType,
        title: domain.split(".")[0],
      };
      advancedUrlData(response).then(() => setIsLoading(false));
    } catch (error) {
      console.error("Error in advanced scrape:", error);
    } finally {
      setOpenAdvancedModal(false);
    }
  };

  const getLLMData = async (company) => {
    setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: true }));
    console.log("company", company);
    console.log("isFieldLoading", isFieldLoading);
    console.log("currentTitle", currentTitle);
    console.log(
      query.includes("vc") ||
        query.toLowerCase().includes("venture capital") ||
        query.toLowerCase().includes("vc investors") ||
        query.toLowerCase().includes("venture capital company")
    );
    const isConformed = window.confirm(
      `Are you sure you want to scrape for ${
        query.toLowerCase().includes("corporate venture capital")
          ? "Corporate Venture Capital CVC"
          : query.toLowerCase().includes("goverment grants & schemes") ||
            query.toLowerCase().includes("goverment grants") ||
            query.toLowerCase().includes("schemes")
          ? "Goverment Grants & Schemes"
          : query.toLowerCase().includes("vc") ||
            query.toLowerCase().includes("venture capital") ||
            query.toLowerCase().includes("venture")
          ? "VC investors"
          : query.toLowerCase().includes("accelerators") ||
            query.toLowerCase().includes("incubators")
          ? "Accelerators and Incubators"
          : "Angel investors"
      }?`
    );
    if (
      query.toLowerCase().includes("corporate venture capital") &&
      isConformed
    ) {
      company.type = "corporate venture capital";
    } else if (
      (query.toLowerCase().includes("vc") ||
        query.toLowerCase().includes("venture capital") ||
        query.toLowerCase().includes("vc") ||
        query.toLowerCase().includes("venture")) &&
      isConformed
    ) {
      company.type = "vc investor";
    } else if (
      (query.toLowerCase().includes("accelerators") ||
        query.toLowerCase().includes("incubators")) &&
      isConformed
    ) {
      company.type = "accelerators and incubators";
    } else if (query.toLowerCase().includes("angel") && isConformed) {
      company.type = "angel investor";
    } else if (
      (query.toLowerCase().includes("goverment grants & schemes") ||
        query.toLowerCase().includes("goverment grants") ||
        query.toLowerCase().includes("schemes")) &&
      isConformed
    ) {
      company.type = "goverment grants & schemes";
    } else {
      setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: false }));
      return;
    }

    let configuration = {
      method: "POST",
      url: "https://mohur-ai.onrender.com/initialDataScrape",
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
        setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: false }));
      } else {
        setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: false }));
        alert("Please try again");
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: false }));
    }
  };

  const advancedUrlData = async (company) => {
    let configuration = {
      method: "POST",
      url: "https://mohur-ai.onrender.com/initialDataScrape",
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
        console.log(investorData.data);
      } else {
        console.log(investorData.data);
        alert("Please try again");
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      console.log("filal");
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard");
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
      url: "https://mohur-ai.onrender.com/webscrap",
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
  const handleOpenAdvancedModal = () => {
    setOpenAdvancedModal(true);
  };

  const handleCloseAdvancedModal = () => {
    setOpenAdvancedModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCellEditCommit = (params) => {
    console.log("called,", params);
    const updatedCompanies = companies.map((company) => {
      if (company.data_id === params.id) {
        return {
          ...company,
          [params.field]: params.value,
        };
      }
      return company;
    });

    // Update local state
    setCompanies(updatedCompanies);

    // Update localStorage
    const storedData = JSON.parse(localStorage.getItem("companyData")) || {};
    const queryKey = `${location}_${query}`;
    storedData[queryKey] = updatedCompanies;
    localStorage.setItem("companyData", JSON.stringify(storedData));
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "Select",
      width: 50,
      renderCell: (params) => (
        <input
          type="checkbox"
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
          disabled={isFieldLoading[params.row.data_id]}
        >
          {isFieldLoading[params.row.data_id] ? "Loading..." : "Scrap Data"}
        </button>
      ),
    },
  ];

  const getRowHeight = (params) => {
    return "auto";
  };

  return (
    <div className="company-grid-container">
      <button onClick={handleNavigateHistory}>View Previous Searches</button>
      {/* Modal Popup for Retraining Warning */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ongoing Goverment Grants & Schemes Process"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Goverment Grants & Schemes model retraining and environment building
            are in progress. Please avoid interacting with Accelerators &
            Incubators-related functionalities during this process.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Options Modal */}
      <Dialog
        open={openAdvancedModal}
        onClose={handleCloseAdvancedModal}
        aria-labelledby="advanced-dialog-title"
      >
        <DialogTitle id="advanced-dialog-title">Advanced Options</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter URL"
            value={advancedUrl}
            onChange={(e) => setAdvancedUrl(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            select
            label="Investor Type"
            value={investorType}
            onChange={(e) => setInvestorType(e.target.value)}
            fullWidth
            margin="dense"
          >
            <MenuItem value="vc investor">VC Investor</MenuItem>
            <MenuItem value="angel investor">Angel Investor</MenuItem>
            <MenuItem value="accelerators and incubators">
              Accelerators and Incubators
            </MenuItem>
            <MenuItem value="corporate venture capital">
              Corporate Venture Capital
            </MenuItem>
            <MenuItem value="goverment grants & schemes">
              Goverment Grants & Schemes
            </MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleScrapeAdvanced} color="primary">
            Scrape
          </Button>
          <Button onClick={handleCloseAdvancedModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input Fields and Buttons */}
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
        <button
          onClick={handleOpenAdvancedModal}
          className="advanced-options-btn"
        >
          Advanced Options
        </button>
      </div>

      {/* Data Grid */}

      {!isLoading ? (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={companies}
            columns={columns}
            getRowId={(row) => row?.data_id}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default CompanyGrid;
