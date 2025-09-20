import { useState, useEffect, useContext } from "react";
import { userContext } from "../../Context/FetchUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { modifyProfile, uploadImage } from "../../APIS/API";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import Footer from "../../Components/Common/Footer";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import { LoadingSkeleton } from "../../Components/Ui/LoadingSkeleton";
import ProfileImageSection from "../../Components/ProfileEdit/ProfileImageSection";
import BasicInfoSection from "../../Components/ProfileEdit/BasicInfoSection";
import LocationSection from "../../Components/ProfileEdit/LocationSelection";
import AddItemModal from "../../Components/ProfileEdit/AddItemModal";
import DeleteConfirmationModal from "../../Components/ProfileEdit/DeleteConfirmationModal";
import { NotificationToast } from "../../Components/Common/NotificationToast";

const TaskPosterProfile = () => {
  const { user, setUser, fetchUserInfo, loading } = useContext(userContext);
  const [editSection, setEditSection] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null });
  const [triggerSave, setTriggerSave] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        company: user.company || {},
        postedTasks: user.postedTasks || [],
        stats: user.stats || { tasksPosted: 0, hiresMade: 0, avgRating: 0 }
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

  const handleCompanyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value },
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
    if (modalType === "company") {
      setFormData(prev => ({
        ...prev,
        company: data,
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

  const saveImageChanges = async() => {
    try {
      if (formData.profileImage instanceof File) {
        setIsProcessing(true)
        const res = await uploadImage(formData.profileImage);
        if (res.status === 200) {
          toast.success("Profile Update Successful");
          setEditSection(null);
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    } catch(error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false)
    }
  }

  const saveChanges = async () => {
    try {
      setIsProcessing(true)
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
    } finally {
      setIsProcessing(false)
    }
  };

  const switchToJobSeeker = () => {
    toast.info("Switching to Job Seeker profile");
  };

  if (loading) return <LoadingPage />;
  if (!user || Object.keys(user).length === 0) return <ErrorPage fetchUserInfo={fetchUserInfo} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <ClientSidebar toggleSidebar={() => setIsOpen(false)} isOpen={isOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on medium screens */}
      <div className="hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-30">
        <ClientSidebar />
      </div>

      {/* Main Content */}
      <div className="">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">My Task Poster Profile</h2>
            <button
              onClick={switchToJobSeeker}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Switch to Job Seeker
            </button>
          </div>

          <ProfileImageSection 
            previewImage={previewImage}
            formData={formData}
            isProcessing={isProcessing}
            handleProfileImageChange={handleProfileImageChange}
            saveImageChanges={saveImageChanges}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="space-y-8">
              <BasicInfoSection
                editSection={editSection}
                formData={formData}
                setEditSection={setEditSection}
                handleChange={handleChange}
                saveChanges={saveChanges}
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
            </div>
          </div>
        </div>

        <AddItemModal
          isOpen={isModalOpen}
          type={modalType}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveModalData}
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
    </div>
  );
};

// Helper components
const LoadingPage = () => (
  <div className="min-h-screen flex flex-col">
    <ClientNavbar />
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Poster Profile</h2>
      <LoadingSkeleton />
    </div>
    <Footer />
  </div>
);

const ErrorPage = ({ fetchUserInfo }) => (
  <div className="min-h-screen flex flex-col">
    <ClientNavbar/>
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Poster Profile</h2>
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

export default TaskPosterProfile;