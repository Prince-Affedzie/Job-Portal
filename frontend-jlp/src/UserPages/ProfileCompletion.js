import { useState, useEffect } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeProfile } from "../APIS/API";
import Select from "react-select";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoCloseCircle } from "react-icons/io5";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaLaptopCode, FaCamera } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProfileCompletion = () => {
  const  location  = useLocation();
  const role =location.state?.role
  console.log(role)
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillSuggestions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Data Science", label: "Data Science" },
    { value: "SEO", label: "SEO" },
    { value: "Copywriting", label: "Copywriting" },
    { value: "Cybersecurity", label: "Cybersecurity" },
  ];

  const regionSuggestions = [
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Western", label: "Western" },
    { value: "Northern", label: "Northern" },
    { value: "Volta", label: "Volta" },
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Bono", label: "Bono" },
    { value: "Upper East", label: "Upper East" },
    { value: "Upper West", label: "Upper West" },
  ];

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    skills: [],
    profileImage: "",
    profileImage_preview: "",
    bio: "",
    phone: "",
    location: { city: "", town: "", street: "", region: "" },
  });

  // Custom styles for Select component
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "#dbeafe",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#1e40af",
      fontWeight: 500,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#3b82f6",
      "&:hover": {
        backgroundColor: "#bfdbfe",
        color: "#1e3a8a",
      },
    }),
  };

  // Step configurations
  const steps = [
    {
      title: "Basic Info",
      icon: <FaUser className="text-blue-500" />,
      description: "Tell us about yourself",
    },
    {
      title: "Skills",
      icon: <FaLaptopCode className="text-blue-500" />,
      description: "What are you good at?",
    },
    {
      title: "Profile Image",
      icon: <FaCamera className="text-blue-500" />,
      description: "Add a face to your profile",
    },
  ];

  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;
    
    if (currentStep === 1) {
      if (!profile.bio.trim()) {
        stepErrors.bio = "Bio is required";
        isValid = false;
      }
      
      if (!profile.phone.trim()) {
        stepErrors.phone = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10,12}$/.test(profile.phone.replace(/[^0-9]/g, ''))) {
        stepErrors.phone = "Please enter a valid phone number";
        isValid = false;
      }
      
      if (!profile.location.region) {
        stepErrors.region = "Region is required";
        isValid = false;
      }
      
      if (!profile.location.city.trim()) {
        stepErrors.city = "City is required";
        isValid = false;
      }
    }
    
    if (currentStep === 2) {
      if (profile.skills.length === 0) {
        stepErrors.skills = "Please select at least one skill";
        isValid = false;
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSkillChange = (selectedOptions) => {
    setProfile((prev) => ({ 
      ...prev, 
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : [] 
    }));
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: null }));
    }
  };

  const handleRegionChange = (selectedOption) => {
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, region: selectedOption ? selectedOption.value : "" },
    }));
    if (errors.region) {
      setErrors((prev) => ({ ...prev, region: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "Image size should be less than 5MB" }));
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        profileImage: file,
        profileImage_preview: imageUrl,
      }));
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: null }));
      }
    }
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      Object.keys(profile).forEach((key) => {
        if (key === "profileImage" && profile.profileImage) {
          formData.append(key, profile.profileImage);
        } else if (key === "skills") {
          profile.skills.forEach((skill) => formData.append("skills[]", skill));
        } else if (key === "location") {
          Object.keys(profile.location).forEach((locKey) =>
            formData.append(`location[${locKey}]`, profile.location[locKey])
          );
        } else if (key !== "profileImage_preview") {
          formData.append(key, profile[key]);
        }
      });
      toast.info('Submitting Your Profile Info')
      const response = await completeProfile(formData);
      
      if (response.status === 200) {
        toast.success("Profile completed successfully!");
        setTimeout(() => {
          if (role === "job_seeker") {
            navigate('/job/listings');
          } else {
            navigate("/employer/dashboard");
          }
        }, 1500);
      } else {
        toast.error("Couldn't complete profile");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
        
        {/* Header with brand/logo */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
          <h2 className="text-3xl font-bold text-white text-center">Complete Your Profile</h2>
          <p className="text-blue-100 text-center mt-2">
            {role === "job_seeker" ? "Find your dream job by completing your profile" : "Start hiring top talent by setting up your employer profile"}
          </p>
        </div>
        
        {/* Progress tracker */}
        <div className="px-8 pt-8">
          <div className="flex justify-between mb-8 relative">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex flex-col items-center relative z-10 w-1/3">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step > index + 1 ? "bg-green-500" : step === index + 1 ? "bg-blue-600" : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  {step > index + 1 ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepItem.icon
                  )}
                </div>
                <p className={`mt-2 text-sm font-medium ${step >= index + 1 ? "text-blue-700" : "text-gray-500"}`}>
                  {stepItem.title}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">{stepItem.description}</p>
              </div>
            ))}
            
            {/* Progress line */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0">
              <div 
                className="h-1 bg-blue-600 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <div className="relative">
                      <textarea 
                        name="bio" 
                        placeholder="Tell us about yourself..." 
                        value={profile.bio} 
                        onChange={handleChange} 
                        className={`w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          errors.bio ? "border-red-500" : "border-gray-300"
                        }`}
                      ></textarea>
                      {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaPhoneAlt className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="phone" 
                        placeholder="+233 XX XXX XXXX" 
                        value={profile.phone} 
                        onChange={handleChange} 
                        className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <Select 
                          options={regionSuggestions} 
                          styles={selectStyles}
                          placeholder="Select region..."
                          onChange={handleRegionChange}
                          className={errors.region ? "border-red-500 rounded-lg" : ""}
                        />
                        {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          name="city" 
                          placeholder="City" 
                          value={profile.location.city} 
                          onChange={handleLocationChange} 
                          className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                    >
                      Continue to Skills
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Skills */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills</label>
                    <p className="text-sm text-gray-500 mb-3">Select skills that showcase your expertise</p>
                    
                    <Select
                      isMulti
                      options={skillSuggestions}
                      styles={selectStyles}
                      onChange={handleSkillChange}
                      placeholder="Search and select skills..."
                      className={errors.skills ? "border-red-500 rounded-lg" : ""}
                    />
                    {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                  </div>
                  
                  {/* Selected Skills Tags */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            key={index}
                            className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              <IoCloseCircle size={18} />
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No skills selected yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 text-gray-600 bg-gray-100 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Profile Image */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Image</label>
                    <p className="text-sm text-gray-500 mb-3">Add a professional photo (Max size: 5MB)</p>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Upload Area */}
                      <div className={`flex-1 w-full border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center bg-gray-50 transition-all ${
                        errors.profileImage ? "border-red-300" : profile.profileImage_preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image"
                        />
                        <label
                          htmlFor="profile-image"
                          className="w-full flex flex-col items-center cursor-pointer"
                        >
                          {profile.profileImage_preview ? (
                            <div className="text-green-600 mb-2">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <AiOutlineCloudUpload size={40} className="text-blue-500 mb-2" />
                          )}
                          <p className={`text-sm ${profile.profileImage_preview ? "text-green-600" : "text-gray-500"}`}>
                            {profile.profileImage_preview ? "Image Selected" : "Drag & drop or click to browse"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG or GIF format
                          </p>
                        </label>
                      </div>
                      
                      {/* Preview Area */}
                      <div className="flex flex-col items-center w-full md:w-1/3">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                          {profile.profileImage_preview ? (
                            <img
                              src={profile.profileImage_preview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaUser size={40} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {profile.profile_image_preview && (
                          <button
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, profileImage: "", profileImage_preview: "" }))}
                            className="mt-3 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 text-gray-600 bg-gray-100 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`py-3 px-8 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        "Complete Profile"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
      
      {/* Role-specific extra information */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {role === "job_seeker" 
                  ? "Complete your profile to increase your chances of getting noticed by employers. A well-filled profile is 70% more likely to receive interview invitations."
                  : "Setting up a detailed company profile helps attract qualified candidates. Make sure to provide comprehensive information about your organization."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;