import React from 'react';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

const PortfolioChart = () => {

    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    const data = {
        labels: labels,
        datasets: [{
            label: 'Your Portfolio over time',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(0, 0, 0)',
            tension: 0.3
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
    };


  return (
    // <div>
        <Line data={data} options={config} />
    // </div>
  )
}

export default PortfolioChart;