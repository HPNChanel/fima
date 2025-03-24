import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, notification } from 'antd';
import AccountService from '../services/account.service';
import TransferService from '../services/transfer.service';

const { Option } = Select;
const { TextArea } = Input;

const TransferForm = ({ onSuccess, preSelectedAccountId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [sourceAccountId, setSourceAccountId] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await AccountService.getAccounts();
        setAccounts(response.data);
        
        // If a source account is pre-selected, set it
        if (preSelectedAccountId && !sourceAccountId) {
          setSourceAccountId(preSelectedAccountId);
          form.setFieldsValue({
            sourceAccountId: preSelectedAccountId
          });
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Could not fetch accounts',
        });
      }
    };

    fetchAccounts();
  }, [form, preSelectedAccountId, sourceAccountId]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await TransferService.createTransfer({
        sourceAccountId: values.sourceAccountId,
        destinationAccountId: values.destinationAccountId,
        amount: values.amount,
        description: values.description,
      });
      
      notification.success({
        message: 'Success',
        description: 'Transfer completed successfully',
      });
      
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error completing transfer';
      notification.error({
        message: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out the source account from destination options
  const getDestinationOptions = () => {
    return accounts.filter(account => account.id !== sourceAccountId);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="sourceAccountId"
        label="From Account"
        rules={[{ required: true, message: 'Please select source account' }]}
      >
        <Select 
          placeholder="Select source account" 
          onChange={(value) => setSourceAccountId(value)}
        >
          {accounts.map(account => (
            <Option key={account.id} value={account.id}>
              {account.name} (Balance: ${account.balance})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="destinationAccountId"
        label="To Account"
        rules={[
          { required: true, message: 'Please select destination account' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('sourceAccountId') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Source and destination accounts cannot be the same'));
            },
          }),
        ]}
      >
        <Select placeholder="Select destination account" disabled={!sourceAccountId}>
          {getDestinationOptions().map(account => (
            <Option key={account.id} value={account.id}>
              {account.name} (Balance: ${account.balance})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true, message: 'Please enter amount' },
          { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
        ]}
      >
        <InputNumber 
          style={{ width: '100%' }} 
          precision={2} 
          prefix="$" 
          placeholder="0.00" 
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={2} placeholder="Transfer description (optional)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Complete Transfer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransferForm;
