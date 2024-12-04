import React, { Fragment, useContext } from "react";
import "../static/dashboard.css";
import appContext from "../context/appContext";
import { Bar, Pie } from "react-chartjs-2";
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

  // Data for the Bar Chart (CSAT and NPS)
  const barData = {
    labels: ["CSAT (%)", "NPS (%)", "Resolution (%)", "Reviews Addressed (%)"],
    datasets: [
      {
        label: "KPI Performance",
        data: [
          kpi.customerSatisfactionScore.data.csatPercentage,
          kpi.netPromoterScore.data.nps,
          kpi.resolutionFeedbackScore.data.resolutionPercentage,
          kpi.reviewsAddressed.data.addressedPercentage,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"],
      },
    ],
  };

  // Data for the Pie Chart (Sentiment Analysis)
  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          kpi.sentimentAnalysis.data.positive,
          kpi.sentimentAnalysis.data.neutral,
          kpi.sentimentAnalysis.data.negative,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

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
        {/* <div className="dashboard-header">
          <p>Post Office Code: 641042</p>
        </div> */}

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

        {/* Charts Section */}
        <div className="charts">
          <div className="chart-container">
            <h3>KPI Bar Chart</h3>
            <Bar data={barData} />
          </div>
          <br />
          <div className="chart-container">
            <h3>Sentiment Analysis</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Dashboard;
