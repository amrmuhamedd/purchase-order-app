import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  Button,
  notification,
  Upload,
  Tabs,
  Table,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import moment from "moment";
const { Dragger } = Upload;
const { TabPane } = Tabs;
const App = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setISubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [form] = Form.useForm();
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/purchase-orders"
      );
      const data = await response.data;
      setPurchaseOrders(data);
      setIsLoading(false);
    };

    fetchPurchaseOrders();
  }, [isSubmitted]);
  const handleFormSubmit = async (values) => {
    const { date, vendorName, file } = values;

    const formData = new FormData();
    formData.append("date", date.format("YYYY-MM-DD"));
    formData.append("vendorName", vendorName);
    formData.append("file", file[0].originFileObj);
    console.log(file[0].originFileObj);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/purchase-orders",
        formData
      );
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      setISubmitted(!isSubmitted);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    }
  };

  const columns = [
    {
      title: "Model Number",
      dataIndex: "modelNumber",
      key: "modelNumber",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Form" key="form">
          <div style={{ width: "600px" }}>
            <h1 style={{ textAlign: "center" }}>Bulk Purchase Order</h1>
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                name="vendorName"
                label="Vendor Name"
                rules={[
                  { required: true, message: "Please enter the vendor name" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="file"
                label="CSV File"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                rules={[
                  { required: true, message: "Please upload a CSV file" },
                ]}
              >
                <Dragger
                  beforeUpload={(e) => {
                    e.preventDefault(); // Prevent default form submission behavior
                    return false; // Prevent file upload
                  }}
                  accept=".csv"
                  maxCount={1}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">Only CSV files are allowed</p>
                </Dragger>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </TabPane>
        <TabPane tab="Table" key="table">
          <Table
            dataSource={purchaseOrders}
            columns={columns}
            loading={isLoading}
            rowKey={(record) => record._id}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
