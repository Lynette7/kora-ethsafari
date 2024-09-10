// Sample data (replace with actual data in production)
const koraData = [
    {
      plateNumber: "ABC123",
      deviceSerialNumber: "KOR001",
      speed: 75,
      location: "40.7128,-74.0060",
      videoID: "VID001",
      imageID: "IMG001",
      alcoholLevel: 0
    },
    {
      plateNumber: "XYZ789",
      deviceSerialNumber: "KOR002",
      speed: 90,
      location: "34.0522,-118.2437",
      videoID: "VID002",
      imageID: "IMG002",
      alcoholLevel: 2
    },
    {
      plateNumber: "DEF456",
      deviceSerialNumber: "KOR003",
      speed: 60,
      location: "41.8781,-87.6298",
      videoID: "VID003",
      imageID: "IMG003",
      alcoholLevel: 1
    }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard(koraData);
    dashboard.render();
  });
  
  class Dashboard {
    constructor(data) {
      this.data = data;
      this.currentTab = 'speed';
    }
  
    render() {
      this.renderHeader();
      this.renderOverviewCards();
      this.renderTabs();
      this.renderTabContent();
    }
  
    renderHeader() {
      const header = document.createElement('h1');
      header.textContent = 'Kora Telematics Dashboard';
      header.className = 'text-3xl font-bold mb-6 text-center';
      document.body.appendChild(header);
    }
  
    renderOverviewCards() {
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6';
  
      const avgSpeed = this.data.reduce((acc, curr) => acc + curr.speed, 0) / this.data.length;
      const avgFuelConsumption = this.data.reduce((acc, curr) => acc + curr.fuelConsumption, 0) / this.data.length;
      const alcoholDetections = this.data.filter(item => item.alcoholLevel > 0).length;
  
      const cards = [
        { title: 'Average Speed', value: `${avgSpeed.toFixed(2)} km/h`, icon: '🌬️' },
        { title: 'Avg Fuel Consumption', value: `${avgFuelConsumption.toFixed(2)} L/100km`, icon: '💧' },
        { title: 'Alcohol Detections', value: alcoholDetections, icon: '🌡️' }
      ];
  
      cards.forEach(card => {
        const cardElement = this.createCard(card.title, card.value, card.icon);
        cardsContainer.appendChild(cardElement);
      });
  
      document.body.appendChild(cardsContainer);
    }
  
    createCard(title, value, icon) {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow';
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-medium">${title}</h3>
          <span>${icon}</span>
        </div>
        <div class="text-2xl font-bold">${value}</div>
      `;
      return card;
    }
  
    renderTabs() {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'mb-4';
  
      const tabs = ['speed', 'alcohol', 'fuel', 'data'];
      tabs.forEach(tab => {
        const button = document.createElement('button');
        button.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
        button.className = 'px-4 py-2 mr-2 bg-gray-200 rounded';
        button.addEventListener('click', () => this.switchTab(tab));
        tabsContainer.appendChild(button);
      });
  
      document.body.appendChild(tabsContainer);
    }
  
    switchTab(tab) {
      this.currentTab = tab;
      this.renderTabContent();
    }
  
    renderTabContent() {
      const contentContainer = document.getElementById('tab-content') || document.createElement('div');
      contentContainer.id = 'tab-content';
      contentContainer.innerHTML = '';
  
      switch (this.currentTab) {
        case 'speed':
          contentContainer.appendChild(this.createSpeedChart());
          break;
        case 'alcohol':
          contentContainer.appendChild(this.createAlcoholChart());
          break;
        case 'fuel':
          contentContainer.appendChild(this.createFuelChart());
          break;
        case 'data':
          contentContainer.appendChild(this.createDataTable());
          break;
      }
  
      if (!document.getElementById('tab-content')) {
        document.body.appendChild(contentContainer);
      }
    }
  
    createSpeedChart() {
      const chartContainer = document.createElement('div');
      chartContainer.className = 'bg-white p-4 rounded shadow';
      chartContainer.innerHTML = '<h3 class="text-lg font-medium mb-4">Speed vs. Time</h3>';
      
      // In a real implementation, you would use a charting library like Chart.js
      // Here, we'll just display a placeholder message
      chartContainer.innerHTML += '<p>Speed chart would be rendered here using a charting library.</p>';
      
      return chartContainer;
    }
  
    createAlcoholChart() {
      const chartContainer = document.createElement('div');
      chartContainer.className = 'bg-white p-4 rounded shadow';
      chartContainer.innerHTML = '<h3 class="text-lg font-medium mb-4">Alcohol Level Distribution</h3>';
      
      // Placeholder for alcohol level chart
      chartContainer.innerHTML += '<p>Alcohol level chart would be rendered here using a charting library.</p>';
      
      return chartContainer;
    }
  
    createFuelChart() {
      const chartContainer = document.createElement('div');
      chartContainer.className = 'bg-white p-4 rounded shadow';
      chartContainer.innerHTML = '<h3 class="text-lg font-medium mb-4">Fuel Consumption vs. Speed</h3>';
      
      // Placeholder for fuel consumption chart
      chartContainer.innerHTML += '<p>Fuel consumption chart would be rendered here using a charting library.</p>';
      
      return chartContainer;
    }
  
    createDataTable() {
      const tableContainer = document.createElement('div');
      tableContainer.className = 'bg-white p-4 rounded shadow';
      tableContainer.innerHTML = '<h3 class="text-lg font-medium mb-4">Raw Telematics Data</h3>';
  
      const table = document.createElement('table');
      table.className = 'w-full';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Speed (km/h)</th>
            <th>Location</th>
            <th>Alcohol Level</th>
            <th>Fuel Consumption (L/100km)</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(item => `
            <tr>
              <td>${item.plateNumber}</td>
              <td>${item.speed}</td>
              <td>${item.location}</td>
              <td>
                <span class="px-2 py-1 rounded ${item.alcoholLevel > 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}">
                  ${item.alcoholLevel}
                </span>
              </td>
              <td>${item.fuelConsumption}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
  
      tableContainer.appendChild(table);
      return tableContainer;
    }
  }