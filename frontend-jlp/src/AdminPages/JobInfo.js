import React, { useState, useEffect } from "react";
import {
  EditOutlined, DeleteOutlined, CloseCircleOutlined, UserOutlined,
  TeamOutlined, CheckCircleOutlined, CalendarOutlined, DollarOutlined,
  GlobalOutlined, EnvironmentOutlined, BarsOutlined, StarOutlined,
  TagsOutlined, ClockCircleOutlined, EyeOutlined, LaptopOutlined
} from "@ant-design/icons";
import { 
  Tag, Badge, Skeleton, Spin, Card, Row, Col, Divider, Space, 
  Button, Tooltip, Avatar, Statistic, Modal, Typography
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleJobInfo, modifyJobStatus, deleteJob } from "../APIS/API";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text, Paragraph } = Typography;

const JobDetailsAdminView = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await getSingleJobInfo(Id);
        if (response.status === 200) {
          setJob(response.data);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [Id]);

  const modifyJobState = async (id) => {
    try {
      setLoading(true);
      const newStatus = job.status === "Closed" ? "Opened" : "Closed";
      const response = await modifyJobStatus(id, { state: newStatus });
      if (response.status === 200) {
        toast.success(`Job ${newStatus === "Closed" ? "closed" : "reopened"} successfully`);
        setJob(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = () => setConfirmDelete(true);
  
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await deleteJob(job._id);
      if (response.status === 200) {
        toast.success("Job removed successfully");
        navigate("/admin/jobmanagement");
      } else {
        toast.error(response.message || "An unknown error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const deadline = job?.deadLine ? new Date(job.deadLine).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : "Not set";
  
  const createdAt = job?.createdAt ? new Date(job.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : "";

  const renderStatusBadge = (status) => {
    const statusConfig = {
      Opened: { color: "green", icon: <CheckCircleOutlined /> },
      Closed: { color: "red", icon: <CloseCircleOutlined /> },
      default: { color: "blue", icon: <ClockCircleOutlined /> }
    };
    
    const config = statusConfig[status] || statusConfig.default;
    
    return (
      <Badge 
        status={config.color} 
        text={<Text strong>{status}</Text>}
        style={{ fontSize: '16px' }} 
      />
    );
  };

  const renderActionButtons = () => (
    <Space wrap className="mt-8">
      <Tooltip title="Edit this job">
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => navigate(`/admin/${job._id}/edit_job`)}
          className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500"
        >
          Edit Job
        </Button>
      </Tooltip>
      
      <Tooltip title="Delete this job">
        <Button 
          danger 
          type="primary" 
          icon={<DeleteOutlined />} 
          onClick={handleDeleteRequest}
        >
          Delete Job
        </Button>
      </Tooltip>
      
      <Tooltip title={job?.status === "Closed" ? "Reopen this job" : "Close this job"}>
        <Button 
          type={job?.status === "Closed" ? "primary" : "default"}
          icon={job?.status === "Closed" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          onClick={() => modifyJobState(job._id)}
          disabled={loading}
          className={job?.status === "Closed" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {job?.status === "Closed" ? "Open Job" : "Close Job"}
        </Button>
      </Tooltip>
      
      <Tooltip title="View applicants for this job">
        <Button 
          type="primary" 
          icon={<TeamOutlined />} 
          onClick={() => navigate(`/admin/${job._id}/view_applicants`, { state: job })}
          className="bg-blue-600 hover:bg-blue-700 border-blue-600"
        >
          View Applicants
        </Button>
      </Tooltip>
      
      <Tooltip title="View recruiter profile">
        <Button 
          type="primary" 
          icon={<UserOutlined />} 
          onClick={() => navigate(`/admin/${job.employerProfileId}/employer_profile/details`)}
          className="bg-green-600 hover:bg-green-700 border-green-600"
        >
          View Recruiter
        </Button>
      </Tooltip>
    </Space>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="z-50">
        <AdminNavbar />
      </div>

      <div className="flex flex-1">
        <aside className="hidden lg:block w-64 bg-white shadow-lg">
          <AdminSidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <Card 
            bordered={false}
            className="rounded-xl shadow-lg mb-6"
            title={
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <Button 
                    type="link" 
                    className="p-0 mb-2" 
                    onClick={() => navigate("/admin/jobmanagement")}
                  >
                    &larr; Back to Job Management
                  </Button>
                  <Title level={3} className="m-0">Job Details</Title>
                </div>
              </div>
            }
          >
            {loading ? (
              <div className="py-12">
                <Skeleton active avatar paragraph={{ rows: 6 }} />
                <Divider />
                <Skeleton active title={false} paragraph={{ rows: 4 }} />
                <Divider />
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
                <div className="flex justify-center mt-8">
                  <Spin size="large" />
                </div>
              </div>
            ) : job ? (
              <>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div>
                      <Title level={2} className="m-0">{job.title}</Title>
                      <Title level={4} className="m-0 text-blue-600">{job.company}</Title>
                    </div>
                    <div className="flex items-center">
                      {renderStatusBadge(job.status)}
                      <Tag color="blue" className="ml-2 text-sm">{job.industry}</Tag>
                    </div>
                  </div>
                </div>

                <Row gutter={[24, 24]} className="mb-6">
                  <Col xs={24} md={8}>
                    <Card bordered={false} className="h-full shadow-sm">
                      <Statistic 
                        title="Applicants" 
                        value={job.noOfApplicants || 0} 
                        prefix={<TeamOutlined />} 
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false} className="h-full shadow-sm">
                      <Statistic 
                        title="Interactions" 
                        value={job.interactions || 0} 
                        prefix={<EyeOutlined />} 
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false} className="h-full shadow-sm">
                      <Statistic 
                        title="Deadline" 
                        value={deadline} 
                        prefix={<CalendarOutlined />} 
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card className="mb-6 shadow-sm" title={<Title level={4}>Job Details</Title>}>
                  <Row gutter={[24, 16]}>
                    <Col xs={24} lg={12}>
                      <Title level={5}>Description</Title>
                      <Paragraph className="text-gray-600">{job.description}</Paragraph>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Space direction="vertical" size="middle" className="w-full">
                        <div className="flex items-center">
                          <BarsOutlined className="text-blue-500 mr-2" />
                          <Text strong>Category:</Text>
                          <Text className="ml-2">{job.category}</Text>
                        </div>
                        <div className="flex items-center">
                          <ClockCircleOutlined className="text-blue-500 mr-2" />
                          <Text strong>Job Type:</Text>
                          <Text className="ml-2">{job.jobType}</Text>
                        </div>
                        <div className="flex items-center">
                          <LaptopOutlined className="text-blue-500 mr-2" />
                          <Text strong>Delivery Mode:</Text>
                          <Text className="ml-2">{job.deliveryMode}</Text>
                        </div>
                        <div className="flex items-center">
                          <StarOutlined className="text-blue-500 mr-2" />
                          <Text strong>Experience Level:</Text>
                          <Text className="ml-2">{job.experienceLevel}</Text>
                        </div>
                        <div className="flex items-center">
                          <DollarOutlined className="text-blue-500 mr-2" />
                          <Text strong>Salary:</Text>
                          <Text className="ml-2">{job.salary} ({job.paymentStyle})</Text>
                        </div>
                        <div className="flex items-center">
                          <GlobalOutlined className="text-blue-500 mr-2" />
                          <Text strong>Posted On:</Text>
                          <Text className="ml-2">{createdAt}</Text>
                        </div>
                        <div className="flex items-start">
                          <EnvironmentOutlined className="text-blue-500 mr-2 mt-1" />
                          <div>
                            <Text strong>Location:</Text>
                            <Text className="ml-2">{`${job.location?.street || ""}, ${job.location?.city || ""}, ${job.location?.region || ""}`}</Text>
                          </div>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>

                {job.responsibilities?.length > 0 && (
                  <Card className="mb-6 shadow-sm" title={<Title level={4}>Responsibilities</Title>}>
                    <ul className="pl-6 text-gray-600 list-disc">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="mb-2">{item}</li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Row gutter={[24, 24]}>
                  {job.skillsRequired?.length > 0 && (
                    <Col xs={24} md={12}>
                      <Card className="h-full shadow-sm" title={<Title level={4}>Skills Required</Title>}>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired.map((skill, i) => (
                            <Tag key={i} color="blue" className="py-1 px-2 text-sm">{skill}</Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  )}

                  {job.jobTags?.length > 0 && (
                    <Col xs={24} md={12}>
                      <Card className="h-full shadow-sm" title={<Title level={4}>Tags</Title>}>
                        <div className="flex flex-wrap gap-2">
                          {job.jobTags.map((tag, i) => (
                            <Tag key={i} color="volcano" className="py-1 px-2 text-sm">{tag}</Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  )}
                </Row>

                {renderActionButtons()}

                <Modal
                  title="Confirm Delete"
                  open={confirmDelete}
                  onOk={handleDeleteConfirm}
                  onCancel={() => setConfirmDelete(false)}
                  okText="Yes, Delete Job"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: loading }}
                >
                  <p>Are you sure you want to delete this job? This action cannot be undone.</p>
                </Modal>
              </>
            ) : (
              <div className="py-12 text-center">
                <CloseCircleOutlined style={{ fontSize: 48 }} className="text-red-500 mb-4" />
                <Title level={4} className="text-red-500">Failed to load job details</Title>
                <Button type="primary" onClick={() => navigate("/admin/jobmanagement")} className="mt-4">
                  Return to Job Management
                </Button>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default JobDetailsAdminView;