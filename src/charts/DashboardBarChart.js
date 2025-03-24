import React, { useEffect, useRef, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Typography, CircularProgress, Paper } from '@mui/material';
import './BarChart.css';
import { chartColors, chartOptions, createGradient, truncateLabel } from './ChartConfig';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Bar Chart component for financial data visualization
 * Displays category-based financial data in bars
 * 
 * @param {Object[]} data - Array of data objects with label, value, and type properties
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 * @param {boolean} showLegend - Whether to show the chart legend
 * @param {boolean} stacked - Whether to stack bars in the chart
 * @param {boolean} horizontal - Whether to display bars horizontally
 * @param {boolean} showGradient - Whether to show gradient fill in bars
 * @param {string} currency - Currency symbol
 */
const DashboardBarChart = ({ 
  data, 
  title = "Dashboard Chart", 
  height = 400,
  showLegend = true,
  stacked = false,
  horizontal = false,
  showGradient = chartOptions.tooltip.enabled,
  currency = chartOptions.currency.symbol
}) => {
  const [chartData, setChartData] = useState(null);
  const [types, setTypes] = useState([]);
  const chartRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Transform data to format expected by Chart.js
    const labels = [...new Set(data.map(item => item.category || item.label))];
    // Get unique data types (like Income and Expense)
    const dataTypes = [...new Set(data.map(item => item.type))];
    setTypes(dataTypes);
    
    let datasets;
    
    if (dataTypes.length > 1 && stacked) {
      // Create separate datasets for each type when stacked
      datasets = dataTypes.map(type => {
        const typeData = data.filter(item => item.type === type);
        const baseColor = type === 'Income' ? chartColors.income : chartColors.expense;
        
        return {
          label: type,
          data: labels.map(label => {
            const item = typeData.find(d => (d.category || d.label) === label);
            return item ? item.value : 0;
          }),
          backgroundColor: showGradient ? createGradient(baseColor, chartColors.gradientStart, chartColors.gradientEnd) : baseColor,
          borderColor: baseColor,
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: type === 'Income' ? theme.palette.success.light : theme.palette.error.light,
        };
      });
    } else {
      // Single dataset with individual colors
      datasets = [{
        label: title,
        data: data.map(item => item.value),
        backgroundColor: data.map(item => 
          showGradient 
            ? createGradient(item.color || theme.palette.primary.main, chartColors.gradientStart, chartColors.gradientEnd) 
            : (item.color || theme.palette.primary.main)
        ),
        borderColor: data.map(item => item.borderColor || item.color || theme.palette.primary.main),
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: data.map(item => item.hoverColor || (item.type === 'Income' ? theme.palette.success.light : theme.palette.error.light)),
      }];
    }

    const transformedData = {
      labels: labels.map(label => isMobile && label.length > 10 
        ? truncateLabel(label, 8)
        : label
      ),
      datasets
    };

    setChartData(transformedData);
  }, [data, title, isMobile, theme, stacked, showGradient]);

  const getOptions = () => {
    return {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: chartOptions.responsive.enableResponsiveness,
      maintainAspectRatio: chartOptions.responsive.maintainAspectRatio,
      plugins: {
        legend: {
          display: showLegend && (!isMobile || types?.length > 1),
          position: chartOptions.legend.position,
          align: 'center',
          labels: {
            boxWidth: 12,
            usePointStyle: chartOptions.legend.usePointStyle,
            padding: 10,
            font: {
              size: isTablet ? 10 : chartOptions.legend.fontSize
            }
          }
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
            bottom: 20
          }
        },
        tooltip: {
          enabled: chartOptions.tooltip.enabled,
          backgroundColor: chartOptions.tooltip.backgroundColor,
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
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.y || context.parsed.x || context.raw;
              
              // If we have the original data point, use it for more context
              const originalItem = Array.isArray(data) && context.dataIndex < data.length
                ? data[context.dataIndex] 
                : null;
                
              const prefix = originalItem?.type || datasetLabel;
              const formattedValue = `${currency}${value.toFixed(chartOptions.currency.decimalPlaces)}`;
              
              return `${prefix}: ${formattedValue}`;
            }
          }
        },
      },
      scales: {
        y: {
          stacked: stacked,
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12,
            },
            padding: 5,
            callback: function(value) {
              return isMobile 
                ? `${currency}${value}` 
                : `${currency}${value.toFixed(0)}`;
            }
          },
          border: {
            display: false
          }
        },
        x: {
          stacked: stacked,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: isMobile ? 9 : 12,
            },
            maxRotation: isMobile ? 45 : 30,
            minRotation: isMobile ? 45 : 0,
            padding: 5
          },
          border: {
            display: false
          }
        },
      },
      animation: {
        duration: chartOptions.animation.duration,
        easing: chartOptions.animation.easing,
      },
      layout: {
        padding: {
          top: 5,
          right: isMobile ? 5 : 15,
          bottom: 10,
          left: isMobile ? 5 : 15,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      elements: {
        bar: {
          borderRadius: 4
        }
      }
    };
  };

  if (!chartData) {
    return (
      <Paper
        className="bar-chart-container chart-loading" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: height || 300,
          bgcolor: 'background.paper'
        }}
        elevation={0}
      >
        <CircularProgress size={isMobile ? 24 : 30} />
        <Typography variant="body2" sx={{ mt: 1 }}>Loading chart...</Typography>
      </Paper>
    );
  }

  return (
    <Paper className="bar-chart-container" elevation={0} sx={{ height: isMobile ? height - 40 : height }}>
      <Bar 
        ref={chartRef}
        data={chartData} 
        options={getOptions()} 
        height={height}
      />
    </Paper>
  );
};

export default DashboardBarChart;
