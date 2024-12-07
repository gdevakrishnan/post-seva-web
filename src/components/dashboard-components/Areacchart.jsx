import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dataset } from './dataset';

export default function Areachart(props) {
    const { post_office_code, year, sub_metric } = props;
    const [formattedData, setFormattedData] = useState([]);

    const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    function generateIndicators(data) {
        return data.map((item, index, arr) => {
            const lag = index > 0 ? arr[index - 1].value : item.value * 0.9;
            const lead = index < arr.length - 1 ? arr[index + 1].value : item.value * 1.1;
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

        const aggregatedData = filteredData.reduce((acc, item) => {
            const date = new Date(item.date.replace(/_/g, "-"));
            const month = date.getMonth();
            const existingMonth = acc.find((data) => data.month === month);

            if (existingMonth) {
                existingMonth.value += item.value;
            } else {
                acc.push({ month, value: item.value });
            }
            return acc;
        }, []);

        aggregatedData.sort((a, b) => a.month - b.month);
        return generateIndicators(aggregatedData);
    }

    useEffect(() => {
        const processedData = processData(dataset);
        setFormattedData(processedData);
    }, [post_office_code, year, sub_metric]);

    return (
        <div style={{ width: '100%' }}>
            {formattedData.length > 0 ? (
                <AreaChart
                    width={850}
                    height={300}
                    data={formattedData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="month" 
                        tickFormatter={(monthIndex) => monthNames[monthIndex]} // Format month index to month name
                    />
                    <YAxis />
                    <Tooltip 
                        labelFormatter={(monthIndex) => monthNames[monthIndex]} // Format tooltip labels to month names
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2196F3"  // Blue
                        fill="#64B5F6"    // Light Blue
                    />
                    <Area
                        type="monotone"
                        dataKey="lead"
                        stroke="#00BCD4"  // Cyan
                        fill="#4DD0E1"    // Light Cyan
                    />
                    <Area
                        type="monotone"
                        dataKey="lag"
                        stroke="#8E24AA"  // Purple
                        fill="#AB47BC"    // Light Purple
                    />
                </AreaChart>
            ) : (
                <p>No data available for the selected filters.</p>
            )}
        </div>
    );
}
