import React, { useState, useEffect } from "react";
import { Input, Select, DatePicker, Button, Tag, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { getSingleJobInfo, updateJobByAdmin } from "../APIS/API";

const { TextArea } = Input;
const { Option } = Select;

const AdminEditJob = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getSingleJobInfo(Id);
        if (res.status === 200) {
          setJob(res.data);
        }
      } catch (err) {
        message.error("Failed to load job.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [Id]);

  const handleChange = (field, value) => {
    setJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatePayload = {
        title: job.title,
        description: job.description,
        category: job.category,
        jobType: job.jobType,
        deliveryMode: job.deliveryMode,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        paymentStyle: job.paymentStyle,
        deadLine: job.deadLine,
        status: job.status,
        skillsRequired: job.skillsRequired,
        jobTags: job.jobTags,
      };
      const res = await updateJobByAdmin(Id, updatePayload);
      if (res.status === 200) {
        toast.success("Job updated successfully");
        navigate(`/admin/${Id}/job_details`);
      } else {
        toast.error("Failed to update job");
      }
    } catch (error) {
     const errorMessage =
             error.response?.data?.message ||
             error.response?.data?.error ||
             "An unexpected error occurred";
           toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin className="mt-20 block mx-auto" size="large" />;

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer/>
      <AdminNavbar />
      <div className="flex flex-1">
        <div className="hidden lg:block w-64 bg-white shadow-lg">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Job</h2>

            <Input
              value={job.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Job Title"
            />

            <TextArea
              rows={4}
              value={job.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Job Description"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={job.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Category"
              />
              <Select
                value={job.jobType}
                onChange={(val) => handleChange("jobType", val)}
                placeholder="Job Type"
              >
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
                <Option value="Contract">Contract</Option>
              </Select>

              <Select
                value={job.deliveryMode}
                onChange={(val) => handleChange("deliveryMode", val)}
                placeholder="Delivery Mode"
              >
                <Option value="Onsite">Onsite</Option>
                <Option value="Remote">Remote</Option>
                <Option value="Hybrid">Hybrid</Option>
              </Select>

              <Select
                value={job.experienceLevel}
                onChange={(val) => handleChange("experienceLevel", val)}
                placeholder="Experience Level"
              >
                <Option value="Junior">Junior</Option>
                <Option value="Mid">Mid</Option>
                <Option value="Senior">Senior</Option>
              </Select>

              <Input
                value={job.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                placeholder="Salary"
              />
              <Select
                value={job.paymentStyle}
                onChange={(val) => handleChange("paymentStyle", val)}
                placeholder="Payment Style"
              >
                <Option value="Monthly">Monthly</Option>
                <Option value="Hourly">Hourly</Option>
                <Option value="Fixed">Fixed</Option>
              </Select>

              <DatePicker
                value={dayjs(job.deadLine)}
                onChange={(date) => handleChange("deadLine", date.toISOString())}
                className="w-full"
              />

              <Select
                value={job.status}
                onChange={(val) => handleChange("status", val)}
                placeholder="Status"
              >
                <Option value="Opened">Opened</Option>
                <Option value="Closed">Closed</Option>
                <Option value="Pending">Pending</Option>
              </Select>
            </div>

            <div>
              <label className="block font-medium mb-1">Skills Required</label>
              <Select
                mode="tags"
                value={job.skillsRequired}
                onChange={(val) => handleChange("skillsRequired", val)}
                style={{ width: "100%" }}
                placeholder="Add skills"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Job Tags</label>
              <Select
                mode="tags"
                value={job.jobTags}
                onChange={(val) => handleChange("jobTags", val)}
                style={{ width: "100%" }}
                placeholder="Add tags"
              />
            </div>

            <div className="text-right">
              <Button
                type="primary"
                loading={saving}
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEditJob;
