import React, { Fragment, useContext } from "react";
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
import { FaThumbsUp, FaPeopleCarry, FaTasks, FaRegThumbsUp } from "react-icons/fa"; // Import icons
import Linechart from "../components/dashboard-components/Linechart";
import Areachart from "../components/dashboard-components/Areacchart";
import Curvechart from "../components/dashboard-components/Curvechart";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"; // Import Tabs from react-tabs package

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// JSON Data
const postalData = {
  postalOffices: [
    {
      postOfficeCode: "641042",
      kpiReports: {
        customerSatisfactionScore: {
          data: {
            totalResponses: 200,
            positiveResponses: 150,
            csatPercentage: 75,
          },
        },
        netPromoterScore: {
          data: {
            totalResponses: 100,
            promotersPercentage: 40,
            detractorsPercentage: 30,
            nps: 10,
          },
        },
        sentimentAnalysis: {
          data: {
            positive: 60,
            neutral: 25,
            negative: 15,
          },
        },
        resolutionFeedbackScore: {
          data: {
            totalFeedback: 100,
            positiveFeedback: 85,
            resolutionPercentage: 85,
          },
        },
        reviewsAddressed: {
          data: {
            totalReviews: 120,
            addressedReviews: 100,
            addressedPercentage: 83.33,
          },
        },
      },
    },
  ],
};

function Dashboard() {
  const { sidebarIsCollapse } = useContext(appContext);

  // Extracting KPI Data
  const kpi = postalData.postalOffices[0].kpiReports;

  return (
    <Fragment>
      <section
        className="page dashboard_page"
        style={{
          width: sidebarIsCollapse
            ? "100vw"
            : `calc(100vw - 250px + 80px)`,
          float: "right",
        }}
      >
        {/* KPI Cards */}
        <div className="kpi-cards">
          <div className="card" title="Customer Satisfaction based on feedback and surveys.">
            <FaThumbsUp className="card-icon" />
            <h3>CSAT (%)</h3>
            <p className="percentage">{kpi.customerSatisfactionScore.data.csatPercentage}%</p>
          </div>
          <div className="card" title="Measures customer loyalty and likelihood to recommend.">
            <FaPeopleCarry className="card-icon" />
            <h3>NPS (%)</h3>
            <p className="percentage">{kpi.netPromoterScore.data.nps}</p>
          </div>
          <div className="card" title="Percentage of issues successfully resolved.">
            <FaTasks className="card-icon" />
            <h3>Resolution (%)</h3>
            <p className="percentage">{kpi.resolutionFeedbackScore.data.resolutionPercentage}%</p>
          </div>
          <div className="card" title="Percentage of customer reviews addressed and responded to.">
            <FaRegThumbsUp className="card-icon" />
            <h3>Reviews Addressed (%)</h3>
            <p className="percentage">{kpi.reviewsAddressed.data.addressedPercentage}%</p>
          </div>
        </div>

        {/* Tabs for Charts */}
        <Tabs className="react-tabs">
          <TabList>
            <Tab>Postal Services</Tab>
            <Tab>Financial Services</Tab>
            <Tab>Complaint Metrics</Tab>
            <Tab>Other Analytics</Tab>
          </TabList>

          {/* Postal Services Tab */}
          <TabPanel>
            <div className="charts">
              <div className="chart-container">
                <h3>Delivery Time Compliance</h3>
                <Areachart post_office_code="641001" year="2023" sub_metric="accuracy_in_delivery"/>
              </div>
              <div className="chart-container">
                <h3>Undelivered Mail Rate</h3>
                <Linechart post_office_code="641001" year="2023" sub_metric="undelivered_mail_rate"/>
              </div>
              <div className="chart-container">
                <h3>Revenue from Postal Services</h3>
                <Curvechart post_office_code="641001" year="2023" sub_metric="revenue_from_postal_services"/>
              </div>
            </div>
          </TabPanel>

          {/* Financial Services Tab */}
          <TabPanel>
            <div className="charts">
              <div className="chart-container">
                <h3>Revenue from Financial Services</h3>
                <Areachart post_office_code="641001" year="2023" sub_metric="revenue_from_financial_services"/>
              </div>
              <div className="chart-container">
                <h3>Growth in Financial Services</h3>
                <Curvechart post_office_code="641001" year="2023" sub_metric="growth_in_financial_services"/>
              </div>
            </div>
          </TabPanel>

          {/* Complaint Metrics Tab */}
          <TabPanel>
            <div className="charts">
              <div className="chart-container">
                <h3>Complaint Feedback</h3>
                <Areachart post_office_code="641001" year="2023" sub_metric="customer_feedback"/>
              </div>
              <div className="chart-container">
                <h3>Complaint Resolution Rate</h3>
                <Curvechart post_office_code="641001" year="2023" sub_metric="complaint_resolution_rate"/>
              </div>
            </div>
          </TabPanel>

          {/* Other Analytics Tab */}
          <TabPanel>
            <div className="charts">
              <div className="chart-container">
                <h3>Additional Metrics</h3>
                <Areachart post_office_code="641001" year="2023" sub_metric="additional_metrics"/>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </section>
    </Fragment>
  );
}

export default Dashboard;
