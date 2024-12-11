import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart'; // Import BarChart component
import { dataset } from './dataset'; // Import the dataset

export default function BarChartComponent(props) {
    const { post_office_code, year, sub_metric } = props; // Destructure props
    const [formattedData, setFormattedData] = useState([]);

    // Array of month names for mapping
    const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    // Function to generate lead and lag indicators
    function generateIndicators(data) {
        return data.map((item, index, arr) => {
            const lag = index > 0 ? arr[index - 1].value : item.value * 0.9; // Lag: Previous month's value (or 90% of current if no previous month)
            const lead = index < arr.length - 1 ? arr[index + 1].value : item.value * 1.1; // Lead: Next month's value (or 110% of current if no next month)
            return {
                ...item,
                lead,
                lag,
            };
        });
    }

    function processData(dataset) {
        const filteredData = dataset.filter((data) => {
            const dataYear = new Date(data.date.replace(/_/g, "-")).getFullYear();

            return (
                dataYear == year &&
                data['sub_metric'] === sub_metric &&
                data['post_office_code'] === post_office_code
            );
        });

        // Aggregate data by month
        const aggregatedData = filteredData.reduce((acc, item) => {
            const date = new Date(item.date.replace(/_/g, "-"));
            const month = date.getMonth(); // Get month (0-11)
            const existingMonth = acc.find((data) => data.month === month);

            if (existingMonth) {
                // Add to the value if the month already exists
                existingMonth.value += item.value;
            } else {
                // Add new month entry
                acc.push({ month, value: item.value });
            }
            return acc;
        }, []);

        // Sort by month
        aggregatedData.sort((a, b) => a.month - b.month);

        // Generate lead and lag indicators
        return generateIndicators(aggregatedData);
    }

    // UseEffect to process the dataset when props change
    useEffect(() => {
        const processedData = processData(dataset); // Process the dataset
        setFormattedData(processedData); // Set the processed data
    }, [post_office_code, year, sub_metric]); // Re-run effect if props change

    return (
        <div style={{ width: '100%' }}> {/* Ensure the parent div takes 100% width */}
            {formattedData.length > 0 ? ( // Check if data is available
                <BarChart
                    xAxis={[{
                        data: formattedData.map((item) => monthNames[item.month]), // Map month numbers to names
                        label: 'Month', // Label for the x-axis
                        scaleType: 'band', // Specify categorical scale
                    }]}
                    series={[
                        {
                            data: formattedData.map((item) => item.value), // Actual values for the y-axis
                            label: 'Actual Value', // Label for actual value
                            color: '#FF5722', // Cyan for Lead Indicator
                        },
                        {
                            data: formattedData.map((item) => item.lead), // Lead indicator values
                            label: 'Lead Indicator', // Label for lead indicator
                            color: '#8E24AA', // Blue for Actual Value
                        },
                        {
                            data: formattedData.map((item) => item.lag), // Lag indicator values
                            label: 'Lag Indicator', // Label for lag indicator
                            color: '#2196F3', // Purple for Lag Indicator
                        },
                    ]}
                    height={300} // Set height of the chart
                    margin={{ left: 50, right: 50, top: 50, bottom: 50 }} // Set margins
                    width={850} // Ensure chart takes the appropriate width
                />
            ) : (
                <p>No data available for the selected filters.</p> // Handle empty data gracefully
            )}
        </div>
    );
}

