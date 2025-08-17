
import {React,useEffect,useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSpecificJobApplications, modifyApplication } from "../../APIS/API";

export const useApplicantsManager = (jobId) => {
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchApplicantsData();
  }, [jobId]);

  const fetchApplicantsData = async () => {
    try {
      setLoading(true);
      const response = await getSpecificJobApplications(jobId);
      
      if (response.status === 200) {
        // Set job details
        if (response.data.length > 0) {
          const firstApp = response.data[0];
          setJobDetails({
            id: firstApp.job._id,
            title: firstApp.job.title,
            status: firstApp.job.status, 
            location: firstApp.job.deliveryMode, 
            salary: firstApp.job.salary, 
            createdAt: firstApp.job.createdAt, 
            noOfApplicants: firstApp.job.noOfApplicants || response.data.length
          });
        }

        // Transform applications data
        const transformedApplicants = response.data.map(app => ({
          id: app._id,
          userId: app.user._id,
          name: app.user.name,
          email: app.user.email || "Email not provided",
          phone: app.user.phone || "Phone not provided",
          profileImage: app.user.profileImage || "https://via.placeholder.com/150",
          skills: app.user.skills || [],
          workExperience: app.user.workExperience || [],
          experience: app.user.workExperience?.length > 0 
            ? `${app.user.workExperience.length} years` 
            : "No experience listed",
          location: app.user.location?.city || "Location not specified",
          educationList: app.user.education || [],
          coverLetter: app.coverLetter || "No cover letter provided",
          status: app.status || "New",
          dateApplied: app.createdAt,
          lastActivity: app.updatedAt,
          resume: app.resume || null,
          totalScore: app.totalScore,
          skillsScore: app.skillsScore,
          workExperinceScore: app.expScore,
          workPortfolio: app.user.workPortfolio,
          linkedIn: app.user.linkedIn || ""
        }));
        
        setApplicants(transformedApplicants);
      } else {
        toast.error("Failed to load applicants data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while loading applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  // Status change handler
  const handleAppStatusChange = async (payload) => {
    try {
      const response = await modifyApplication(payload);
      
      if (response.status === 200) {
        toast.success(`Application state modified successfully`);
       /* setApplicants(prev => prev.map(app => 
         Ids.includes(app.id) ? { ...app, status: status.status } : app
        ));
        
        if (selectedApplicant && Ids.includes(selectedApplicant.id)) {
          setSelectedApplicant(prev => ({ ...prev, status: status.status }));
        }*/
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  // Toggle applicant selection
  const toggleApplicant = (userId, applicationId) => {
  setSelectedApplicants((prev) => {
    const exists = prev.some(a => a.userId === userId);
    if (exists) {
      return prev.filter(a => a.userId !== userId);
    } else {
      return [...prev, { userId, applicationId }];
    }
  });
};


  // Handle profile view
  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
  };

  return {
    loading,
    jobDetails,
    applicants,
    selectedApplicant,
    setSelectedApplicant,
    setSelectedApplicants, 
    selectedApplicants,
    handleAppStatusChange,
    toggleApplicant,
    handleViewProfile
  };
};