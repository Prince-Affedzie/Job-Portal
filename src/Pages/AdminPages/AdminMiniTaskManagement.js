import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, Tag, Space, Button, Select, Input,
  Popconfirm, message, Row, Col
} from "antd";
import {
  EyeOutlined, DeleteOutlined, EditOutlined,SearchOutlined, ReloadOutlined
} from "@ant-design/icons";
import { getAllMiniTasks, adminDeleteMiniTask } from "../../APIS/API";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import dayjs from "dayjs";
import "../../Styles/AdminLayout.css"; // You can define layout styles here

const { Option } = Select;

const statusOptions = ["Open", "In-progress", "Assigned", "Completed", "Closed"];
const locationOptions = ["remote", "on-site"];
const categoryOptions = [
  "Home Services", "Delivery & Errands", "Digital Services", "Writing & Assistance",
  "Learning & Tutoring", "Creative Tasks", "Event Support", "Others"
];

const AdminManageMiniTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [locationType, setLocationType] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllMiniTasks();
      if (res.status === 200) {
        setTasks(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      message.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await adminDeleteMiniTask(id);
      if (res.status === 200) {
        message.success("Task deleted");
        fetchTasks();
      }
    } catch {
      message.error("Failed to delete task");
    }
  };

  const applyFilters = () => {
    let result = [...tasks];
    if (search) result = result.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    if (status) result = result.filter((t) => t.status === status);
    if (locationType) result = result.filter((t) => t.locationType === locationType);
    if (category) result = result.filter((t) => t.category === category);
    setFiltered(result);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLocationType("");
    setCategory("");
    setFiltered(tasks);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (budget) => `GHS ${budget}`,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => dayjs(deadline).format("MMM DD, YYYY"),
    },
    {
      title: "Location",
      dataIndex: "locationType",
      key: "locationType",
      render: (type) => (
        <Tag color={type === "remote" ? "green" : "geekblue"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          Open: "green",
          "In-progress": "blue",
          Assigned: "orange",
          Completed: "gold",
          Closed: "red",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/${record._id}/mini_task_info`)}
          />
            <Button icon={<EditOutlined />} onClick={()=>navigate(`/admin/${record._id}/modify_min_task`)} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-layout">
       <AdminSidebar 
              isOpen={isSidebarOpen} 
             onClose={() => setIsSidebarOpen(false)}
              />
      <NotificationCenter/>
      <div className="main-content">
         <AdminNavbar 
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                 isSidebarOpen={isSidebarOpen} 
                 />
        
        <div className="content-area">
          <h2 className="text-xl font-semibold mb-4">Manage MiniTasks</h2>

          {/* Filters */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} md={6}>
              <Input
                placeholder="Search by title"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                placeholder="Filter by status"
                value={status || undefined}
                onChange={(val) => setStatus(val)}
                style={{ width: "100%" }}
                allowClear
              >
                {statusOptions.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={6}>
              <Select
                placeholder="Filter by location"
                value={locationType || undefined}
                onChange={(val) => setLocationType(val)}
                style={{ width: "100%" }}
                allowClear
              >
                {locationOptions.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Filter by category"
                value={category || undefined}
                onChange={(val) => setCategory(val)}
                style={{ width: "100%" }}
                allowClear
              >
                {categoryOptions.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={24}>
              <Space>
                <Button type="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button icon={<ReloadOutlined />} onClick={clearFilters}>
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Table */}
          <Table
            rowKey="_id"
            loading={loading}
            dataSource={filtered}
            columns={columns}
            bordered
            pagination={{ pageSize: 8 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminManageMiniTasks;
