import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Spin, message, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getEmployersProfiles} from "../APIS/API"; // Replace with actual API call
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AdminEmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await getEmployersProfiles();
        if (res.status === 200) {
          setEmployers(res.data);
          console.log(res.data)
        } else {
          message.error("Failed to load employers.");
        }
      } catch (err) {
        message.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "companyEmail",
      key: "companyEmail",
    },
    {
      title: "Phone",
      dataIndex: "companyLine",
      key: "companyLine",
    },
    {
      title: "Location",
      dataIndex: "companyLocation",
      key: "companyLocation",
    },
    {
      title: "Website",
      dataIndex: "companyWebsite",
      key: "companyWebsite",
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (verified) =>
        verified ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
    },
    {
      title: "Status",
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      render: (status) => {
        const colorMap = {
          pending: "orange",
          approved: "green",
          rejected: "red",
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/${record._id}/employer_profile/details`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <div  className="w-64 bg-white border-r">
          <AdminSidebar />
        </div>
        <main className="flex-1 bg-white p-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Title level={3}>Employers Overview</Title>
            {loading ? (
              <Spin size="large" className="mt-10" />
            ) : (
              <Table
                columns={columns}
                dataSource={employers}
                rowKey="_id"
                scroll={{ x: true }}
                pagination={{ pageSize: 10 }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEmployerList;
