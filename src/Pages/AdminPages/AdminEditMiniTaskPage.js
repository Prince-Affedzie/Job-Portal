import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
  Checkbox,
  message,
  Spin,
  Typography,
  Row,
  Col,
  Card
} from "antd";
import dayjs from "dayjs";
import { getSingleMinitask, updateMiniTaskByAdmin } from "../../APIS/API";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";

const { Title } = Typography;
const { TextArea } = Input;

const AdminEditMiniTaskPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  useEffect(() => {
    if (Id) fetchTask();
  }, [Id]);

  const fetchTask = async () => {
    try {
      const res = await getSingleMinitask(Id);
      if (res.status === 200) {
        setTask(res.data);
        form.setFieldsValue({
          ...res.data,
          deadline: dayjs(res.data.deadline),
        });
      }
    } catch (error) {
      message.error("Failed to load task.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        deadline: values.deadline.toISOString(),
      };
      const res = await updateMiniTaskByAdmin(Id, payload);
      if (res.status === 200) {
        message.success("MiniTask updated successfully");
        navigate(`/admin/${Id}/mini_task_info`);
      }
    } catch (error) {
      message.error("Failed to update MiniTask");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
  if (!task) return <div className="text-center mt-10 text-gray-500">Task not found.</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <AdminSidebar 
               isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)}
               />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <div className="sticky top-0 z-10">
         <AdminNavbar 
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                 isSidebarOpen={isSidebarOpen} 
                 />
        </div>

        {/* Content */}
        <div className="p-8 w-full max-w-7xl mx-auto"> {/* Changed to max-w-7xl for wider container */}
          <Card className="rounded-2xl shadow-md border-0"> {/* Using Antd Card for better styling */}
            <Title level={2} className="!text-2xl mb-6 text-center">
              Edit MiniTask
            </Title>
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={onFinish}
              className="wide-admin-form" // Added custom class
            >
              <Row gutter={24}> {/* Added gutter for spacing between columns */}
                <Col xs={24} lg={12}> {/* Split form into two columns on large screens */}
                  <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input size="large" placeholder="Enter task title" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Form.Item label="Budget (GHS)" name="budget" rules={[{ required: true }]}>
                    <InputNumber 
                      min={0} 
                      style={{ width: "100%" }} 
                      size="large"
                      placeholder="e.g., 50" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <TextArea 
                  rows={4} 
                  size="large"
                  placeholder="Describe the task clearly..." 
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Deadline" name="deadline" rules={[{ required: true }]}>
                    <DatePicker 
                      style={{ width: "100%" }} 
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Form.Item label="Location Type" name="locationType" rules={[{ required: true }]}>
                    <Select 
                      placeholder="Select location type"
                      size="large"
                    >
                      <Select.Option value="remote">Remote</Select.Option>
                      <Select.Option value="on-site">On-site</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                    <Input 
                      size="large"
                      placeholder="e.g., Design" 
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Form.Item label="Subcategory" name="subcategory">
                    <Input 
                      size="large"
                      placeholder="e.g., Logo Design" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Skills Required" name="skillsRequired">
                <Select 
                  mode="tags" 
                  size="large"
                  placeholder="Add relevant skills" 
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item name="verificationRequired" valuePropName="checked">
                    <Checkbox>Verification Required</Checkbox>
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                    <Select size="large">
                      {["Assigned", "Completed", "Closed","In-progress", "Open", "Pending", "Review", "Rejected"].map((s) => (
                        <Select.Option key={s} value={s}>
                          {s}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Title level={4} className="!text-lg mb-4">Address Information</Title>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item label="Region" name={["address", "region"]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="City" name={["address", "city"]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Suburb" name={["address", "suburb"]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="text-center mt-8">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 h-11 px-8"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      <style jsx>{`
        /* Custom styles for wider form on large screens */
        @media (min-width: 1024px) {
          :global(.wide-admin-form) {
            max-width: 100% !important;
          }
          
          :global(.wide-admin-form .ant-form-item) {
            margin-bottom: 20px;
          }
          
          :global(.wide-admin-form .ant-form-item-label > label) {
            font-weight: 500;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEditMiniTaskPage;