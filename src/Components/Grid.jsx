import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
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
      url: "http://54.90.198.188:8080/googlemap",
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

  const getLLMData = async (company) => {
    setIsFieldLoading((prev) => ({ ...prev, [company.data_id]: true }));
    console.log(company);
    console.log(isFieldLoading);
    console.log(currentTitle);
    let configuration = {
      method: "POST",
      url: "http://54.90.198.188:8080/initialDataScrape",
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
      url: "http://54.90.198.188:8080/webscrap",
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
      {/* Modal Popup for Retraing Warning */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
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
          <Button onClick={handleCloseModal} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search and Button Inputs */}
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

      {/* Data Grid */}
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
