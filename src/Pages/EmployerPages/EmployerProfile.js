import { useState, useContext, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/EmployerProfile.css";
import EmployerNavbar from '../../Components/EmployerDashboard/EmployerNavbar';
import Footer from "../../Components/Common/Footer";
import { userContext } from "../../Context/FetchUser";
import {modifyProfile,uploadImage } from '../../APIS/API'
import { useEmployerProfileContext } from "../../Context/EmployerProfileContext";


const EmployerProfile = () => {
  const { loading,user, setUser, fetchUserInfo, setLoading } = useContext(userContext);
  const {loading1,employerprofile,fetchEmloyerProfile} = useEmployerProfileContext()
  const [previewImage, setPreviewImage] = useState(null);
  const [editSection, setEditSection] = useState(null); // 'personal', 'business', 'location'
  const [isProcessing,setIsProcessing] = useState(false)

  // Initialize employer state from user context when available
  const [employer, setEmployer] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessRegistrationProof: null,
    businessVerified: false,
    miniTaskEligible: false,
    isVerified: false,
    profileImage: "",
    location: {
      region: "",
      city: "",
      street: "",
    },
  });

  

  useEffect(() => {
    const loadUserData = async () => {
     
      try {
        await fetchUserInfo();
        await fetchEmloyerProfile(); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
    
    loadUserData();
  }, []);



  // Update employer state when user data is available
  useEffect(() => {
    if (user && employerprofile && Object.keys(user).length > 0) {
      setEmployer({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        businessName: employerprofile.companyName || "",
        businessRegistrationProof: employerprofile.businessDocs || null,
        businessVerified: employerprofile.isVerified || false,
        miniTaskEligible: user.miniTaskEligible || false,
        isVerified: user.isVerified || false,
        profileImage: user.profileImage || "",
        location: {
          region: user.location?.region || "",
          city: user.location?.city || "",
          street: user.location?.street || "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (field, value) => {
    setEmployer((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleBusinessProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployer((prev) => ({ ...prev, businessRegistrationProof: file }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setEmployer((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const saveImageChanges = async()=>{
      try{
  
        if (employer.profileImage instanceof File) {
          setIsProcessing(true)
          console.log(employer.profileImage)
          const res = await uploadImage(employer.profileImage);
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
  

  const saveChanges = async() => {
    console.log("Updated employer:", employer);
    try{
    const response =await modifyProfile(employer)
    if(response.status ===200){
          toast.success("Profile Update Successful");
        setEditSection(null);
    }else{
        toast.error("An error occurred. Please try again later");
    }
   
    }catch(error){
       const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
             console.log(errorMessage);
             toast.error(errorMessage);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="emp-profile__loading">
      <div className="emp-profile__loading-spinner">
        <FaSpinner className="emp-profile__spinner-icon" />
      </div>
      <p className="emp-profile__loading-text">Loading profile information...</p>
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <div className="emp-profile__error">
      <p>There was an error loading your profile. Please try again later.</p>
      <button 
        className="emp-profile__retry-btn" 
        onClick={() => fetchUserInfo()}
      >
        Retry
      </button>
    </div>
  );

  if (loading || loading1) {
    return (
      <div className="emp-profile__page">
        <EmployerNavbar />
        <div className="emp-profile__container">
          <h2 className="emp-profile__title">Employer Profile</h2>
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // If user data failed to load or is empty
  if (!user || Object.keys(user).length === 0 || !employerprofile || Object.keys(employerprofile).length === 0) {
    return (
      <div className="emp-profile__page">
        <EmployerNavbar />
        <div className="emp-profile__container">
          <h2 className="emp-profile__title">Employer Profile</h2>
          <ErrorDisplay />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="emp-profile__page">
        <ToastContainer/>
      <EmployerNavbar />

      <div className="emp-profile__container">
        <h2 className="emp-profile__title">Employer Profile</h2>

        {/* Profile Image */}
        <div className="emp-profile__image-section">
          <img
            src={
              previewImage ||
              (employer.profileImage ?employer.profileImage : '/default-avatar.png')
            }
            alt="Profile"
            className="emp-profile__avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback image on error
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
          <div className="emp-profile__upload-wrapper">
            <input 
              type="file" 
              id="profile-image" 
              className="emp-profile__file-input" 
              accept="image/*" 
              onChange={handleProfileImageChange} 
            />
            <label htmlFor="profile-image" className="emp-profile__upload-btn">
              Change Profile Picture
            </label>
             {previewImage && (
                   <button 
                    type="button"
                    className="emp-profile__save-image-btn"
                    onClick={saveImageChanges}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <FaSpinner className="emp-profile__spinner-icon" />
                    ) : (
                      "Save Profile Picture"
                    )}
                  </button>
                )}
          </div>
        </div>

        {/* Main Content Sections - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-8">
          {/* Personal Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Info</h3>
              {editSection !== "personal" ? (
                <FaEdit 
                  onClick={() => setEditSection("personal")} 
                  className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200" 
                />
              ) : (
                <div className="flex space-x-2">
                  <FaSave 
                    onClick={saveChanges} 
                    className="text-green-500 hover:text-green-700 cursor-pointer transition-colors duration-200" 
                  />
                  <FaTimes 
                    onClick={() => setEditSection(null)} 
                    className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200" 
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {editSection === "personal" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={employer.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" 
                      value={employer.email} 
                      disabled 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      value={employer.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">Name:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.name || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">Email:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.email || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">Phone:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.phone || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Business Info</h3>
              {/* Business edit functionality is commented out in original code */}
            </div>

            <div className="space-y-4">
              {editSection === "business" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={employer.businessName}
                      onChange={handleInputChange}
                      placeholder="Business Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Proof</label>
                    <input 
                      type="file" 
                      id="business-proof" 
                      className="emp-profile__file-input" 
                      onChange={handleBusinessProofUpload} 
                    />
                    <label htmlFor="business-proof" className="emp-profile__upload-btn emp-profile__upload-btn--secondary">
                      Upload Document
                    </label>
                    {employer.businessRegistrationProof && (
                      <span className="emp-profile__file-selected">File selected</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-24">Business Name:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.businessName || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-24">Registration Proof:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">
                      {employer.businessRegistrationProof ? "Uploaded" : "Not uploaded"}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="space-y-3 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-600 w-24 mb-1 sm:mb-0">Business Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    employer.businessVerified 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {employer.businessVerified ? "Business Verified" : "Not Verified"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-600 w-24 mb-1 sm:mb-0">Account Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    employer.isVerified 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {employer.isVerified ? "Account Verified" : "Account Not Verified"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-600 w-24 mb-1 sm:mb-0">Mini Task Eligibility:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    employer.miniTaskEligible 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {employer.miniTaskEligible ? "Eligible for Mini Tasks" : "Not Eligible"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Info Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Location</h3>
              {editSection !== "location" ? (
                <FaEdit 
                  onClick={() => setEditSection("location")} 
                  className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200" 
                />
              ) : (
                <div className="flex space-x-2">
                  <FaSave 
                    onClick={saveChanges} 
                    className="text-green-500 hover:text-green-700 cursor-pointer transition-colors duration-200" 
                  />
                  <FaTimes 
                    onClick={() => setEditSection(null)} 
                    className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200" 
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {editSection === "location" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={employer.location?.region || ""}
                      onChange={(e) => handleLocationChange("region", e.target.value)}
                      placeholder="Region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={employer.location?.city || ""}
                      onChange={(e) => handleLocationChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={employer.location?.street || ""}
                      onChange={(e) => handleLocationChange("street", e.target.value)}
                      placeholder="Street"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">Region:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.location?.region || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">City:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.location?.city || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-sm font-medium text-gray-600 w-20">Street:</span> 
                    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{employer.location?.street || "N/A"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployerProfile;