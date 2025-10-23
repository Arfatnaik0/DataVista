// DataVista Advanced Analytics System
class DataAnalyzer {
  constructor() {
    this.chart = null;
    this.ctx = document.getElementById('myChart').getContext('2d');
    this.originalData = null;
    this.processedData = null;
    this.currentFilters = {};
    this.dataTypes = {};
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderDefaultChart();
  }

  setupEventListeners() {
    // File upload
    document.getElementById("fileInput").addEventListener("change", (e) => this.handleFileUpload(e));
    
    // Chart type change
    document.getElementById("chartType").addEventListener("change", () => this.updateChartType());
    
    // Download functionality
    document.getElementById("downloadChart").addEventListener("click", () => this.downloadChart());
    
    // Panel controls
    document.getElementById("showFilters").addEventListener("click", () => this.showPanel('filterPanel'));
    document.getElementById("showInsights").addEventListener("click", () => this.showPanel('insightsPanel'));
    
    // Close panel buttons
    document.querySelectorAll('.close-panel').forEach(btn => {
      btn.addEventListener('click', (e) => this.hidePanel(e.target.dataset.panel));
    });
    
    // Filter controls
    document.getElementById("applyFilters").addEventListener("click", () => this.applyFilters());
    document.getElementById("clearFilters").addEventListener("click", () => this.clearFilters());
    
    // Navigation
    document.getElementById("home").addEventListener("click", () => this.showHome());
    document.getElementById("tryNow").addEventListener("click", () => this.showApp());
    document.querySelector('.btn-outline').addEventListener("click", () => this.showApp());
  }

  showHome() {
    document.querySelector(".hero").style.display = "flex";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".wrapper").style.display = "block";
    document.querySelector(".about_us").style.display = "block";
  }

  showApp() {
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".main").style.display = "flex";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".about_us").style.display = "none";
  }

  renderChart(type, labels, datasets) {
    if (this.chart) this.chart.destroy();
    
    const isPieOrDoughnut = type === 'pie' || type === 'doughnut';
    const isScatter = type === 'scatter';
    
    // Transform data for scatter plot
    let chartData = { labels, datasets };
    if (isScatter) {
      chartData = {
        datasets: datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map((value, index) => ({
            x: index,
            y: value
          }))
        }))
      };
    }
    
    this.chart = new Chart(this.ctx, {
      type,
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { 
            position: 'top',
            display: !isPieOrDoughnut
          },
          tooltip: {
            callbacks: {
              afterBody: (tooltipItems) => {
                if (this.processedData && this.processedData.insights) {
                  return this.processedData.insights.slice(0, 2);
                }
                return [];
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value) => {
              if (isScatter && value && typeof value === 'object') {
                return value.y;
              }
              return value;
            },
            color: 'white',
            font: {
              weight: 'bold',
              size: 12
            }
          }
        },
        scales: !isPieOrDoughnut ? {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'white' }
          },
          x: {
            beginAtZero: isScatter,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'white' }
          }
        } : {}
      },
      plugins: [ChartDataLabels]
    });
  }

  renderDefaultChart() {
    this.renderChart("bar",
      ["2019", "2020", "2021", "2022"],
      [
        { label: "Sales", data: [120, 150, 180, 200] },
        { label: "Profit", data: [30, 45, 60, 70] }
      ]
    );
  }

  generateGradient(color) {
    const gradients = {
      blue: '#3a45e3',
      green: '#8647ff',
      orange: '#667eea',
      purple: '#764ba2',
      red: '#3a45e3'
    };
    return gradients[color] || this.randomColor();
  }

  randomColor() {
    // Generate colors that match the website theme (blue-purple palette)
    const themeColors = [
      '#3a45e3', '#8647ff', '#667eea', '#764ba2', '#5b6bed', 
      '#7c5aff', '#4a54e8', '#9555ff', '#6366f1', '#8b5cf6'
    ];
    return themeColors[Math.floor(Math.random() * themeColors.length)];
  }

  async handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith(".json")) {
        data = JSON.parse(text);
        // Transform JSON data to include rawData structure for filtering
        data = this.transformJSONData(data);
        this.originalData = data;
      } else if (file.name.endsWith(".csv")) {
        data = this.parseCSV(text);
        this.originalData = data;
      }

      this.processedData = { ...data };
      this.analyzeDataTypes();
      this.setupFilterControls();
      this.renderChartFromData();
      this.generateInsights();
    } catch (error) {
      alert("Error processing file: " + error.message);
    }
  }

  transformJSONData(jsonData) {
    // Transform JSON data to include rawData structure for filtering
    const { labels, datasets } = jsonData;
    const rawData = {};
    const headers = ['Label'];
    
    // Add labels as a column
    rawData['Label'] = labels;
    
    // Add each dataset as a column
    datasets.forEach(dataset => {
      headers.push(dataset.label);
      rawData[dataset.label] = dataset.data;
    });
    
    return {
      labels,
      datasets: datasets.map(ds => ({ ...ds })),
      rawData,
      headers
    };
  }

  parseCSV(text) {
    const rows = text.trim().split("\n").map(r => r.split(","));
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    const labels = dataRows.map(r => r[0]);
    const datasets = [];
    const rawData = {};

    // Store raw data for advanced processing
    headers.forEach((header, index) => {
      rawData[header] = dataRows.map(row => {
        const value = row[index];
        return isNaN(value) ? value : parseFloat(value);
      });
    });

    // Create datasets for chart
    for (let col = 1; col < headers.length; col++) {
      datasets.push({
        label: headers[col],
        data: dataRows.map(r => parseFloat(r[col]) || 0)
      });
    }

    return { labels, datasets, rawData, headers };
  }

  analyzeDataTypes() {
    if (!this.originalData.rawData) return;

    Object.entries(this.originalData.rawData).forEach(([column, values]) => {
      const sample = values.slice(0, 10);
      const numericCount = sample.filter(v => !isNaN(v) && v !== '').length;
      
      if (numericCount > sample.length * 0.8) {
        this.dataTypes[column] = 'numeric';
      } else if (sample.some(v => /^\d{4}-\d{2}-\d{2}/.test(v))) {
        this.dataTypes[column] = 'date';
      } else {
        this.dataTypes[column] = 'categorical';
      }
    });
  }

  setupFilterControls() {
    const container = document.getElementById('filterControls');
    container.innerHTML = '';

    if (!this.originalData.rawData) return;

    Object.entries(this.originalData.rawData).forEach(([column, values]) => {
      const filterGroup = document.createElement('div');
      filterGroup.className = 'filter-group';
      
      const type = this.dataTypes[column];
      let controls = `<h4>${column}</h4><div class="filter-controls">`;

      if (type === 'numeric') {
        const min = Math.min(...values.filter(v => !isNaN(v)));
        const max = Math.max(...values.filter(v => !isNaN(v)));
        controls += `
          <input type="number" class="filter-input" id="min-${column}" placeholder="Min" value="${min}" min="${min}" max="${max}">
          <input type="number" class="filter-input" id="max-${column}" placeholder="Max" value="${max}" min="${min}" max="${max}">
        `;
      } else if (type === 'categorical') {
        const unique = [...new Set(values)].sort();
        controls += `
          <div class="checkbox-container">
            <div class="checkbox-controls">
              <button type="button" class="select-all-btn" data-column="${column}">Select All</button>
              <button type="button" class="deselect-all-btn" data-column="${column}">Deselect All</button>
            </div>
            <div class="checkbox-group" id="filter-${column}">
              ${unique.map(val => `
                <label class="checkbox-label">
                  <input type="checkbox" class="filter-checkbox" value="${val}" checked>
                  <span class="checkbox-text">${val}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      } else if (type === 'date') {
        controls += `
          <input type="date" class="filter-input" id="start-${column}" placeholder="Start Date">
          <input type="date" class="filter-input" id="end-${column}" placeholder="End Date">
        `;
      }

      controls += '</div>';
      filterGroup.innerHTML = controls;
      container.appendChild(filterGroup);
    });

    // Add event listeners for select all/deselect all buttons
    container.querySelectorAll('.select-all-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const column = e.target.dataset.column;
        const checkboxes = document.querySelectorAll(`#filter-${column} .filter-checkbox`);
        checkboxes.forEach(checkbox => checkbox.checked = true);
      });
    });

    container.querySelectorAll('.deselect-all-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const column = e.target.dataset.column;
        const checkboxes = document.querySelectorAll(`#filter-${column} .filter-checkbox`);
        checkboxes.forEach(checkbox => checkbox.checked = false);
      });
    });
  }

  applyFilters() {
    if (!this.originalData.rawData) return;

    let filteredIndices = [...Array(this.originalData.labels.length).keys()];

    Object.entries(this.originalData.rawData).forEach(([column, values]) => {
      const type = this.dataTypes[column];

      if (type === 'numeric') {
        const minInput = document.getElementById(`min-${column}`);
        const maxInput = document.getElementById(`max-${column}`);
        
        if (minInput && maxInput) {
          const min = parseFloat(minInput.value);
          const max = parseFloat(maxInput.value);
          
          filteredIndices = filteredIndices.filter(i => {
            const value = parseFloat(values[i]);
            return value >= min && value <= max;
          });
        }
      } else if (type === 'categorical') {
        const checkboxGroup = document.getElementById(`filter-${column}`);
        if (checkboxGroup) {
          const selectedValues = Array.from(checkboxGroup.querySelectorAll('.filter-checkbox:checked'))
            .map(checkbox => checkbox.value);
          filteredIndices = filteredIndices.filter(i => selectedValues.includes(values[i]));
        }
      }
    });

    this.applyFilteredData(filteredIndices);
  }

  applyFilteredData(indices) {
    const filteredLabels = indices.map(i => this.originalData.labels[i]);
    const filteredDatasets = this.originalData.datasets.map(dataset => ({
      ...dataset,
      data: indices.map(i => dataset.data[i])
    }));

    this.processedData = {
      ...this.originalData,
      labels: filteredLabels,
      datasets: filteredDatasets
    };

    this.renderChartFromData();
    this.generateInsights();
  }

  clearFilters() {
    this.processedData = { ...this.originalData };
    this.setupFilterControls();
    this.renderChartFromData();
    this.generateInsights();
  }

  generateInsights() {
    if (!this.processedData || !this.processedData.datasets) return;

    const insights = this.analyzeData();
    this.displayInsights(insights);
  }

  analyzeData() {
    const insights = {
      trends: [],
      patterns: [],
      anomalies: [],
      statistics: []
    };

    this.processedData.datasets.forEach(dataset => {
      const data = dataset.data;
      const stats = this.calculateStatistics(data);
      
      // Trend analysis
      const trend = this.detectTrend(data);
      insights.trends.push({
        label: dataset.label,
        trend: trend.direction,
        description: `${dataset.label} shows a ${trend.direction} trend`
      });

      // Statistical summary
      insights.statistics.push({
        label: dataset.label,
        ...stats
      });

      // Anomaly detection
      const anomalies = this.detectAnomalies(data, stats);
      if (anomalies.length > 0) {
        insights.anomalies.push({
          label: dataset.label,
          count: anomalies.length,
          values: anomalies,
          description: `Found ${anomalies.length} potential outliers in ${dataset.label}`
        });
      }

      // Pattern recognition
      const patterns = this.detectPatterns(data);
      if (patterns.length > 0) {
        insights.patterns.push({
          label: dataset.label,
          patterns: patterns
        });
      }
    });

    return insights;
  }

  calculateStatistics(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    
    return {
      count: data.length,
      sum: sum.toFixed(2),
      mean: mean.toFixed(2),
      median: data.length % 2 === 0 
        ? ((sorted[data.length/2 - 1] + sorted[data.length/2]) / 2).toFixed(2)
        : sorted[Math.floor(data.length/2)].toFixed(2),
      std: Math.sqrt(variance).toFixed(2),
      min: Math.min(...data).toFixed(2),
      max: Math.max(...data).toFixed(2)
    };
  }

  detectTrend(data) {
    if (data.length < 2) return { direction: 'insufficient data', strength: 0 };
    
    const n = data.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = data;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
    const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);
    
    let direction = 'stable';
    if (Math.abs(slope) > 0.1) {
      direction = slope > 0 ? 'upward' : 'downward';
    }
    
    return {
      direction,
      strength: Math.round(rSquared * 100),
      slope: slope.toFixed(4)
    };
  }

  detectAnomalies(data, stats) {
    const threshold = 2; // Standard deviations
    const mean = parseFloat(stats.mean);
    const std = parseFloat(stats.std);
    
    return data.filter(value => Math.abs(value - mean) > threshold * std);
  }

  detectPatterns(data) {
    const patterns = [];
    
    // Check for cyclical patterns
    if (this.isCyclical(data)) {
      patterns.push('Cyclical pattern detected');
    }
    
    // Check for exponential growth
    if (this.isExponential(data)) {
      patterns.push('Exponential growth pattern');
    }
    
    // Check for seasonal patterns
    if (this.isSeasonal(data)) {
      patterns.push('Seasonal variation detected');
    }
    
    return patterns;
  }

  isCyclical(data) {
    if (data.length < 6) return false;
    
    // Simple autocorrelation check
    const periods = [2, 3, 4, 6];
    return periods.some(period => {
      if (data.length < period * 2) return false;
      
      let correlation = 0;
      const samples = Math.floor(data.length / period);
      
      for (let i = 0; i < samples - 1; i++) {
        const val1 = data[i * period];
        const val2 = data[(i + 1) * period];
        correlation += Math.abs(val1 - val2) < Math.abs(val1) * 0.2 ? 1 : 0;
      }
      
      return correlation / (samples - 1) > 0.6;
    });
  }

  isExponential(data) {
    if (data.length < 4) return false;
    
    // Check if log of data shows linear trend
    const logData = data.filter(d => d > 0).map(d => Math.log(d));
    if (logData.length < 4) return false;
    
    const trend = this.detectTrend(logData);
    return Math.abs(parseFloat(trend.slope)) > 0.1 && trend.strength > 70;
  }

  isSeasonal(data) {
    if (data.length < 8) return false;
    
    // Check for repeating patterns every 4 or 12 points (quarterly/monthly)
    const seasonalPeriods = [4, 12];
    
    return seasonalPeriods.some(period => {
      if (data.length < period * 2) return false;
      
      let seasonalCorrelation = 0;
      const cycles = Math.floor(data.length / period);
      
      for (let season = 0; season < period; season++) {
        const seasonValues = [];
        for (let cycle = 0; cycle < cycles; cycle++) {
          const index = cycle * period + season;
          if (index < data.length) seasonValues.push(data[index]);
        }
        
        if (seasonValues.length > 1) {
          const variance = this.calculateStatistics(seasonValues).std;
          seasonalCorrelation += parseFloat(variance) < 0.5 ? 1 : 0;
        }
      }
      
      return seasonalCorrelation / period > 0.6;
    });
  }

  displayInsights(insights) {
    // Trend insights
    const trendContainer = document.getElementById('trendInsights');
    trendContainer.innerHTML = insights.trends.map(trend => `
      <div class="insight-item">
        <strong>${trend.label}:</strong> 
        <span class="insight-trend-${trend.trend === 'upward' ? 'up' : trend.trend === 'downward' ? 'down' : 'neutral'}">
          ${trend.description}
        </span>
      </div>
    `).join('');

    // Pattern insights
    const patternContainer = document.getElementById('patternInsights');
    patternContainer.innerHTML = insights.patterns.length > 0 
      ? insights.patterns.map(pattern => `
          <div class="insight-item">
            <strong>${pattern.label}:</strong> ${pattern.patterns.join(', ')}
          </div>
        `).join('')
      : '<div class="insight-item">No significant patterns detected</div>';

    // Anomaly insights
    const anomalyContainer = document.getElementById('anomalyInsights');
    anomalyContainer.innerHTML = insights.anomalies.length > 0
      ? insights.anomalies.map(anomaly => `
          <div class="insight-item">
            <strong>${anomaly.label}:</strong> ${anomaly.description}
            <br><small>Outlier values: ${anomaly.values.slice(0, 3).map(v => v.toFixed(2)).join(', ')}${anomaly.values.length > 3 ? '...' : ''}</small>
          </div>
        `).join('')
      : '<div class="insight-item">No significant anomalies detected</div>';

    // Statistical insights
    const statsContainer = document.getElementById('statsInsights');
    statsContainer.innerHTML = insights.statistics.map(stat => `
      <div class="insight-item">
        <strong>${stat.label}:</strong><br>
        Mean: <span class="insight-value">${stat.mean}</span> | 
        Median: <span class="insight-value">${stat.median}</span> | 
        Std Dev: <span class="insight-value">${stat.std}</span><br>
        Range: <span class="insight-value">${stat.min}</span> - <span class="insight-value">${stat.max}</span>
      </div>
    `).join('');
  }

  renderChartFromData() {
    if (!this.processedData) return;
    
    this.renderChart(
      document.getElementById("chartType").value,
      this.processedData.labels,
      this.processedData.datasets
    );
  }

  updateChartType() {
    if (!this.chart) return;
    
    const newType = document.getElementById("chartType").value;
    
    // For scatter plots, we need to re-render the chart with proper data format
    if (newType === 'scatter' || this.chart.config.type === 'scatter') {
      this.renderChartFromData();
      return;
    }
    
    const isPieOrDoughnut = newType === 'pie' || newType === 'doughnut';
    
    this.chart.config.type = newType;
    
    // Update legend visibility
    this.chart.options.plugins.legend.display = !isPieOrDoughnut;
    
    // Update scales for different chart types
    if (isPieOrDoughnut) {
      this.chart.options.scales = {};
    } else {
      this.chart.options.scales = {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'white' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'white' }
        }
      };
    }
    
    this.chart.update();
  }

  downloadChart() {
    if (!this.chart) {
      alert("No chart available to download. Please upload data first.");
      return;
    }
    
    const link = document.createElement('a');
    link.download = `datavista-chart-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = this.chart.toBase64Image('image/png', 1);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showPanel(panelId) {
    // Hide all panels first
    document.querySelectorAll('.panel').forEach(panel => panel.classList.add('hidden'));
    
    // Show requested panel
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.remove('hidden');
    }
  }

  hidePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.add('hidden');
    }
  }
}

// Initialize the DataVista application
const dataAnalyzer = new DataAnalyzer();

