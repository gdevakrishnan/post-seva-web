import React, { Fragment, useContext, useEffect, useState } from "react";
import "../static/dashboard.css";
import appContext from "../context/appContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaThumbsUp, FaPeopleCarry, FaTasks, FaRegThumbsUp } from "react-icons/fa";
import { MdMail, MdLocalShipping, MdReportProblem , MdDoneAll, } from "react-icons/md";
import Linechart from "../components/dashboard-components/Linechart";
import Areachart from "../components/dashboard-components/Areacchart";
import Curvechart from "../components/dashboard-components/Curvechart";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { getKpiData } from "../services/serviceWorker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Metrics and Sub-Metrics Data
const metrics = [
  {
    category: "Postal Services",
    subMetrics: [
      { title: "Delivery Time Compliance", component: "Areachart", subMetricKey: "delivery_time_compliance" },
      { title: "Accuracy in Delivery", component: "Linechart", subMetricKey: "accuracy_in_delivery" },
      { title: "Undelivered Mail Rate", component: "Linechart", subMetricKey: "undelivered_mail_rate" },
      { title: "Revenue from Postal Services", component: "Curvechart", subMetricKey: "revenue_from_postal_services" },
    ],
  },
  {
    category: "Financial Services",
    subMetrics: [
      { title: "Revenue from Financial Services", component: "Areachart", subMetricKey: "revenue_from_financial_services" },
      { title: "Growth in Financial Services", component: "Curvechart", subMetricKey: "growth_in_financial_services" },
    ],
  },
  {
    category: "Complaint Metrics",
    subMetrics: [
      { title: "Complaint Feedback", component: "Areachart", subMetricKey: "customer_feedback" },
      { title: "Complaint Resolution Rate", component: "Curvechart", subMetricKey: "complaint_resolution_rate" },
    ],
  },
  {
    category: "Operational Efficiency",
    subMetrics: [
      { title: "Cost Per Delivery", component: "Linechart", subMetricKey: "cost_per_delivery" },
      { title: "Staff Productivity", component: "Areachart", subMetricKey: "staff_productivity" },
      { title: "Turnaround Time", component: "Curvechart", subMetricKey: "turnaround_time" },
    ],
  },
  {
    category: "Sustainability",
    subMetrics: [
      { title: "Reduction in Paper Use", component: "Linechart", subMetricKey: "reduction_in_paper_use" },
      { title: "Energy Efficiency", component: "Areachart", subMetricKey: "energy_efficiency" },
      { title: "Waste Management", component: "Curvechart", subMetricKey: "waste_management" },
    ],
  },
];

// Post Office Data
const postOffices = [
  { "post-office-code": "641001", "branch-name": "coimbatore-main", "location": "coimbatore" },
  { "post-office-code": "641002", "branch-name": "coimbatore-south", "location": "coimbatore" },
  { "post-office-code": "641003", "branch-name": "peelamedu", "location": "coimbatore" },
  { "post-office-code": "641004", "branch-name": "tidel-park", "location": "coimbatore" },
  { "post-office-code": "641005", "branch-name": "sundarapuram", "location": "coimbatore" },
  { "post-office-code": "641006", "branch-name": "sitra", "location": "coimbatore" },
  { "post-office-code": "641007", "branch-name": "kuniamuthur", "location": "coimbatore" },
  { "post-office-code": "641008", "branch-name": "gandhipuram", "location": "coimbatore" },
  { "post-office-code": "641009", "branch-name": "r-s-pudur", "location": "coimbatore" },
  { "post-office-code": "641010", "branch-name": "avinashi-road", "location": "coimbatore" },
  { "post-office-code": "641011", "branch-name": "peelamedu", "location": "coimbatore" },
  { "post-office-code": "641012", "branch-name": "saravanampatti", "location": "coimbatore" },
  { "post-office-code": "641013", "branch-name": "townhall", "location": "coimbatore" },
  { "post-office-code": "641014", "branch-name": "coimbatore-airport", "location": "coimbatore" },
  { "post-office-code": "641015", "branch-name": "irugur", "location": "coimbatore" },
  { "post-office-code": "600001", "branch-name": "chennai-general-post-office", "location": "chennai" },
  { "post-office-code": "600002", "branch-name": "chennai-south", "location": "chennai" },
  { "post-office-code": "600003", "branch-name": "chennai-north", "location": "chennai" },
  { "post-office-code": "600004", "branch-name": "chennai-east", "location": "chennai" },
  { "post-office-code": "600005", "branch-name": "chennai-west", "location": "chennai" },
  { "post-office-code": "600006", "branch-name": "mount-road", "location": "chennai" },
  { "post-office-code": "600007", "branch-name": "nungambakkam", "location": "chennai" },
  { "post-office-code": "600008", "branch-name": "t-nagar", "location": "chennai" },
  { "post-office-code": "600009", "branch-name": "adyar", "location": "chennai" },
  { "post-office-code": "600010", "branch-name": "kodambakkam", "location": "chennai" },
  { "post-office-code": "600011", "branch-name": "mylapore", "location": "chennai" },
  { "post-office-code": "600012", "branch-name": "alwarpet", "location": "chennai" },
  { "post-office-code": "600013", "branch-name": "perambur", "location": "chennai" },
  { "post-office-code": "600014", "branch-name": "vepery", "location": "chennai" },
  { "post-office-code": "600015", "branch-name": "egmore", "location": "chennai" }
]

function Dashboard() {
  const { sidebarIsCollapse } = useContext(appContext);
  const [kpiData, setKpiData] = useState(null);

  // Form state
  const [filters, setFilters] = useState({
    postOfficeCode: "641001", // Default post office code
    location: "coimbatore", // Default location
    year: "2023", // Default year
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter post office options based on location
  const filteredPostOffices = postOffices.filter(
    (office) => office.location === filters.location
  );

  // Function to dynamically render chart components
  const renderChartComponent = (component, subMetricKey) => {
    const chartProps = {
      post_office_code: filters.postOfficeCode,
      year: filters.year,
      sub_metric: subMetricKey,
    };

    switch (component) {
      case "Linechart":
        return <Linechart {...chartProps} />;
      case "Areachart":
        return <Areachart {...chartProps} />;
      case "Curvechart":
        return <Curvechart {...chartProps} />;
      default:
        return null;
    }
  };

  // Fetch KPI data and log it frequently using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      fetchKpiData();
    }, 5000); // Log data every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [filters]);

  const fetchKpiData = async () => {
    getKpiData().then((response) => {
      const fetchedData = {
        totalPosts: response.no_of_posts,
        totalPackages: response.no_of_packages,
        totalComplaints: response.no_of_complaints,
        totalResolvedComplaints: response.no_of_solved_complaints,
      };
      setKpiData(fetchedData);
    })
      .catch((e) => console.log(e.message));
  };


  return (
    <Fragment>
      <section className="page dashboard_page">
        {/* KPI Cards */}
        <div className="simple-grid">
  <div className="stat-card" title="Customer Satisfaction based on feedback and surveys.">
    <div className="icon-box">
      <MdMail size={32} className="icon-color" />
    </div>
    <div className="stat-details">
      <h4>Total Posts</h4>
      <p className="main-number">{kpiData ? kpiData.totalPosts : "67678"}</p>
    </div>
  </div>

  <div className="stat-card" title="Measures customer loyalty and likelihood to recommend.">
    <div className="icon-box">
      <MdLocalShipping size={32} className="icon-color" />
    </div>
    <div className="stat-details">
      <h4>Total Packages</h4>
      <p className="main-number">{kpiData ? kpiData.totalPackages : "56577"}</p>
    </div>
  </div>

  <div className="stat-card" title="Percentage of issues successfully resolved.">
    <div className="icon-box">
      <MdReportProblem size={32} className="icon-color" />
    </div>
    <div className="stat-details">
      <h4>Total Complaints</h4>
      <p className="main-number">{kpiData ? kpiData.totalComplaints : "67765"}</p>
    </div>
  </div>

  <div className="stat-card" title="Percentage of customer reviews addressed and responded to.">
    <div className="icon-box">
      <MdDoneAll size={32} className="icon-color" />
    </div>
    <div className="stat-details">
      <h4>Total Resolved Complaints</h4>
      <p className="main-number">{kpiData ? kpiData.totalResolvedComplaints : "66580"}</p>
    </div>
  </div>
</div>


        {/* Filter Form */}
        <form className="filter-form">
          <div>
            <label>Location:</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleInputChange}
            >
              {[...new Set(postOffices.map((office) => office.location))].map(
                (loc, index) => (
                  <option key={index} value={loc}>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label>Post Office:</label>
            <select
              name="postOfficeCode"
              value={filters.postOfficeCode}
              onChange={handleInputChange}
            >
              {filteredPostOffices.map((office, index) => (
                <option key={index} value={office["post-office-code"]}>
                  {office["branch-name"]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Year:</label>
            <select name="year" value={filters.year} onChange={handleInputChange}>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          {/* <button type="button" onClick={() => console.log("Filters applied:", filters)}>
            Apply Filters
          </button> */}
        </form>

        {/* Tabs for Charts */}
        <Tabs className="react-tabs">
          <TabList className="horizontal-tablist">
            {metrics.map((metric, index) => (
              <Tab key={index}>{metric.category}</Tab>
            ))}
          </TabList>

          {metrics.map((metric, index) => (
            <TabPanel key={index}>
              <div className="charts">
                {metric.subMetrics.map((subMetric, subIndex) => (
                  <div className="charts-wrapper">
                  <div className="chart-container" key={subIndex}>
                    <h3>{subMetric.title}</h3>
                    {renderChartComponent(subMetric.component, subMetric.subMetricKey)}
                  </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </section>
    </Fragment>
  );
}

export default Dashboard;