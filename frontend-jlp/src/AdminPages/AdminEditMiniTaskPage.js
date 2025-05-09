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
} from "antd";
import dayjs from "dayjs";
import { getSingleMinitask, updateMiniTaskByAdmin } from "../APIS/API";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";

const { Title } = Typography;
const { TextArea } = Input;

const AdminEditMiniTaskPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <AdminNavbar />
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <Title level={3} className="!text-2xl mb-6">
              ✏️ Edit MiniTask
            </Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="Enter task title" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Describe the task clearly..." />
              </Form.Item>

              <Form.Item label="Budget (GHS)" name="budget" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g., 50" />
              </Form.Item>

              <Form.Item label="Deadline" name="deadline" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Location Type" name="locationType" rules={[{ required: true }]}>
                <Select placeholder="Select location type">
                  <Select.Option value="remote">Remote</Select.Option>
                  <Select.Option value="on-site">On-site</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <Input placeholder="e.g., Design" />
              </Form.Item>

              <Form.Item label="Subcategory" name="subcategory">
                <Input placeholder="e.g., Logo Design" />
              </Form.Item>

              <Form.Item label="Skills Required" name="skillsRequired">
                <Select mode="tags" placeholder="Add relevant skills" />
              </Form.Item>

              <Form.Item name="verificationRequired" valuePropName="checked">
                <Checkbox>Verification Required</Checkbox>
              </Form.Item>

              <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                <Select>
                  {["Open", "In-progress", "Assigned", "Completed", "Closed"].map((s) => (
                    <Select.Option key={s} value={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="Region" name={["address", "region"]}>
                  <Input />
                </Form.Item>
                <Form.Item label="City" name={["address", "city"]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Suburb" name={["address", "suburb"]}>
                  <Input />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMiniTaskPage;
