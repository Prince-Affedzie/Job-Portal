import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeProfile } from "../../APIS/API";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaPhoneAlt, FaMapMarkerAlt, FaCamera, FaUser, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const TaskPosterOnboarding = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regionSuggestions = [
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "Ahafo", label: "Ahafo" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Bono East", label: "Bono East" },
    { value: "Brong Ahafo", label: "Brong Ahafo" },
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Northern", label: "Northern" },
    { value: "North East", label: "North East" },
    { value: "Oti", label: "Oti" },
    { value: "Savannah", label: "Savannah" },
    { value: "Upper East", label: "Upper East" },
    { value: "Upper West", label: "Upper West" },
    { value: "Volta", label: "Volta" },
    { value: "Western North", label: "Western North" },
    { value: "Western", label: "Western" },
  ];

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    phone: "",
    location: { city: "", region: "", town: "" },
    profileImage: "",
    profileImage_preview: "",
  });

  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;
    
    if (currentStep === 1) {
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
    
    // Profile picture is now optional, so no validation required
    // if (currentStep === 2) {
    //   if (!profile.profileImage) {
    //     stepErrors.profileImage = "Profile picture is recommended";
    //     isValid = false;
    //   }
    // }
    
    setErrors(stepErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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
        setErrors(prev => ({ ...prev, profileImage: "File too large (max 5MB)" }));
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        profileImage: file,
        profileImage_preview: imageUrl,
      }));
      if (errors.profileImage) {
        setErrors(prev => ({ ...prev, profileImage: null }));
      }
    }
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
      
      formData.append("phone", profile.phone);
      formData.append("location[city]", profile.location.city);
      formData.append("location[region]", profile.location.region);
      formData.append("location[town]", profile.location.town);
      if (profile.profileImage) {
        formData.append("profileImage", profile.profileImage);
      }
      
      toast.info('Submitting Your Information');
      const response = await completeProfile(formData);
      
      if (response.status === 200) {
        toast.success("Profile completed successfully!");
        setTimeout(() => {
          navigate("/client/microtask_dashboard");
        }, 1500);
      } else {
        toast.error("Couldn't complete profile setup");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Task Poster Profile</h1>
          <p className="text-gray-600">Build trust with task seekers by completing your profile</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
          
          {/* Progress tracker */}
          <div className="px-8 pt-8">
            <div className="flex justify-between mb-8 relative">
              {[
                { number: 1, title: "Contact Info", icon: <FaPhoneAlt className="text-white" /> },
                { number: 2, title: "Profile Photo", icon: <FaCamera className="text-white" /> }
              ].map((stepItem) => (
                <div key={stepItem.number} className="flex flex-col items-center relative z-10 w-1/2">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step > stepItem.number ? "bg-green-500" : step === stepItem.number ? "bg-blue-600" : "bg-gray-200"
                    } transition-all duration-300`}
                  >
                    {step > stepItem.number ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepItem.icon
                    )}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${step >= stepItem.number ? "text-blue-700" : "text-gray-500"}`}>
                    {stepItem.title}
                  </p>
                </div>
              ))}
              
              {/* Progress line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0">
                <div 
                  className="h-1 bg-blue-600 transition-all duration-500"
                  style={{ width: `${(step - 1) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Form content */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Contact Info */}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      We need this information to help task seekers contact you and verify your location.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <select 
                            value={profile.location.region}
                            onChange={(e) => handleRegionChange({value: e.target.value})}
                            className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none ${
                              errors.region ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select region...</option>
                            {regionSuggestions.map(region => (
                              <option key={region.value} value={region.value}>{region.label}</option>
                            ))}
                          </select>
                          {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suburb / Town</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <input 
                            type="text" 
                            name="town" 
                            placeholder="Suburb" 
                            value={profile.location.town} 
                            onChange={handleLocationChange} 
                            className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                              errors.town ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.town && <p className="text-red-500 text-xs mt-1">{errors.town}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                    >
                      Continue to Profile Photo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile Photo */}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add a Profile Photo</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Adding a profile photo helps build trust with task seekers and makes your verification quick (optional but recommended).
                    </p>
                    
                    <div className="mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <FaShieldAlt className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-800">Why add a profile photo?</h4>
                            <ul className="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
                              <li>Task seekers are 5x more likely to respond to profiles with photos</li>
                              <li>Builds trust and shows you're a real person</li>
                              <li>Helps task seekers recognize you if you meet in person</li>
                              <li>Makes your tasks appear more legitimate</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className={`w-full border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center bg-gray-50 transition-all ${
                        errors.profileImage ? "border-red-300" : profile.profileImage_preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <label htmlFor="profile-image-upload" className="cursor-pointer flex flex-col items-center">
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
                            {profile.profileImage_preview ? "Photo Selected" : "Click to upload profile photo"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">JPG or PNG format (Max 5MB)</p>
                        </label>

                        {/* Profile Preview + Remove */}
                        {profile.profileImage_preview && (
                          <>
                            <div className="mt-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                              <img
                                src={profile.profileImage_preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setProfile(prev => ({
                                  ...prev,
                                  profileImage: "",
                                  profileImage_preview: ""
                                }))
                              }
                              className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove Photo
                            </button>
                          </>
                        )}
                      </div>
                      {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
                      <p className="text-xs text-gray-500 mt-2">
                        You can skip this step and add a photo later, but we recommend adding one now to build trust with task seekers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 text-gray-600 bg-gray-100 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3 px-6 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Completing..." : "Complete Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="py-3 px-6 text-blue-600 bg-white border border-blue-300 rounded-lg shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Completing..." : "Skip for Now"}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
        
        {/* Information note */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaUser className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Complete profiles get better results</h3>
              <p className="mt-2 text-sm text-blue-700">
                Task posters with complete profiles receive more applications and higher quality responses from task seekers. 
                Your information helps build trust and makes your tasks more appealing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPosterOnboarding;