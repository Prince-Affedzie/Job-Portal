import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Descriptions, Tag, Spin, Typography, Divider, message,
  Select, Button, Form, Space, Badge, Row, Col, Statistic, Result
} from "antd";
import {
  CalendarOutlined, DollarOutlined, UserOutlined,
  EnvironmentOutlined, CheckCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { getSingleMinitask, modifyMiniTaskStatus } from '../APIS/API';
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

const AdminMiniTaskDetailPage = () => {
  const { Id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleStatusUpdate = async () => {
    if (newStatus === task.status) return;

    try {
      setUpdating(true);
      const res = await modifyMiniTaskStatus(task._id, { status: newStatus });
      if (res.status === 200) {
        message.success("Status updated successfully");
        setTask((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (Id) fetchMiniTask();
  }, [Id]);

  const fetchMiniTask = async () => {
    try {
      const res = await getSingleMinitask(Id);
      if (res.status === 200) {
        setTask(res.data);
        setNewStatus(res.data.status);
      }
    } catch (error) {
      message.error("Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "success",
      "In-progress": "processing",
      Assigned: "warning",
      Completed: "default",
      Closed: "error",
    };
    return colors[status] || "default";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading task details..." />
      </div>
    );
  }

  if (!task) {
    return (
      <Card className="mx-auto mt-10 max-w-2xl">
        <Result
          status="404"
          title="MiniTask not found"
          subTitle="The task you are looking for doesn't exist"
          extra={
            <Button type="primary" onClick={() => navigate('/admin/manage_minitasks')}>
              Back to Task List
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <Card
        className="shadow-md rounded-xl"
        title={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Title level={3} className="!mb-0">{task.title}</Title>
            <Badge
              status={getStatusColor(task.status)}
              text={<Text strong className="text-base">{task.status}</Text>}
            />
          </div>
        }
      >
        {/* Stats */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="shadow-sm h-full">
              <Statistic
                title="Budget"
                value={task.budget}
                prefix="GHS"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="shadow-sm h-full">
              <Statistic
                title="Deadline"
                value={dayjs(task.deadline).format("MMMM DD, YYYY")}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="shadow-sm h-full">
              <Statistic
                title="Applicants"
                value={task.applicants?.length || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Details */}
        <Divider orientation="left">Task Details</Divider>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          size="middle"
          className="bg-white rounded-md overflow-hidden"
        >
          <Descriptions.Item label="Description" span={2}>
            <Paragraph>{task.description}</Paragraph>
          </Descriptions.Item>

          <Descriptions.Item label="Employer">
            <Space>
              <UserOutlined />
              {task.employer?.name || "N/A"}
              {task.employer?._id && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => navigate(`/admin/get/user_info/${task.employer._id}`)}
                >
                  View Details
                </Button>
              )}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Location Type">
            <Tag color={task.locationType === "remote" ? "green" : "blue"}>
              {task.locationType?.toUpperCase()}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Category">{task.category}</Descriptions.Item>
          <Descriptions.Item label="Subcategory">{task.subcategory || "N/A"}</Descriptions.Item>

          <Descriptions.Item label="Skills Required" span={2}>
            {task.skillsRequired.length > 0
              ? task.skillsRequired.map((skill, idx) => (
                  <Tag key={idx} color="blue" className="mr-2 mb-2">
                    {skill}
                  </Tag>
                ))
              : "None specified"}
          </Descriptions.Item>

          <Descriptions.Item label="Address" span={2}>
            <Space>
              <EnvironmentOutlined />
              {`${task?.address?.region || ""}, ${task?.address?.city || ""}, ${task?.address?.suburb || ""}`}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Verification Required">
            {task.verificationRequired ? (
              <Badge status="error" text="Required" />
            ) : (
              <Badge status="success" text="Not Required" />
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Assigned To">
            {task.assignedTo ? (
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                {task.assignedTo.name}-{task.assignedTo.phone}
              </Space>
            ) : (
              <Space>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
                Not assigned
              </Space>
            )}
          </Descriptions.Item>

          {task.proofOfCompletion && (
            <Descriptions.Item label="Proof of Completion" span={2}>
              <Button
                type="primary"
                href={task.proofOfCompletion}
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
              </Button>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Status Update */}
        <Divider />
        <Card className="mt-4 shadow-sm" title="Update Task Status">
          <Form layout="vertical" className="w-full mt-2">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={16}>
                <Form.Item label="New Status">
                  <Select
                    value={newStatus}
                    style={{ width: "100%" }}
                    onChange={setNewStatus}
                  >
                    {["Open", "In-progress", "Assigned", "Completed", "Closed"].map((status) => (
                      <Select.Option key={status} value={status}>
                        <Badge status={getStatusColor(status)} text={status} />
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label=" ">
                  <Button
                    block
                    type="primary"
                    loading={updating}
                    disabled={newStatus === task.status}
                    onClick={handleStatusUpdate}
                  >
                    Update Status
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Card>
    </div>
  );
};

export default AdminMiniTaskDetailPage;
