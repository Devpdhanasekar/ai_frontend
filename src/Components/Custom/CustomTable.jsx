import axios from "axios";
import React, { useEffect, useState } from "react";
import "./my.css";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const CustomTable = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalInputValue, setModalInputValue] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [manualAns, setManualAns] = useState("");

  const openModal = (rowData) => {
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setModalInputValue("");
  };

  const handleCellClick = (params) => {
    setSelectedRow(params.row);
    setSelectedField(params.field);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://13.234.217.17:8080/investment");
      console.log(response.data);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching the investors data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const payloadData = {
        context: selectedField,
        base_url: selectedRow.website,
        url: modalInputValue,
        user_answer: manualAns,
      };
      const endpoint = manualAns === "" ? "update" : "updateManual";
      const response = await axios.post(
        `http://13.234.217.17:8080/${endpoint}`,
        payloadData
      );
      console.log(response.data);
      await fetchData();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies?.filter((company) =>
    company.fund_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCompanies);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "companies.xlsx";
    link.click();
  };

  const renderCellWithEditButton = (params) => (
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
      <br />
      <button className="edit_btn" onClick={() => openModal(params.row)}>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>
    </div>
  );

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "fund_name",
      headerName: "Fund Name",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "brief_description",
      headerName: "Description",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "hq_location",
      headerName: "Location",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "investor_type",
      headerName: "Investor Type",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "equity_or_debt",
      headerName: "Equity / Debt",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "stages_of_entry_investment",
      headerName: "Stages of Investment",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "sectors_of_investment",
      headerName: "Sectors of Investment",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "geographies_invested_in",
      headerName: "Geographies Invested In",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "portfolio_companies",
      headerName: "Portfolio Companies",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "no_of_exits",
      headerName: "No. of Exits",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "portfolio_acquisitions",
      headerName: "Portfolio Acquisitions",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "website",
      headerName: "Website",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "portfolio_unicorns_or_soonicorns",
      headerName: "Portfolio Unicorns / Soonicorns",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "portfolio_exits",
      headerName: "Portfolio Exits",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "operating_status",
      headerName: "Operating Status",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "deals_in_last_12_months",
      headerName: "Deals in last 12 months",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "no_of_portfolio_companies_invested_in",
      headerName: "No of Portfolio Companies Invested In",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "size_of_the_fund",
      headerName: "Fund Size",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "founded_year",
      headerName: "Founded Year",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "team_size",
      headerName: "Team Size",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "group_email_id_email_id",
      headerName: "Group Email ID",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "contact_number",
      headerName: "Phone Number",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "linkedin",
      headerName: "LinkedIn",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "twitter",
      headerName: "Twitter",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "youtube",
      headerName: "Youtube",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "founders",
      headerName: "Founders",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
    {
      field: "tags_or_keywords",
      headerName: "Tags / Keywords",
      width: 200,
      editable: true,
      renderCell: renderCellWithEditButton,
    },
  ];

  const getRowHeight = () => "auto";

  return (
    <div className="company-grid-container">
      <Link to="/">
        <button>Go Back</button>
      </Link>
      <input
        type="text"
        placeholder="Search by Fund Name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <button onClick={downloadExcel} className="download-button">
        Download Excel
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            onCellClick={handleCellClick}
            rows={filteredCompanies}
            columns={columns}
            getRowId={(row) => row?._id?.$oid}
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
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} field={selectedField}>
        <label htmlFor="manual-input">Enter URL</label>
        <div className="modal_outline">
          <textarea
            type="text"
            className="modal_input"
            value={modalInputValue}
            onChange={(e) => setModalInputValue(e.target.value)}
          />
          <label htmlFor="manual-input">Enter manual value</label>
          <input
            type="text"
            className="modal_input"
            id="manual-input"
            value={manualAns}
            onChange={(e) => setManualAns(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomTable;
