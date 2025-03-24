import React, { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { 
  useMediaQuery, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper 
} from '@mui/material';
import './BarChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardLineChart = ({
  data = [],
  labels = [],
  title = "Financial Trend",
  height = 300,
  showLegend = true,
  fillArea = true,
  tension = 0.3,
  currency = '$',
  showGrid = true
}) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!data || data.length === 0 || !labels || labels.length === 0) return;

    // Process data series
    // If data is already in the correct format (array of series objects with data arrays)
    // use it directly, otherwise convert single series to expected format
    const datasets = Array.isArray(data[0]) || (data[0] && Array.isArray(data[0].data)) 
      ? processMultipleDataSeries(data)
      : processSingleDataSeries(data);

    const chartDataConfig = {
      labels: labels.map(label => isMobile && String(label).length > 8 ? 
                                  String(label).substring(0, 6) + '..' : 
                                  label),
      datasets
    };

    setChartData(chartDataConfig);
  }, [data, labels, theme, isMobile, fillArea, tension]);

  // Process multiple data series
  const processMultipleDataSeries = (seriesArray) => {
    // Default colors if not provided
    const defaultColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main
    ];

    return seriesArray.map((series, index) => {
      // Handle both formats: array of values or object with data property
      const values = Array.isArray(series) ? series : series.data;
      const baseColor = series.color || defaultColors[index % defaultColors.length];
      
      return {
        label: series.label || `Series ${index + 1}`,
        data: values,
        borderColor: baseColor,
        backgroundColor: createGradient(baseColor),
        borderWidth: 2,
        fill: fillArea,
        tension: tension,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: baseColor,
        pointBorderWidth: 2,
        pointRadius: isMobile ? 2 : 3,
        pointHoverRadius: isMobile ? 4 : 6,
      };
    });
  };

  // Process a single data series
  const processSingleDataSeries = (dataArray) => {
    const baseColor = theme.palette.primary.main;
    
    return [{
      label: title,
      data: dataArray,
      borderColor: baseColor,
      backgroundColor: createGradient(baseColor),
      borderWidth: 2,
      fill: fillArea,
      tension: tension,
      pointBackgroundColor: theme.palette.background.paper,
      pointBorderColor: baseColor,
      pointBorderWidth: 2,
      pointRadius: isMobile ? 2 : 3,
      pointHoverRadius: isMobile ? 4 : 6,
    }];
  };

  // Create gradient fill
  const createGradient = (color) => {
    if (!fillArea) return color;

    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return color;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `${color}80`); // Add 50% alpha
    gradient.addColorStop(1, `${color}00`); // Completely transparent
    return gradient;
  };

  const getOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend && (!isMobile || (Array.isArray(data[0]) && data.length <= 3)),
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            boxHeight: 6,
            padding: 15,
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: isMobile ? 12 : 14,
          },
          bodyFont: {
            size: isMobile ? 11 : 13,
          },
          padding: isMobile ? 6 : 10,
          cornerRadius: 4,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${currency}${value.toFixed(2)}`;
            }
          },
          intersect: false,
          mode: 'index'
        },
        title: {
          display: !!title && !isMobile,
          text: title,
          font: {
            size: isTablet ? 14 : 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: showGrid ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            drawBorder: false,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12,
            },
            padding: 5,
            callback: function(value) {
              return `${currency}${value.toFixed(0)}`;
            }
          },
          border: {
            display: false
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: isMobile ? 9 : 11,
            },
            maxRotation: isMobile ? 45 : 0,
            padding: 5
          },
          border: {
            display: false
          }
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      elements: {
        line: {
          borderJoinStyle: 'round'
        }
      }
    };
  };

  if (!chartData) {
    return (
      <Paper
        className="chart-container chart-loading" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: height,
          position: 'relative'
        }}
        elevation={0}
      >
        <CircularProgress size={isMobile ? 24 : 30} />
        <Typography variant="body2" sx={{ mt: 1 }}>Loading chart...</Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      className="line-chart-container" 
      elevation={0}
      sx={{ 
        height: height,
        position: 'relative'
      }}
    >
      <Line
        ref={chartRef}
        data={chartData}
        options={getOptions()}
        height={height}
      />
    </Paper>
  );
};

export default DashboardLineChart;
