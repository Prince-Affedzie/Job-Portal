import { useState, useEffect, useContext } from "react";
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { userContext } from "../../Context/FetchUser";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../../Styles/EditProfile.css";
import { modifyProfile, uploadImage  } from "../../APIS/API";
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import { LoadingSkeleton,Modal } from "../../Components/Ui/LoadingSkeleton";

const EditProfile = () => {
  const { user, setUser, fetchUserInfo, loading, setLoading } = useContext(userContext);
  const [editSection, setEditSection] = useState(null); // 'basic', 'skills', 'education', 'experience'
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing,setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    skills: [],
    education: [],
    workExperience: [],
    profileImage: "",
    Bio: "",
    location: { region: "", city: "", town: "", street: "" },
    businessName: "",
    businessRegistrationProof: "",
  });

  // For modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'skills', 'education', 'work'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null });
  
  // Initialize profile data from user context when available
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (fetchUserInfo) {
          await fetchUserInfo();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        location: { ...prev.location, ...user.location },
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleAddItem = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSaveModalData = (data) => {
    if (modalType === "work") {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, data],
      }));
    } else if (modalType === "education") {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, data],
      }));
    } else if (modalType === "skills") {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, data],
      }));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = (type, index) => {
    setDeleteTarget({ type, index });
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget.index !== null) {
      setFormData((prev) => ({
        ...prev,
        [deleteTarget.type]: prev[deleteTarget.type].filter((_, i) => i !== deleteTarget.index),
      }));
    }
    setDeleteModalOpen(false);
  };

  const saveImageChanges = async()=>{
    try{

      if (formData.profileImage instanceof File) {
        setIsProcessing(true)
        console.log(formData.profileImage)
        const res = await uploadImage(formData.profileImage);
        if (res.status === 200) {
          toast.success("Profile Update Successful");
          setEditSection(null);
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }


    }catch(error){
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }finally{
      setIsProcessing(false)
    }
  }

  const saveChanges = async () => {
    try {
      setIsProcessing(true)
      
      console.log(formData)
      const response = await modifyProfile(formData);
      if (response.status === 200) {
        toast.success("Profile Update Successful");
        setEditSection(null);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }finally{
      setIsProcessing(false)
    }
  };

  

  

  // Error display component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <p className="text-red-600 text-center mb-4">There was an error loading your profile. Please try again later.</p>
      <button 
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" 
        onClick={() => fetchUserInfo && fetchUserInfo()}
      >
        Retry
      </button>
    </div>
  );

  // Modal component
 

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // If user data failed to load or is empty
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>
          <ErrorDisplay />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>

        {/* Profile Image Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={
                previewImage ||
                (formData.profileImage ? formData.profileImage : '/default-avatar.png')
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null;
              }}
            />
            <div className="flex-1">
              <input 
                type="file" 
                id="profile-image" 
                className="hidden" 
                accept="image/*" 
                onChange={handleProfileImageChange} 
              />
              <label 
                htmlFor="profile-image" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Change Profile Picture
              </label>
              {previewImage && (
                <button 
                  type="button"
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                  onClick={saveImageChanges}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <FaSpinner className="animate-spin inline mr-2" />
                  ) : null}
                  Save Profile Picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Layout for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Basic Info</h3>
                {editSection !== "basic" ? (
                  <FaEdit 
                    onClick={() => setEditSection("basic")} 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <FaSave 
                      onClick={saveChanges} 
                      className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
                    />
                    <FaTimes 
                      onClick={() => setEditSection(null)} 
                      className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {editSection === "basic" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.name || ""} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" 
                        value={formData.email || ""} 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="text" 
                        name="phone" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.phone || ""} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea 
                        name="Bio" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.Bio || ""} 
                        onChange={handleChange}
                        rows="4"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="text-gray-600">{formData.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600">{formData.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-600">{formData.phone || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 mb-2">Bio:</span>
                      <span className="text-gray-600">{formData.Bio || "N/A"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
                {editSection !== "skills" ? (
                  <FaEdit 
                    onClick={() => setEditSection("skills")} 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <FaSave 
                      onClick={saveChanges} 
                      className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
                    />
                    <FaTimes 
                      onClick={() => setEditSection(null)} 
                      className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {editSection === "skills" ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.skills && formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            <span className="text-sm">{skill}</span>
                            <button 
                              type="button"
                              className="ml-2 text-red-600 hover:text-red-800"
                              onClick={() => handleConfirmDelete("skills", index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={() => handleAddItem("skills")}
                    >
                      + Add Skill
                    </button>
                  </div>
                ) : (
                  <div>
                    {formData.skills && formData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Location Info Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Location</h3>
                {editSection !== "location" ? (
                  <FaEdit 
                    onClick={() => setEditSection("location")} 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <FaSave 
                      onClick={saveChanges} 
                      className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
                    />
                    <FaTimes 
                      onClick={() => setEditSection(null)} 
                      className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {editSection === "location" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location?.region || ""}
                        onChange={(e) => handleLocationChange("region", e.target.value)}
                        placeholder="Region"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location?.city || ""}
                        onChange={(e) => handleLocationChange("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location?.street || ""}
                        onChange={(e) => handleLocationChange("street", e.target.value)}
                        placeholder="Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location?.town || ""}
                        onChange={(e) => handleLocationChange("town", e.target.value)}
                        placeholder="Town"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Region:</span>
                      <span className="text-gray-600">{formData.location?.region || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">City:</span>
                      <span className="text-gray-600">{formData.location?.city || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Street:</span>
                      <span className="text-gray-600">{formData.location?.street || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Town:</span>
                      <span className="text-gray-600">{formData.location?.town || "N/A"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                {editSection !== "education" ? (
                  <FaEdit 
                    onClick={() => setEditSection("education")} 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <FaSave 
                      onClick={saveChanges} 
                      className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
                    />
                    <FaTimes 
                      onClick={() => setEditSection(null)} 
                      className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {editSection === "education" ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {formData.education && formData.education.length > 0 ? (
                        formData.education.map((edu, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{edu.degree}</p>
                              <p className="text-sm text-gray-600">{edu.institution} ({edu.yearOfCompletion})</p>
                            </div>
                            <button 
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleConfirmDelete("education", index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No education added yet.</p>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={() => handleAddItem("education")}
                    >
                      + Add Education
                    </button>
                  </div>
                ) : (
                  <div>
                    {formData.education && formData.education.length > 0 ? (
                      <div className="space-y-3">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-800">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.yearOfCompletion}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No education history available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Work Experience Section - Full Width */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
            {editSection !== "experience" ? (
              <FaEdit 
                onClick={() => setEditSection("experience")} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
              />
            ) : (
              <div className="flex space-x-2">
                <FaSave 
                  onClick={saveChanges} 
                  className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
                  disabled={isProcessing}
                />
                <FaTimes 
                  onClick={() => setEditSection(null)} 
                  className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
                />
              </div>
            )}
          </div>

          <div className="p-6">
            {editSection === "experience" ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {formData.workExperience && formData.workExperience.length > 0 ? (
                    formData.workExperience.map((work, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{work.jobTitle}</p>
                          <p className="text-sm text-gray-600">{work.company}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(work.startDate).toLocaleDateString()} - 
                            {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                          </p>
                        </div>
                        <button 
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleConfirmDelete("workExperience", index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No work experience added yet.</p>
                  )}
                </div>
                <button 
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={() => handleAddItem("work")}
                >
                  + Add Work Experience
                </button>
              </div>
            ) : (
              <div>
                {formData.workExperience && formData.workExperience.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.workExperience.map((work, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{work.jobTitle}</p>
                        <p className="text-sm text-gray-600">{work.company}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(work.startDate).toLocaleDateString()} - 
                          {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No work experience available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding Skills, Education, or Experience */}
      {isModalOpen && (
        <Modal 
          type={modalType} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSaveModalData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <p className="text-gray-800 mb-6">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ProcessingOverlay show={isProcessing} message="Submitting your Changes..." />
      <Footer />
    </div>
  );
};

export default EditProfile;