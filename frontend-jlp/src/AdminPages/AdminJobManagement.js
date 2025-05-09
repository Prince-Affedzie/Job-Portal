import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2,User as UserIcon, Briefcase as BriefcaseIcon, Users as UsersIcon } from "lucide-react";
import { Table, Input, Select, Pagination, Button, Tag, Spin } from "antd";
import { useAdminContext } from "../Context/AdminContext";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";

const { Search } = Input;
const { Option } = Select;

const AdminJobManagementDashboard = () => {
  const navigate = useNavigate()
  const { loading, jobs, fetchAllJobs } = useAdminContext();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const totalJobs = jobs.length
  const openedJobs = jobs.filter((job)=>job.status === "Opened")
  const closedJobs = jobs.filter((job)=>job.status === "Closed")
  const filledJobs = jobs.filter((job)=>job.status === "Filled")


  useEffect(() => {
    if (!jobs || jobs.length === 0) fetchAllJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs || [];
    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }
    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Job Type", dataIndex: "jobType", key: "jobType" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Opened" ? "green" : status === "Closed" ? "red" : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    { title: "Applicants", dataIndex: "noOfApplicants", key: "noOfApplicants" },
    { title: "Deadline", dataIndex: "deadLine", key: "deadLine" , render:(date)=> new Date(date).toDateString()},
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/admin/${record._id}/job_details`)}>
          View
        </Button>
      ),
    },
  ];

  const paginatedData = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="w-full">
        <AdminNavbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 min-w-[16rem] hidden md:block bg-white border-r">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto bg-white">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                       <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                       <div>
                          <p className="text-sm text-gray-500">Total Jobs</p>
                          <h3 className="text-xl font-semibold">{totalJobs}</h3>
                       </div>
                       <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                          <UserIcon className="w-6 h-6" />
                       </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                           <div>
                          <p className="text-sm text-gray-500">Total Opened Jobs</p>
                            <h3 className="text-xl font-semibold">{openedJobs.length}</h3>
                         </div>
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                       <BriefcaseIcon className="w-6 h-6" />
                      </div>
                    </div>
                      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                        <p className="text-sm text-gray-500">Total Closed Jobs</p>
                        <h3 className="text-xl font-semibold">{closedJobs.length}</h3>
                     </div>
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                     <UsersIcon className="w-6 h-6" />
                  </div>
                 </div>
                 <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                        <div>
                        <p className="text-sm text-gray-500">Total filledJobs Jobs</p>
                        <h3 className="text-xl font-semibold">{filledJobs.length}</h3>
                     </div>
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                     <UsersIcon className="w-6 h-6" />
                  </div>
                 </div>
                </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <Search
              placeholder="Search jobs by title"
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              defaultValue="All"
              style={{ width: 200 }}
              onChange={(value) => setStatusFilter(value)}
            >
              <Option value="All">All Statuses</Option>
              <Option value="Opened">Opened</Option>
              <Option value="Closed">Closed</Option>
              <Option value="Filled">Filled</Option>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                rowKey={(record) => record._id || record.key}
                bordered
                className="bg-white"
              />
              <div className="flex justify-end mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredJobs.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobManagementDashboard;
