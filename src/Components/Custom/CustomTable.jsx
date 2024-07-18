import axios from "axios";
import React, { useEffect, useState } from "react";
import "./my.css";

const CustomTable = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [pageCount, setPageCount] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://35.95.20.164:8080/investment");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching the investors data", error);
      }
    };

    fetchData();
  }, []);

  const additionalInfo = {
    "Fund Name": "",
    "Brief Description": "",
    "HQ Location": "",
    "Investor Type": "",
    "Equity / Debt (Fund Category)": "",
    "Stages of Entry/ Investment": "",
    "Sectors of Investment": "",
    "Geographies Invested In": "",
    "Portfolio Companies": "",
    "No.of Exits": "",
    "Portfolio Acquisitions": "",
    Website: "",
    "Program Link (if applicable)": "",
    "Portfolio Unicorns / Soonicorns": "",
    "Portfolio Exits": "",
    "Operating Status (Active/ Deadpooled, etc)": "",
    "Deals in last 12 months": "",
    "AUM $$": "",
    "Size of the Fund": "",
    "Investments in Tier 1 cities": "",
    "Investments in Tier 2+ markets": "",
    "Founded Year": "",
    "Team Size": "",
    "Group Email ID/ Email ID": "",
    "Phone Number": "",
    LinkedIn: "",
    "Twitter (X)": "",
    Youtube: "",
    Instagram: "",
    "Fund Manager": "",
    Eligibility: "",
    "Documents Required": "",
    "Co-Investors": "",
    Founders: "",
    "Tags/ Keywords": "",
  };

  const [currentInvestor, setCurrentInvestor] = useState(additionalInfo);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleOnClick = async () => {
    let payloadData = {
      location: location,
      query: query,
      pageCount: pageCount,
    };
    let configuration = {
      method: "POST",
      url: "http://127.0.0.1:5000/googlemap",
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
    }
  };

  const getLLMData = async (company) => {
    setIsLoading(true);
    setExpandedRow(company.position);
    let configuration = {
      method: "POST",
      url: "http://127.0.0.1:5000/webscrap",
      headers: {
        "Content-Type": "application/json",
      },
      data: { url: company },
    };
    try {
      const investorData = await axios(configuration);
      if (investorData.status === 200) {
        setCurrentInvestor(investorData.data.result);
      }
    } catch (error) {
      console.error("Error scraping data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies.filter((company) =>
    company.fund_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="company-grid-container">
      <input
        type="text"
        placeholder="Search by Fund Name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Fund Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Investor Type</th>
            <th>Equity / Debt</th>
            <th>Stages of Investment</th>
            <th>Sectors of Investment</th>
            <th>Geographies Invested In</th>
            <th>Portfolio Companies</th>
            <th>No. of Exits</th>
            <th>Portfolio Acquisitions</th>
            <th>Website</th>
            <th>Portfolio Unicorns / Soonicorns</th>
            <th>Portfolio Exits</th>
            <th>Operating Status</th>
            <th>Deals in last 12 months</th>
            <th>AUM $$</th>
            <th>Fund Size</th>
            <th>Founded Year</th>
            <th>Team Size</th>
            <th>Group Email ID</th>
            <th>Phone Number</th>
            <th>LinkedIn</th>
            <th>Twitter</th>
            <th>Youtube</th>
            <th>Instagram</th>
            <th>Fund Manager</th>
            <th>Eligibility</th>
            <th>Documents Required</th>
            <th>Co-Investors</th>
            <th>Founders</th>
            <th>Tags / Keywords</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((company) => (
            <tr key={company.id}>
              <td>{company.fund_name}</td>
              <td>{company.brief_description}</td>
              <td>{company.hq_location}</td>
              <td>{company.investor_type}</td>
              <td>{company.equity_or_debt}</td>
              <td>{company.stages_of_entry_investment}</td>
              <td>{company.sectors_of_investment}</td>
              <td>{company.geographies_invested_in}</td>
              <td>{company.portfolio_companies}</td>
              <td>{company.no_of_exits}</td>
              <td>{company.portfolio_acquisitions}</td>
              <td>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              </td>
              <td>{company.portfolio_unicorns_or_soonicorns}</td>
              <td>{company.portfolio_exits}</td>
              <td>{company.operating_status}</td>
              <td>{company.deals_in_last_12_months}</td>
              <td>{company.aum}</td>
              <td>{company.size_of_the_fund}</td>
              <td>{company.founded_year}</td>
              <td>{company.team_size}</td>
              <td>{company.group_email_id}</td>
              <td>{company.phone_number}</td>
              <td>
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </td>
              <td>
                <a
                  href={company.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </td>
              <td>
                <a
                  href={company.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Youtube
                </a>
              </td>
              <td>{company.instagram}</td>
              <td>{company.fund_manager}</td>
              <td>{company.eligibility}</td>
              <td>{company.documents_required}</td>
              <td>{company.co_investors}</td>
              <td>{company.founders}</td>
              <td>{company.tags_or_keywords}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
