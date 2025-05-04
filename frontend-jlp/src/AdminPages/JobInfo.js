import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { Tag, Badge, Skeleton, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleJobInfo, modifyJobStatus,deleteJob } from "../APIS/API";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetailsAdminView = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [Id]);

  const modifyJobState = async (id, state) => {
    try {
      setLoading(true);
      const newStatus = job.status === "Closed" ? "Opened" : "Closed";
      const response = await modifyJobStatus(id, { state: newStatus });
      if (response.status === 200) {
        toast.success(`Job successfully ${newStatus === "Closed" ? "closed" : "reopened"}`);
        // Update local state to reflect the change
        setJob(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const removeJob = async(Id)=>{
    try{

      const response = await deleteJob(Id)
      if (response.status === 200) {
        toast.success(`Job successfully Removed Successfully`);
        navigate(`/admin/jobmanagement`)
      }else{
         toast.error(response.message || "An unknown occured. Please try again.")
      }

    }catch(error){
      const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred";
    toast.error(errorMessage);
    }

  }

  const deadline = job?.deadLine ? new Date(job.deadLine).toDateString() : "Not set";
  const createdAt = job?.createdAt ? new Date(job.createdAt).toDateString() : "";

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      {/* Navbar */}
      <div className="z-50">
        <AdminNavbar />
      </div>

      {/* Sidebar + Content Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg">
          <AdminSidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100 overflow-x-hidden">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-10">
            {loading ? (
              <div className="space-y-6">
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active title={false} paragraph={{ rows: 4 }} />
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
                <Spin className="block text-center mt-6" size="large" />
              </div>
            ) : job ? (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-400 mt-1">{job.industry}</p>
                  </div>
                  <Badge.Ribbon
                    text={job.status}
                    color={
                      job.status === "Opened"
                        ? "green"
                        : job.status === "Closed"
                        ? "red"
                        : "blue"
                    }
                  />
                </div>

                {/* Core Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
                  <div>
                    <p className="font-semibold mb-2">Job Description</p>
                    <p className="text-gray-600">{job.description}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Category:</strong> {job.category}</div>
                    <div><strong>Job Type:</strong> {job.jobType}</div>
                    <div><strong>Delivery Mode:</strong> {job.deliveryMode}</div>
                    <div><strong>Experience Level:</strong> {job.experienceLevel}</div>
                    <div><strong>Salary:</strong> {job.salary} ({job.paymentStyle})</div>
                    <div><strong>Deadline:</strong> {deadline}</div>
                    <div><strong>Posted On:</strong> {createdAt}</div>
                    <div><strong>Applicants:</strong> {job.noOfApplicants}</div>
                    <div><strong>Interactions:</strong> {job.interactions}</div>
                    <div><strong>Status:</strong> {job.status}</div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {`${job.location?.street || ""}, ${job.location?.city || ""}, ${job.location?.region || ""}`}
                    </div>
                  </div>
                </section>

                {/* Responsibilities */}
                {job.responsibilities?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-6 text-gray-600">
                      {job.responsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {job.skillsRequired?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, i) => (
                        <Tag key={i} color="blue">{skill}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {job.jobTags?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.jobTags.map((tag, i) => (
                        <Tag key={i} color="volcano">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Controls */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={()=>navigate(`/admin/${job._id}/edit_job`)} className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 flex items-center gap-1">
                    <EditOutlined /> Edit Job
                  </button>
                  <button onClick={()=>removeJob(job._id)} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 flex items-center gap-1">
                    <DeleteOutlined /> Delete Job
                  </button>
                  <button
                    className={`px-4 py-2 rounded-xl text-white flex items-center gap-1 ${
                      loading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : job.status === "Closed"
                          ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                          : "bg-gray-700 hover:bg-gray-800 active:bg-gray-900"
                    }`}
                    disabled={loading}
                    onClick={() => modifyJobState(job._id)}
                  >
                    {job.status === "Closed" ? (
                      <>
                        <CheckCircleOutlined /> Open Job
                      </>
                    ) : (
                      <>
                        <CloseCircleOutlined /> Close Job
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/${job._id}/view_applicants`, { state: job })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-1"
                  >
                    <TeamOutlined /> View Applicants
                  </button>
                  <button
                    onClick={() => navigate(`/admin/${job.employerProfileId}/employer_profile/details`)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center gap-1"
                  >
                    <UserOutlined /> View Recruiter
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-red-500 font-semibold">
                Failed to load job details.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetailsAdminView;