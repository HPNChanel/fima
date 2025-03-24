import React, { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { 
  useMediaQuery, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  Grid
} from '@mui/material';
import './BarChart.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const DashboardPieChart = ({ 
  data, 
  title = "Category Distribution", 
  height = 300, 
  isDoughnut = false,
  showLegend = true,
  showLabels = false,
  currency = '$'
}) => {
  const [chartData, setChartData] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const chartRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Default color palette
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main, 
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', 
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate total for percentage
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    setTotalValue(total);

    // Generate chart data
    const transformedData = {
      labels: data.map(item => isMobile ? truncateLabel(item.label || item.category, 10) : (item.label || item.category)),
      datasets: [
        {
          data: data.map(item => item.value),
          backgroundColor: data.map((item, index) => item.color || defaultColors[index % defaultColors.length]),
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 0
        }
      ]
    };

    setChartData(transformedData);
  }, [data, theme, isMobile]);

  const truncateLabel = (label, maxLength) => {
    return label.length > maxLength ? `${label.substring(0, maxLength-3)}...` : label;
  };

  const getOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 5,
          right: 0,
          bottom: 5,
          left: 0
        }
      },
      plugins: {
        legend: {
          display: showLegend && (!isMobile || data.length <= 5),
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: isMobile ? 10 : 12,
            padding: isMobile ? 8 : 15,
            font: {
              size: isMobile ? 10 : 11
            },
            generateLabels: function(chart) {
              const original = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
              
              if (showLabels) {
                // Add value and percentage to legend
                original.forEach((label, i) => {
                  const value = chart.data.datasets[0].data[i];
                  const percentage = ((value / totalValue) * 100).toFixed(1);
                  label.text = `${label.text} (${currency}${value}, ${percentage}%)`;
                });
              }
              
              return original;
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const percentage = totalValue ? ((value / totalValue) * 100).toFixed(1) : 0;
              return `${label}: ${currency}${value.toFixed(2)} (${percentage}%)`;
            }
          },
          titleFont: {
            size: 13,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          bodySpacing: 4,
          padding: 10,
          boxPadding: 3,
          usePointStyle: true
        },
        title: {
          display: !!title,
          text: title,
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
      },
      cutout: isDoughnut ? '60%' : 0,
      radius: isMobile ? '80%' : '90%'
    };
  };

  // Show center total for doughnut chart
  const renderDoughnutCenterText = () => {
    if (!isDoughnut || !chartRef.current) return null;
    
    return (
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {currency}{totalValue.toFixed(2)}
        </Typography>
      </Box>
    );
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

  const Chart = isDoughnut ? Doughnut : Pie;

  // For smaller screens, show a more compact layout
  return (
    <Paper
      className="pie-chart-container"
      elevation={0}
      sx={{
        height: height,
        position: 'relative',
        display: 'flex',
        flexDirection: isMobile && showLegend ? 'column' : 'row',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: isMobile && showLegend ? '100%' : showLegend ? '70%' : '100%',
          height: isMobile && showLegend ? '70%' : '100%'
        }}
      >
        <Chart 
          ref={chartRef}
          data={chartData} 
          options={getOptions()} 
        />
        {renderDoughnutCenterText()}
      </Box>
      
      {isMobile && showLegend && data.length > 5 && (
        <Box sx={{ width: '100%', mt: 2, px: 1, maxHeight: '30%', overflowY: 'auto' }}>
          <Grid container spacing={1}>
            {data.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: item.color || defaultColors[index % defaultColors.length],
                      mr: 0.5 
                    }}
                  />
                  <Typography variant="caption" noWrap title={item.label || item.category}>
                    {truncateLabel(item.label || item.category, 12)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default DashboardPieChart;
