import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeProfile } from "../../APIS/API";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaPhoneAlt, FaMapMarkerAlt, FaCamera } from "react-icons/fa";
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
    location: { city: "", region: "" },
    idCardImage: "",
    idCard_preview: "",
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
    
    if (currentStep === 2) {
      if (!profile.idCardImage) {
        stepErrors.idCardImage = "ID verification is required";
        isValid = false;
      }
    }
    
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

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          idCardImage: file,
          idCard_preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setErrors(prev => ({ ...prev, idCardImage: "File too large (max 5MB)" }));
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
      formData.append("idCardImage", profile.idCardImage);
      
      toast.info('Submitting Your Information');
      const response = await completeProfile(formData);
      
      if (response.status === 200) {
        toast.success("Verification completed successfully!");
        setTimeout(() => {
          navigate("/client/microtask_dashboard");
        }, 1500);
      } else {
        toast.error("Couldn't complete verification");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
          <h2 className="text-2xl font-bold text-white text-center">Verify Your Identity</h2>
          <p className="text-blue-100 text-center mt-2">
            Quick verification to start posting tasks
          </p>
        </div>
        
        {/* Progress tracker */}
        <div className="px-8 pt-8">
          <div className="flex justify-between mb-8 relative">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center relative z-10 w-1/2">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step > stepNumber ? "bg-green-500" : step === stepNumber ? "bg-blue-600" : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  {step > stepNumber ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber === 1 ? <FaPhoneAlt className="text-white" /> : <FaCamera className="text-white" />
                  )}
                </div>
                <p className={`mt-2 text-sm font-medium ${step >= stepNumber ? "text-blue-700" : "text-gray-500"}`}>
                  {stepNumber === 1 ? "Contact Info" : "ID Verification"}
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
                    We need this information to verify your identity and help task seekers contact you.
                  </p>
                  
                  <div className="mb-6">
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
                </div>
                
                <div className="pt-4">
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                  >
                    Continue to Verification
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: ID Verification */}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Verification</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    For security purposes, we need to verify your identity before you can post tasks.
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID Card (ECOWAS/National)</label>
                    <p className="text-sm text-gray-500 mb-3">Accepted: ECOWAS Card or National ID (PNG/JPG, Max 5MB)</p>

                    <div className={`w-full border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center bg-gray-50 transition-all ${
                      errors.idCardImage ? "border-red-300" : profile.idCard_preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdUpload}
                        className="hidden"
                        id="id-card-upload"
                        required
                      />
                      <label htmlFor="id-card-upload" className="cursor-pointer flex flex-col items-center">
                        {profile.idCard_preview ? (
                          <div className="text-green-600 mb-2">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <AiOutlineCloudUpload size={40} className="text-blue-500 mb-2" />
                        )}
                        <p className={`text-sm ${profile.idCard_preview ? "text-green-600" : "text-gray-500"}`}>
                          {profile.idCard_preview ? "ID Selected" : "Click to upload ID card"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPG or PNG format</p>
                      </label>

                      {/* ID Preview + Remove */}
                      {profile.idCard_preview && (
                        <>
                          <img
                            src={profile.idCard_preview}
                            alt="ID Preview"
                            className="mt-4 w-full max-w-xs rounded shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setProfile(prev => ({
                                ...prev,
                                idCardImage: "",
                                idCard_preview: ""
                              }))
                            }
                            className="mt-3 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove ID
                          </button>
                        </>
                      )}
                    </div>
                    {errors.idCardImage && <p className="text-red-500 text-xs mt-1">{errors.idCardImage}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Your ID information is encrypted and stored securely. We only use it for verification purposes.
                    </p>
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
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isSubmitting ? "Verifying..." : "Complete Verification"}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
      
      {/* Information note */}
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Verification helps ensure a safe community for both task posters and task seekers. Your information is kept secure and confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPosterOnboarding;