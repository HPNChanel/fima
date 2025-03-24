import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Typography, Card, notification } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReportService from '../services/report.service';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchReport(id);
    }
  }, [id]);

  const fetchReport = async (reportId) => {
    try {
      setLoadingData(true);
      const response = await ReportService.getReport(reportId);
      const report = response.data;
      
      form.setFieldsValue({
        title: report.title,
        type: report.type,
        dateRange: [
          dayjs(report.fromDate),
          dayjs(report.toDate)
        ],
      });
      
      setLoadingData(false);
    } catch (error) {
      setLoadingData(false);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch report details. Please try again.',
      });
      console.error('Error fetching report:', error);
      navigate('/app/reports');
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const reportData = {
        title: values.title,
        type: values.type,
        fromDate: values.dateRange[0].format('YYYY-MM-DD'),
        toDate: values.dateRange[1].format('YYYY-MM-DD')
      };
      
      if (isEdit) {
        await ReportService.updateReport(id, reportData);
        notification.success({
          message: 'Success',
          description: 'Report updated successfully',
        });
      } else {
        await ReportService.createReport(reportData);
        notification.success({
          message: 'Success',
          description: 'Report created successfully',
        });
      }
      
      navigate('/app/reports');
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: `Failed to ${isEdit ? 'update' : 'create'} report. Please try again.`,
      });
      console.error(`Error ${isEdit ? 'updating' : 'creating'} report:`, error);
    }
  };

  // Get default date range for current month
  const getDefaultDateRange = () => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    return [startOfMonth, today];
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link to="/app/reports">
          <Button icon={<ArrowLeftOutlined />}>Back to Reports</Button>
        </Link>
      </div>

      <Card loading={loadingData}>
        <Title level={2}>{isEdit ? 'Edit Report' : 'Create Report'}</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          {isEdit ? 'Update the details of this financial report.' : 'Create a new financial report for a specific time period.'}
        </Text>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dateRange: getDefaultDateRange(),
            type: 'MONTHLY',
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="title"
            label="Report Title"
            rules={[{ required: true, message: 'Please enter a title for the report' }]}
          >
            <Input placeholder="e.g., Monthly Budget Review - September 2023" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Report Type"
            rules={[{ required: true, message: 'Please select a report type' }]}
          >
            <Select>
              <Option value="DAILY">Daily</Option>
              <Option value="WEEKLY">Weekly</Option>
              <Option value="MONTHLY">Monthly</Option>
              <Option value="YEARLY">Yearly</Option>
              <Option value="CUSTOM">Custom</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: 'Please select a date range' }]}
          >
            <RangePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEdit ? 'Update Report' : 'Generate Report'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ReportForm;
