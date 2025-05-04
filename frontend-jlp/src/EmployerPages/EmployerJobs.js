import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  UserOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CloseCircleOutlined, 
  ReloadOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Select, 
  Space, 
  Badge, 
  Row, 
  Col, 
  Statistic, 
  Modal, 
  Tag, 
  Tooltip,
  Typography,
  Empty,
  Spin
} from "antd";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import { jobsCreatedContext } from "../Context/EmployerContext1";
import { removeJob, modifyJobState } from '../APIS/API';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const EmployerJobs = () => {
  const navigate = useNavigate();
  const { Jobs, loading, fetchJobs } = useContext(jobsCreatedContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Confirm modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Action handlers
  const closeJob = async(id) => {
    try {
      const response = await modifyJobState(id, {state:"Closed"});
      if (response.status === 200) {
        toast.success("Job closed successfully");
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't close job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const reopenJob = async(id) => {
    try {
      const response = await modifyJobState(id, {state:"Opened"});
      if (response.status === 200) {
        toast.success("Job reopened successfully");
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't reopen job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const showDeleteConfirm = (id) => {
    setJobToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setJobToDelete(null);
  };

  const handleDeleteOk = async() => {
    if (!jobToDelete) return;
    
    try {
      const response = await removeJob(jobToDelete);
      if (response.status === 200) {
        toast.success("Job deleted successfully");
        fetchJobs();
      } else {
        toast.error(response.message || "Couldn't delete job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalVisible(false);
      setJobToDelete(null);
    }
  };

  // Filter jobs based on search term and status
  const filteredJobs = Jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Table columns configuration
  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm flex items-center mt-1">
            <CalendarOutlined style={{ marginRight: 5 }} />
            Posted on {new Date().toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Applicants',
      dataIndex: 'noOfApplicants',
      key: 'applicants',
      render: (text, record) => (
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<UserOutlined />}
            onClick={() => navigate(`/employer/job/applicants/${record._id}`)}
            className="flex items-center"
            style={{ padding: '4px 8px', backgroundColor: '#EBF5FF' }}
          >
            <span style={{ marginLeft: 5, color: '#1890ff', fontWeight: 500 }}>
              {text || 0}
            </span>
          </Button>
        </div>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'interactions',
      key: 'views',
      render: (text) => (
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            className="flex items-center"
            style={{ padding: '4px 8px', backgroundColor: '#E6F7FF' }}
          >
            <span style={{ marginLeft: 5, color: '#1890ff', fontWeight: 500 }}>
              {text || 0}
            </span>
          </Button>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Opened' ? 'success' : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === "Opened" ? (
            <Tooltip title="Close Job">
              <Button 
                type="text"
                icon={<CloseCircleOutlined />} 
                onClick={() => closeJob(record._id)}
                style={{ color: '#1890ff', backgroundColor: '#e6f7ff' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Reopen Job">
              <Button 
                type="text"
                icon={<ReloadOutlined />} 
                onClick={() => reopenJob(record._id)}
                style={{ color: '#52c41a', backgroundColor: '#f6ffed' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit Job">
            <Link to={`/employer/edit_job/${record._id}`}>
              <Button 
                type="text"
                icon={<EditOutlined />} 
                style={{ color: '#faad14', backgroundColor: '#fffbe6' }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete Job">
            <Button 
              type="text"
              icon={<DeleteOutlined />} 
              onClick={() => showDeleteConfirm(record._id)}
              style={{ color: '#ff4d4f', backgroundColor: '#fff2f0' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination({...pagination, current: 1});
  };
  
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination({...pagination, current: 1});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <EmployerNavbar />
      <Sidebar />

      <div className="lg:ml-64 pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with stats cards */}
          <Title level={2} style={{ marginBottom: 24 }}>Job Postings Management</Title>
          
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
               <Card >
                <Statistic
                   title="Total Jobs"
                    value={Jobs.length}
                    prefix={<FileSearchOutlined style={{ color: '#1890ff' }} />}
                 />
                </Card>
                </Col>
               <Col xs={24} sm={12} md={8}>
                <Card>
                   <Statistic
                       title="Active Jobs"
                       value={Jobs.filter(job => job.status === "Opened").length}
                        prefix={<EyeOutlined style={{ color: '#52c41a' }} />}
                    />
               </Card>
                 </Col>
                     <Col xs={24} sm={12} md={8}>
                        <Card >
                          <Statistic
                          title="Total Applicants"
                           value={Jobs.reduce((sum, job) => sum + (job.noOfApplicants || 0), 0)}
                           prefix={<UserOutlined style={{ color: '#faad14' }} />}
                          />
                      </Card>
                  </Col>
                    </Row>


          {/* Action bar */}
          <Card style={{ marginBottom: 24 }}>
                 <Row gutter={[16, 16]}>
                 <Col xs={24} md={16}>
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Search
                 placeholder="Search job titles..."
                 allowClear
                 onSearch={handleSearch}
                 style={{ width: "100%" }}
                 />
             <Select
             defaultValue="All"
             style={{ width: "100%" }}
              onChange={handleStatusChange}
             >
          <Option value="All">All Status</Option>
          <Option value="Opened">Active</Option>
          <Option value="Closed">Closed</Option>
        </Select>
         </Space>
       </Col>
       <Col xs={24} md={8} style={{ textAlign: 'right' }}>
        <Link to="/v1/post_job/form">
         <Button type="primary" icon={<PlusOutlined />} block>
          Post New Job
        </Button>
        </Link>
        </Col>
        </Row>
        </Card>


          {/* Job listings table */}
          {loading ? (
            <Card>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading your job postings...</div>
              </div>
            </Card>
          ) : filteredJobs.length === 0 && !searchTerm && statusFilter === "All" ? (
            <Card>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text style={{ fontSize: 16 }}>You haven't posted any jobs yet</Text>
                    <div style={{ marginTop: 16 }}>
                      <Link to="/v1/post_job/form">
                        <Button type="primary" icon={<PlusOutlined />}>
                          Post Your First Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                }
              />
            </Card>
          ) : (
        <Card>
        <div style={{ overflowX: "auto" }}>
        <Table
         columns={columns}
        dataSource={filteredJobs}
         rowKey="_id"
            pagination={{
        ...pagination,
        total: filteredJobs.length,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      onChange={handleTableChange}
      locale={{
        emptyText: searchTerm || statusFilter !== "All" ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No matching jobs found. Try adjusting your search criteria."
          />
        ) : (
          <Empty description="No jobs found" />
        )
      }}
    />
     </div>

    </Card>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Job"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default EmployerJobs;