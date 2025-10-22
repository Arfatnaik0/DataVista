# DataVista 📊

DataVista is a powerful, interactive data visualization and analytics platform that transforms raw data into meaningful insights. With advanced filtering, grouping, data transformation tools, and AI-powered pattern recognition, DataVista empowers users to explore their data like never before.


## 📋 Table of Contents
- [Features](#-features)
- [Data Support](#-data-support)
- [Use Cases](#-use-cases)
- [Technical Details](#-technical-features)
- [Project Structure](#-project-structure)

## 🚀 Features

### Core Visualization
- **Interactive Charts**: Bar, Line, Pie, Scatter, and Doughnut charts powered by Chart.js
- **Real-time Updates**: Dynamic chart updates as you filter and transform data
- **Export Functionality**: Download charts as high-quality PNG images
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 🔍 Advanced Filtering System
- **Numeric Range Filters**: Set minimum and maximum values for numeric columns
- **Categorical Filters**: Multi-select filtering for categorical data
- **Date Range Filters**: Filter data by date ranges
- **Dynamic Filter Generation**: Automatically detects data types and creates appropriate filters
- **Real-time Application**: See results instantly as you adjust filters

### 🤖 AI-Powered Insights

#### Trend Analysis
- **Automatic Trend Detection**: Identifies upward, downward, or stable trends
- **Confidence Scoring**: Provides statistical confidence levels for detected trends
- **Linear Regression**: Calculates trend strength using R-squared values

#### Pattern Recognition
- **Cyclical Patterns**: Detects repeating cycles in data
- **Exponential Growth**: Identifies exponential growth patterns
- **Seasonal Variations**: Recognizes seasonal trends and variations
- **Autocorrelation Analysis**: Advanced statistical pattern detection

#### Anomaly Detection
- **Outlier Identification**: Uses statistical methods to find anomalies
- **Threshold-based Detection**: Configurable sensitivity for outlier detection
- **Visual Highlighting**: Anomalies are highlighted in insights panel

#### Statistical Analysis
- **Descriptive Statistics**: Mean, median, standard deviation, min/max
- **Distribution Analysis**: Comprehensive statistical summaries
- **Correlation Detection**: Identifies relationships between variables

## 📊 Data Support

### File Formats
- **CSV Files**: Comma-separated values with automatic parsing
- **JSON Files**: Structured data with labels and datasets
- **Auto-detection**: Intelligent data type recognition

### Data Types
- **Numeric**: Integers and floating-point numbers
- **Categorical**: Text-based categories and classifications
- **Date/Time**: Date values with temporal analysis

## 🎯 Use Cases

### Business Analytics
- Sales performance analysis
- Marketing campaign effectiveness
- Customer satisfaction tracking
- Financial trend analysis

### Research & Academia
- Scientific data exploration
- Survey result analysis
- Experimental data visualization
- Statistical research support

### Operations & Performance
- KPI monitoring and tracking
- Process optimization analysis
- Quality control metrics
- Performance benchmarking


### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional software required!

### Sample CSV Format
```csv
Category,2019,2020,2021,2022
Sales,120,150,180,220
Revenue,340,280,350,400
```

### Sample JSON Format
```json
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [
    {
      "label": "Revenue",
      "data": [45, 59, 80, 81]
    }
  ]
}
```

## 🛠 Technical Features

### Architecture
- **Object-Oriented Design**: Clean, maintainable code structure
- **Modular Components**: Separated concerns for filters, transforms, and insights
- **Event-Driven**: Responsive UI with proper event handling

### Performance
- **Efficient Data Processing**: Optimized algorithms for large datasets
- **Memory Management**: Smart data caching and processing
- **Real-time Updates**: Immediate visual feedback for all operations

### UI/UX
- **Intuitive Interface**: Clean, modern design with clear navigation
- **Progressive Disclosure**: Advanced features revealed when needed
- **Responsive Panels**: Adaptive layout for different screen sizes
- **Visual Feedback**: Loading indicators and status updates

## 🔬 AI & Machine Learning Features

### Statistical Algorithms
- **Linear Regression**: For trend analysis and prediction
- **Autocorrelation**: For cyclical pattern detection
- **Z-Score Analysis**: For outlier and anomaly detection
- **Time Series Analysis**: For temporal pattern recognition

### Pattern Recognition
- **Fourier Analysis**: For frequency-based pattern detection
- **Moving Averages**: For smoothing and trend identification
- **Correlation Matrices**: For relationship analysis


### Filter Combinations
- Use multiple filters simultaneously for complex data exploration
- Numeric filters are inclusive (includes boundary values)
- Categorical filters support multiple selections

### Chart Selection
- **Bar Charts**: Best for comparing categories
- **Line Charts**: Ideal for showing trends over time
- **Pie Charts**: Perfect for showing proportions
- **Scatter Plots**: Great for correlation analysis

## 📂 Project Structure

```
DataVista/
├── Main/
│   ├── index.html          # Main application HTML
│   ├── script.js           # Core JavaScript logic and DataAnalyzer class
│   └── style.css           # Styling and responsive design
├── sample-data.csv         # Sample CSV data for testing
├── sample-data.json        # Sample JSON data for testing
└── README.md              # Project documentation
```

### Key Components

- **`DataAnalyzer` Class**: Core analytics engine handling data processing, visualization, and insights
- **Chart Rendering**: Powered by Chart.js for interactive visualizations
- **Filter System**: Dynamic filter generation based on data types
- **Insights Engine**: AI-powered pattern recognition and anomaly detection

## Acknowledgments

- [Chart.js](https://www.chartjs.org/) - Beautiful, responsive charts
- [Spline](https://spline.design/) - 3D interactive experiences
- [Google Fonts](https://fonts.google.com/) - Beautiful typography





