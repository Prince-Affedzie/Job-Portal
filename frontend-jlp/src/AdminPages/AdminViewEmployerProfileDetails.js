import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Tag,
  Button,
  message,
  Spin,
  Typography,
  Switch,
  Card,
  Space,
  Select,
  Popconfirm ,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams,useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getSingleEmployerProfile, updateEmployerStatus,removeEmployerProfile } from "../APIS/API";

const { Title } = Typography;

const AdminEmployerDetail = () => {
  const { employerId } = useParams();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const statusOptions = ["pending", "approved", "rejected"];
  const navigate = useNavigate()
  

  const fetchEmployer = async () => {
    try {
      setLoading(true);
      const res = await getSingleEmployerProfile(employerId);
      if (res.status === 200) {
        setEmployer(res.data);
        console.log(res.data)
      } else {
        message.error("Failed to fetch employer details");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployer();
  }, [employerId]);

  const handleToggleStatus = async (value) => {
    try {
        setChangingStatus(true);
         const res = await updateEmployerStatus(employerId, {
          verificationStatus: value,
        });
       if (res.status === 200) {
       message.success("Status updated");
          fetchEmployer();
                } else {
         message.error("Failed to update status");
               }
             } catch (err) {
           message.error("Error updating status");
              } finally {
          setChangingStatus(false);
        }
  };

  const handleToggleVerified = async () => {
    const newVerified = !employer.isVerified; // Calculate new value
    setEmployer((prev) => ({ ...prev, isVerified: newVerified })); // Optimistically update UI
  
    try {
      setVerifying(true);
      const res = await updateEmployerStatus(employerId, {
        isVerified: newVerified,
      });
      if (res.status === 200) {
        message.success("Verification updated");
      } else {
        message.error("Failed to update verification");
        fetchEmployer(); // Rollback
      }
    } catch (err) {
      message.error("Error updating verification");
      fetchEmployer(); // Rollback
    } finally {
      setVerifying(false);
    }
  };
  

  const handleDeleteEmployer =async()=>{
    try{ 
        setLoading(true);
        const response = await removeEmployerProfile(employerId)
        if(response.status ===200){
          toast.success('Employer Profile deletion Succesful')
          navigate('/admin/get_employers/list')
        }else{
            toast.error(response.message || "An Unknown error occured. Please try again.")
        }

    }catch(error){
        const errorMessage =
                     error.response?.data?.message ||
                     error.response?.data?.error ||
                     "An unexpected error occurred";
                   toast.error(errorMessage);
    }finally{
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer/>
      <AdminNavbar />
      <div className="flex flex-1">
        <div  className="w-64 bg-white border-r">
          <AdminSidebar />
        </div>
        <main className="flex-1 bg-gray-50 p-4 sm:p-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
           
       <div className="flex justify-between items-center mb-4">
        <Title level={3}>Employer Profile Details</Title>
        <div className="flex items-center gap-2">
         <Button
         type="primary"
         size="small"
         onClick={() =>
           navigate(`/admin/get/user_info/${employer?.userId._id}`)
              }
          disabled={!employer?.userId._id}
           >
             View Creator
          </Button>

        <Popconfirm
         title="Are you sure you want to delete this employer?"
         onConfirm={handleDeleteEmployer}
         okText="Yes"
         cancelText="No"
          >
       <Button danger icon={<DeleteOutlined />} size="small">
          Delete
        </Button>
       </Popconfirm>
         </div>
        </div>

            {loading ? (
              <Spin size="large" />
            ) : (
              employer && (
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2 }}
                  layout="vertical"
                  size="middle"
                >
                  <Descriptions.Item label="Company Name">
                    {employer.companyName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {employer.companyEmail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {employer.companyLine || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {employer.companyLocation || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Website">
                    {employer.companyWebsite ? (
                      <a href={employer.companyWebsite} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Business Docs">
                    <Space direction="vertical">
                      {employer.businessDocs?(
                        
                          <a href={employer.businessDocs} target="_blank" rel="noreferrer">
                            View Docs
                          </a>
                       
                      ) : (
                        <span>No Documents</span>
                      )}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Verified">
                    <Tag color={employer.isVerified ? "green" : "red"}>
                      {employer.isVerified ? "Yes" : "No"}
                    </Tag>
                    <Switch
                      checked={employer.isVerified}
                      onChange={handleToggleVerified}
                      loading={verifying}
                      style={{ marginLeft: "10px" }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Verification Status">
                       <Tag
                  color={
                  employer.verificationStatus === "approved"
                  ? "green"
                  : employer.verificationStatus === "rejected"
                  ? "red"
                 : "orange"
                 }
                 >
                 {employer.verificationStatus.toUpperCase()}
                 </Tag>

               <Select
                value={employer.verificationStatus}
                onChange={(value)=>handleToggleStatus(value)}
                      style={{ marginTop: 8, width: 160 }}
                          loading={changingStatus}
                      >
                      {statusOptions.map((status) => (
                  <Select.Option key={status} value={status}>
                   {status.toUpperCase()}
                   </Select.Option>
                   ))}
                  </Select>
                     </Descriptions.Item> 
                  <Descriptions.Item label="Verification Notes">
                    {employer.verificationNotes || "None"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {new Date(employer.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Updated At">
                    {new Date(employer.updatedAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEmployerDetail;
