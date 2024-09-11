import React, { useState, useEffect } from 'react';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const koraData = [
  {
    plateNumber: "ABC123",
    deviceSerialNumber: "KOR001",
    speed: 75,
    location: "40.7128,-74.0060",
    videoID: "VID001",
    imageID: "IMG001",
    alcoholLevel: 0,
    fuelConsumption: 7.5
  },
  {
    plateNumber: "XYZ789",
    deviceSerialNumber: "KOR002",
    speed: 90,
    location: "34.0522,-118.2437",
    videoID: "VID002",
    imageID: "IMG002",
    alcoholLevel: 2,
    fuelConsumption: 9.2
  },
  {
    plateNumber: "DEF456",
    deviceSerialNumber: "KOR003",
    speed: 60,
    location: "41.8781,-87.6298",
    videoID: "VID003",
    imageID: "IMG003",
    alcoholLevel: 1,
    fuelConsumption: 6.8
  }
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [currentTab, setCurrentTab] = useState('speed');

  // Simulate real-time data feed
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < koraData.length) {
        setData(prevData => [...prevData, koraData[index], koraData[index + 1]].slice(0, index + 2));
        index += 2;
      } else {
        clearInterval(interval);
      }
    }, 2000); // Feed two records every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  function renderOverviewCards(data) {
    // Assuming data is an array and we're reducing over it
    const overview = data.reduce((acc, item) => {
      // Ensure item is defined and has the 'speed' property
      if (item && item.speed !== undefined) {
        acc.push(item.speed);  // Process valid data
      }
      return acc;  // Accumulate valid entries
    }, []);
  
    // Render your cards based on 'overview'
    return overview.map((speed, index) => (
      <div key={index} className="overview-card">
        <p>Speed: {speed}</p>
      </div>
    ));
  }
  

  const renderTabs = () => {
    const tabs = ['speed', 'alcohol', 'fuel', 'data'];
    return (
      <div className="mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2 mr-2 rounded ${currentTab === tab ? 'bg-[#17726d] text-white' : 'bg-gray-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'speed':
        return createSpeedChart();
      case 'alcohol':
        return createAlcoholChart();
      case 'fuel':
        return createFuelChart();
      case 'data':
        return createDataTable();
      default:
        return null;
    }
  };

  const createSpeedChart = () => {
    const speedData = data.map(item => item.speed);
    const labels = data.map(item => item.plateNumber);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Speed (km/h)',
        data: speedData,
        backgroundColor: 'rgba(23, 114, 109, 0.2)',
        borderColor: '#17726d',
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        y: { beginAtZero: true },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Speed vs. Time</h3>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    );
  }

  const createAlcoholChart = () => {
    const alcoholData = data.map(item => item.alcoholLevel);
    const labels = data.map(item => item.plateNumber);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Alcohol Level',
        data: alcoholData,
        backgroundColor: alcoholData.map(level => level > 0 ? '#FF8042' : '#8884D8'),
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        y: { beginAtZero: true }
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Alcohol Level Distribution</h3>
        <div style={{ height: '300px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
  };

  const createFuelChart = () => {
    const chartData = {
      datasets: [{
        label: 'Fuel Consumption (L/100km)',
        data: data.map(item => ({ x: item.speed, y: item.fuelConsumption })),
        backgroundColor: '#00C49F',
        borderColor: '#00C49F',
        borderWidth: 1
      }]
    };

    const options = {
      scales: {
        x: { title: { display: true, text: 'Speed (km/h)' } },
        y: { title: { display: true, text: 'Fuel Consumption (L/100km)' } }
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Fuel Consumption vs. Speed</h3>
        <div style={{ height: '300px' }}>
          <Scatter data={chartData} options={options} />
        </div>
      </div>
    );
  };

  const createDataTable = () => {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Raw Telematics Data</h3>
        <table className="w-full border border-gray-300">
          <thead className="bg-[#17726d] text-white">
            <tr>
              <th className="px-4 py-2 border">Plate Number</th>
              <th className="px-4 py-2 border">Speed (km/h)</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Alcohol Level</th>
              <th className="px-4 py-2 border">Fuel Consumption (L/100km)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{item.plateNumber}</td>
                <td className="px-4 py-2 border">{item.speed}</td>
                <td className="px-4 py-2 border">{item.location}</td>
                <td className="px-4 py-2 border">{item.alcoholLevel}</td>
                <td className="px-4 py-2 border">{item.fuelConsumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {renderOverviewCards()}
      {renderTabs()}
      {renderTabContent()}
    </div>
  );
};

export default Dashboard;
