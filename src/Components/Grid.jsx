import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./CompanyGrid.css";

const CompanyGrid = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [pageCount, setPageCount] = useState(20);
  const [expandedRow, setExpandedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
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
    setCompanies(JSON.parse(localStorage.getItem("companies")));
  }, []);

  const handleOnClick = async () => {
    setIsLoading(true);
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
      let fetchData = await axios(configuration);
      if (fetchData.status === 200) {
        // Remove duplicates from fetchData.data based on specific fields (e.g., title and address)
        const uniqueData = fetchData.data.reduce(
          (acc, current) => {
            console.log(current.title);
            const identifier = `${current.title}_${current.address}`;

            // Check if the item already exists in the map
            if (!acc.map.has(identifier)) {
              acc.map.set(identifier, true);
              acc.list.push(current);
            }
            return acc;
          },
          { map: new Map(), list: [] }
        ).list;

        console.log(uniqueData);
        setCompanies(uniqueData);
        localStorage.setItem("companies", JSON.stringify(uniqueData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleScrapeAdvanced = async () => {
    try {
      const domain = advancedUrl.replace(/(^\w+:|^)\/\//, "");
      const response = {
        website: advancedUrl,
        type: investorType,
        title: domain.split(".")[0],
      };
      getLLMData(response);
    } catch (error) {
      console.error("Error in advanced scrape:", error);
    } finally {
      setOpenAdvancedModal(false);
    }
  };

  const getLLMData = async (company) => {
    setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: true }));
    console.log(company);
    console.log(isFieldLoading);
    console.log(currentTitle);
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
      {/* Modal Popup for Retraining Warning */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ongoing Angel Investors Process"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Angel investors model retraining and environment building are in
            progress. Please avoid interacting with angel investor-related
            functionalities during this process.
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
            <MenuItem value="vc_investor">VC Investor</MenuItem>
            <MenuItem value="angel_investor">Angel Investor</MenuItem>
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
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={companies}
          columns={columns}
          getRowId={(row) => row?.data_id}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default CompanyGrid;
