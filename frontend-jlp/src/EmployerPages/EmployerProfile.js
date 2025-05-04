import { useState, useContext, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/EmployerProfile.css";
import EmployerNavbar from '../Components/EmployerDashboard/EmployerNavbar';
import Footer from "../Components/MyComponents/Footer";
import { userContext } from "../Context/FetchUser";
import {modifyProfile,uploadImage } from '../APIS/API'

const EmployerProfile = () => {
  const { loading,user, setUser, fetchUserInfo, setLoading } = useContext(userContext);
 
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
    
    loadUserData();
  }, []);

  // Update employer state when user data is available
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setEmployer({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        businessName: user.businessName || "",
        businessRegistrationProof: user.businessRegistrationProof || null,
        businessVerified: user.businessVerified || false,
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

  if (loading) {
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
  if (!user || Object.keys(user).length === 0) {
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

        {/* Main Content Sections */}
        <div className="emp-profile__sections-wrapper">
          {/* Personal Info Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Personal Info</h3>
              {editSection !== "personal" ? (
                <FaEdit onClick={() => setEditSection("personal")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "personal" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="emp-profile__input" 
                      value={employer.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Email</label>
                    <input 
                      type="email" 
                      className="emp-profile__input emp-profile__input--disabled" 
                      value={employer.email} 
                      disabled 
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Phone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="emp-profile__input" 
                      value={employer.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              ) : (
                <div className="emp-profile__details">
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Name:</span> 
                    <span className="emp-profile__detail-value">{employer.name || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Email:</span> 
                    <span className="emp-profile__detail-value">{employer.email || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Phone:</span> 
                    <span className="emp-profile__detail-value">{employer.phone || "N/A"}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Business Info Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Business Info</h3>
              {editSection !== "business" ? (
                <FaEdit onClick={() => setEditSection("business")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "business" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      className="emp-profile__input"
                      value={employer.businessName}
                      onChange={handleInputChange}
                      placeholder="Business Name"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Business Registration Proof</label>
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
                <div className="emp-profile__details">
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Business Name:</span> 
                    <span className="emp-profile__detail-value">{employer.businessName || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Registration Proof:</span> 
                    <span className="emp-profile__detail-value">
                      {employer.businessRegistrationProof ? "Uploaded" : "Not uploaded"}
                    </span>
                  </p>
                </div>
              )}

              <div className="emp-profile__badges">
                <span className={`emp-profile__badge ${employer.businessVerified ? "emp-profile__badge--verified" : "emp-profile__badge--unverified"}`}>
                  {employer.businessVerified ? "Business Verified" : "Not Verified"}
                </span>
                <span className={`emp-profile__badge ${employer.isVerified ? "emp-profile__badge--verified" : "emp-profile__badge--unverified"}`}>
                  {employer.isVerified ? "Account Verified" : "Account Not Verified"}
                </span>
                <span className={`emp-profile__badge ${employer.miniTaskEligible ? "emp-profile__badge--eligible" : "emp-profile__badge--not-eligible"}`}>
                  {employer.miniTaskEligible ? "Eligible for Mini Tasks" : "Not Eligible"}
                </span>
              </div>
            </div>
          </div>

          {/* Location Info Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Location</h3>
              {editSection !== "location" ? (
                <FaEdit onClick={() => setEditSection("location")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "location" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Region</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={employer.location?.region || ""}
                      onChange={(e) => handleLocationChange("region", e.target.value)}
                      placeholder="Region"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">City</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={employer.location?.city || ""}
                      onChange={(e) => handleLocationChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Street</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={employer.location?.street || ""}
                      onChange={(e) => handleLocationChange("street", e.target.value)}
                      placeholder="Street"
                    />
                  </div>
                </div>
              ) : (
                <div className="emp-profile__details">
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Region:</span> 
                    <span className="emp-profile__detail-value">{employer.location?.region || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">City:</span> 
                    <span className="emp-profile__detail-value">{employer.location?.city || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Street:</span> 
                    <span className="emp-profile__detail-value">{employer.location?.street || "N/A"}</span>
                  </p>
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