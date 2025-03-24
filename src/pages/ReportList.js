import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Table, Button, Space, Typography, Popconfirm, Tag, 
  Card, notification, Divider, Statistic, Row, Col,
  Select, Form 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  FileTextOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import ReportService from '../services/report.service';
import dayjs from 'dayjs';
import ExportService from '../services/export.service';
import ExportPdfDialog from '../components/ExportPdfDialog';
import QuickFilters from '../components/QuickFilters';


const { Title, Text } = Typography;

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const navigate = useNavigate();

  // Access app context for currency
  const { currency } = useContext(AppContext);

  // PDF export refs and state
  const reportRef = useRef(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters when they change or when reports change
  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await ReportService.getReports();
      setReports(response.data);
      
      // Calculate overall totals
      const income = response.data.reduce((sum, report) => sum + parseFloat(report.totalIncome), 0);
      const expense = response.data.reduce((sum, report) => sum + parseFloat(report.totalExpense), 0);
      
      setTotalIncome(income);
      setTotalExpense(expense);
      setFilteredReports(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch reports. Please try again later.',
      });
      console.error('Error fetching reports:', error);
    }
  };

  const applyFilters = () => {
    let result = [...reports];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchLower) || 
        r.type.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(r => r.type === filters.type);
    }
    
    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter(r => new Date(r.fromDate) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(r => new Date(r.toDate) <= endDate);
    }
    
    setFilteredReports(result);
  };

  // Get unique report types for filtering
  const getReportTypes = () => {
    const types = [...new Set(reports.map(r => r.type))];
    return types;
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle search
  const handleSearch = () => {
    applyFilters();
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await ReportService.deleteReport(id);
      notification.success({
        message: 'Success',
        description: 'Report deleted successfully',
      });
      fetchReports();
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: 'Failed to delete report. Please try again.',
      });
      console.error('Error deleting report:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/app/reports/edit/${id}`);
  };

  // Handle PDF export dialog open/close
  const handleOpenPdfDialog = (report) => {
    setSelectedReport(report);
    setPdfDialogOpen(true);
  };

  const handleClosePdfDialog = () => {
    setPdfDialogOpen(false);
    setExportError(null);
    setSelectedReport(null);
  };

  // Handle actual PDF export
  const handleExportPdf = async (exportOptions) => {
    try {
      setExportLoading(true);
      
      // Get the element to be exported
      const elementToExport = reportRef.current;
      if (!elementToExport) {
        throw new Error("No content to export");
      }
      
      // Use the enhanced PDF export
      const pdf = await ExportService.generatePDF(elementToExport, {
        title: exportOptions.title || (selectedReport ? selectedReport.title : 'Financial Report'),
        subtitle: exportOptions.subtitle || `Financial Report: ${exportOptions.dateRange}`,
        orientation: exportOptions.orientation || 'portrait',
        format: exportOptions.pageSize || 'a4',
        companyInfo: {
          name: exportOptions.companyName || 'Financial Management System',
          logo: null
        },
        dateRange: exportOptions.dateRange || (selectedReport ? 
          `${dayjs(selectedReport.fromDate).format('MMM DD, YYYY')} - ${dayjs(selectedReport.toDate).format('MMM DD, YYYY')}` : 
          ''),
        creator: "Financial Management App",
        currency: currency || "$"
      });
      
      // Download the PDF
      const filename = `${(exportOptions.title || 'financial_report').toLowerCase().replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.pdf`;
      pdf.save(filename);
      
      setExportLoading(false);
      setPdfDialogOpen(false);
    } catch (error) {
      console.error("PDF Export error:", error);
      setExportError(`Failed to export PDF: ${error.message}`);
      setExportLoading(false);
    }
  };

  // Get all unique categories for the PDF export dialog
  const getUniqueCategories = () => {
    const categories = new Set();
    reports.forEach(report => {
      if (report.categories) {
        report.categories.split(',').forEach(cat => categories.add(cat.trim()));
      }
    });
    return Array.from(categories);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: type => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_, record) => (
        <span>
          {dayjs(record.fromDate).format('MM/DD/YYYY')} - {dayjs(record.toDate).format('MM/DD/YYYY')}
        </span>
      ),
    },
    {
      title: 'Income',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
      render: amount => (
        <span style={{ color: '#3f8600' }}>
          ${parseFloat(amount).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Expense',
      dataIndex: 'totalExpense',
      key: 'totalExpense',
      render: amount => (
        <span style={{ color: '#cf1322' }}>
          ${parseFloat(amount).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: balance => (
        <span style={{ color: parseFloat(balance) >= 0 ? '#3f8600' : '#cf1322', fontWeight: 'bold' }}>
          ${parseFloat(balance).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            size="small"
            onClick={() => handleOpenPdfDialog(record)}
          >
            Export PDF
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this report?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div ref={reportRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Financial Reports</Title>
        <Space>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => handleOpenPdfDialog(null)}
          >
            Export All as PDF
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/app/reports/add')}
          >
            Create Report
          </Button>
        </Space>
      </div>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Create and manage financial reports for different time periods.
      </Text>
      
      {/* Quick Filters Component */}
      <Card style={{ marginBottom: 24 }}>
        <QuickFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          categories={[]}
          showAmountFilter={false}
          additionalFilters={
            getReportTypes().length > 0 ? (
              <Form.Item label="Report Type">
                <Select
                  name="type"
                  value={filters.type || ''}
                  onChange={(value) => handleFilterChange({...filters, type: value})}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="">All Types</Select.Option>
                  {getReportTypes().map(type => (
                    <Select.Option key={type} value={type}>{type}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null
          }
        />
      </Card>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Income (All Reports)"
              value={totalIncome}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Expenses (All Reports)"
              value={totalExpense}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Net Balance (All Reports)"
              value={totalIncome - totalExpense}
              precision={2}
              valueStyle={{ color: totalIncome - totalExpense >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Table
        columns={columns}
        dataSource={filteredReports}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      {/* PDF Export Dialog */}
      <ExportPdfDialog
        open={pdfDialogOpen}
        onClose={handleClosePdfDialog}
        onExport={handleExportPdf}
        defaultValues={{
          title: selectedReport ? selectedReport.title : 'Financial Reports Summary',
          subtitle: selectedReport ? 
            `${selectedReport.type} Report` : 
            'Overview of all financial reports'
        }}
        categories={getUniqueCategories()}
        filters={{
          startDate: selectedReport ? selectedReport.fromDate : null,
          endDate: selectedReport ? selectedReport.toDate : null
        }}
      />
    </div>
  );
};

export default ReportList;
