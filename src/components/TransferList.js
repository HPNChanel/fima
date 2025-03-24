import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin, Empty, notification } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import TransferService from '../services/transfer.service';
import moment from 'moment';

const TransferList = ({ refreshTrigger }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, [refreshTrigger]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await TransferService.getTransfers();
      setTransfers(response.data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Could not fetch transfers',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'From Account',
      dataIndex: 'sourceAccountName',
      key: 'sourceAccountName',
    },
    {
      title: '',
      key: 'transferIcon',
      width: 50,
      render: () => <SwapOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: 'To Account',
      dataIndex: 'destinationAccountName',
      key: 'destinationAccountName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Tag color="green">${parseFloat(amount).toFixed(2)}</Tag>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  if (loading) {
    return <Spin tip="Loading transfers..." />;
  }

  if (transfers.length === 0) {
    return <Empty description="No transfers found" />;
  }

  return (
    <Table 
      columns={columns} 
      dataSource={transfers.map(transfer => ({ ...transfer, key: transfer.id }))} 
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};

export default TransferList;
