import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useLocation,useNavigate } from "react-router-dom";

//import { getJobApplicants } from "../APIS/API"; // Replace with actual API

const ViewApplicantsAdmin = ({ jobId }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const job = location.state
  console.log(job)

 /* useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await getJobApplicants(jobId);
        if (response.status === 200) {
          setApplicants(response.data);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);*/

  const columns = [
    {
      title: "Applicant Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ['md'],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive? "orange" : "green"}>{isActive?"Active":'Not Active'}</Tag>
      ),
    },
    {
      title: "Joined On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => {
              navigate(`/admin/get/user_info/${record._id}`)
            }}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Applicants Summary</h1>
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={job.applicantsId}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: true }}
          />
        )}
      </div>
    </div>
  );
};

export default ViewApplicantsAdmin;
