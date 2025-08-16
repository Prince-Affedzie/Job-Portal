import { useState, useEffect, useContext } from "react";
import { userContext } from "../../Context/FetchUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { modifyProfile, uploadImage } from "../../APIS/API";
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import { LoadingSkeleton } from "../../Components/Ui/LoadingSkeleton";
import ProfileImageSection from "../../Components/ProfileEdit/ProfileImageSection";
import BasicInfoSection from "../../Components/ProfileEdit/BasicInfoSection";
import SkillsSection from "../../Components/ProfileEdit/SkillsSection";
import LocationSection from "../../Components/ProfileEdit/LocationSelection";
import EducationSection from "../../Components/ProfileEdit/EducationSection";
import WorkExperienceSection from "../../Components/ProfileEdit/WorkExperienceSection";
import PortfolioSection from "../../Components/ProfileEdit/PortfolioSection"
import AddItemModal from "../../Components/ProfileEdit/AddItemModal";
import DeleteConfirmationModal from "../../Components/ProfileEdit/DeleteConfirmationModal";
import { NotificationToast } from "../../Components/Common/NotificationToast";


const EditProfile = () => {
  const { user, setUser, fetchUserInfo, loading } = useContext(userContext);
  const [editSection, setEditSection] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ /* initial state */ });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null });
  const [triggerSave, setTriggerSave] = useState(false);


 
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
        workPortfolio: user.workPortfolio || [],
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

  const handleAddPortfolio = async(newPortfolio) => {
   
   setFormData(prev => ({
    ...prev,
    workPortfolio: [...(prev.workPortfolio || []), newPortfolio]
  }));

   setTriggerSave(true);
};


// This removeortfolio Listen to the delete portfolio Function from the Profile Section   Component
const handleRemovePortfolio = (updatedPortfolio) => {
  setFormData(prev => ({
    ...prev,
    workPortfolio: updatedPortfolio // Directly set the filtered array
  }));
  setTriggerSave(true);
};

useEffect(() => {
  if (triggerSave) {
    saveChanges().finally(() => setTriggerSave(false));
  }
}, [triggerSave, formData]);


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
     else if (modalType === "portfolio") {
      setFormData(prev => ({
        ...prev,
        workPortfolio: [...(prev.workPortfolio || []),data]
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

  
  if (loading) return <LoadingPage />;
  if (!user || Object.keys(user).length === 0) return <ErrorPage fetchUserInfo={fetchUserInfo} />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>

        <ProfileImageSection 
          previewImage={previewImage}
          formData={formData}
          isProcessing={isProcessing}
          handleProfileImageChange={handleProfileImageChange}
          saveImageChanges={saveImageChanges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BasicInfoSection
              editSection={editSection}
              formData={formData}
              setEditSection={setEditSection}
              handleChange={handleChange}
              saveChanges={saveChanges}
            />

            <SkillsSection
              editSection={editSection}
              formData={formData}
              setEditSection={setEditSection}
              setModalType={setModalType}
              setModalOpen={setModalOpen}
              handleConfirmDelete={handleConfirmDelete}
              saveChanges={saveChanges}
              handleAddItem  ={handleAddItem}
            />
          </div>

          <div className="space-y-8">
            <LocationSection
              editSection={editSection}
              formData={formData}
              setEditSection={setEditSection}
              handleLocationChange={handleLocationChange}
              saveChanges={saveChanges}
            />

            <EducationSection
              editSection={editSection}
              formData={formData}
              setEditSection={setEditSection}
              setModalType={setModalType}
              setModalOpen={setModalOpen}
              handleConfirmDelete={handleConfirmDelete}
              saveChanges={saveChanges}
            />
          </div>
        </div>

        <WorkExperienceSection
          editSection={editSection}
          formData={formData}
          setEditSection={setEditSection}
          setModalType={setModalType}
          setModalOpen={setModalOpen}
          handleConfirmDelete={handleConfirmDelete}
          saveChanges={saveChanges}
          isProcessing={isProcessing}
        />
        <PortfolioSection
        editSection={editSection}
         formData={formData}
          setEditSection={setEditSection}
          setFormData={setFormData}
          handleAddPortfolio={handleAddPortfolio}
          setModalType={setModalType}
          setModalOpen={setModalOpen}
          handleRemovePortfolio= { handleRemovePortfolio}
          saveChanges={saveChanges}
         isProcessing={isProcessing}
         />
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        type={modalType}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModalData}
        handleAddPortfolio={handleAddPortfolio}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
      
      <ProcessingOverlay show={isProcessing} message="Submitting your Changes..." />
       <NotificationToast/>
      <Footer />
    </div>
  );
};

// Helper components
const LoadingPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>
      <LoadingSkeleton />
    </div>
    <Footer />
  </div>
);

const ErrorPage = ({ fetchUserInfo }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-center mb-4">Error loading profile</p>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" 
          onClick={fetchUserInfo}
        >
          Retry
        </button>
      </div>
    </div>
    <Footer />
  </div>
);

export default EditProfile;