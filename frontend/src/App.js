import React, { useState } from "react";
import axios from "axios";
import { Form, Input, DatePicker, Button, notification, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const App = () => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (values) => {
    const { date, vendorName, file } = values;

    const formData = new FormData();
    formData.append("date", date.format("YYYY-MM-DD"));
    formData.append("vendorName", vendorName);
    formData.append("file", file[0].originFileObj);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/purchase-orders",
        formData
      );
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response.data.message,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
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
            rules={[{ required: true, message: "Please upload a CSV file" }]}
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
    </div>
  );
};

export default App;
