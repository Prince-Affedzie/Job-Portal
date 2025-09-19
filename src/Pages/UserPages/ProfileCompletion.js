import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeProfile } from "../../APIS/API";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoCloseCircle } from "react-icons/io5";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaLaptopCode, FaCamera, FaBuilding, FaBriefcase } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProfileCompletion = () => {
  const location = useLocation();
  const role = location.state?.role;

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillSuggestions = [
    {
      label: "Technology & Software",
      options: [
        { value: "Software Engineer", label: "Software Engineer" },
        { value: "Frontend Developer", label: "Frontend Developer" },
        { value: "Backend Developer", label: "Backend Developer" },
        { value: "BlockChain Developer", label: "BlockChain Developer" },
        { value: "DevOps Engineer", label: "DevOps Engineer" },
        { value: "UI/UX Designer", label: "UI/UX Designer" },
        { value: "Data Scientist", label: "Data Scientist" },
        { value: "Cloud Architect", label: "Cloud Architect" },
      ],
    },
    {
      label: "Business & Operations",
      options: [
        { value: "Administrative Assistant", label: "Administrative Assistant" },
        { value: "Business Analyst", label: "Business Analyst" },
        { value: "Business Consultant", label: "Business Consultant" },
        { value: "Product Manager", label: "Product Manager" },
        { value: "Operations Manager", label: "Operations Manager" },
        { value: "HR Specialist", label: "HR Specialist" },
      ],
    },
    {
      label: "Marketing & Sales",
      options: [
        { value: "Digital Marketer", label: "Digital Marketer" },
        { value: "Content Strategist", label: "Content Strategist" },
        { value: "Social Media Manager", label: "Social Media Manager" },
        { value: "Sales Executive", label: "Sales Executive" },
        { value: "SEO Specialist", label: "SEO Specialist" },
      ],
    },
    {
      label: "Creative & Design",
      options: [
        { value: "Graphic Designer", label: "Graphic Designer" },
        { value: "Animator", label: "Animator" },
        { value: "Illustrator", label: "Illustrator" },
        { value: "Motion Designer", label: "Motion Designer" },
        { value: "Video Editor", label: "Video Editor" },
        { value: "3D Artist", label: "3D Artist" },
      ],
    },
  ];

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
    skills: [],
    profileImage: "",
    profileImage_preview: "",
    bio: "",
    phone: "",
    location: { region: "", city: "", town: "", street: "" },
  });

  // Custom styles for Select component
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      maxHeight: "250px",
      overflowY: "auto",
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
      description: "Add a professional photo (optional)",
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
      } else if (!/^\d{10,12}$/.test(profile.phone.replace(/[^0-9]/g, ""))) {
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
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
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
      toast.info("Submitting Your Profile Info");
      const response = await completeProfile(formData);

      if (response.status === 200) {
        toast.success("Profile completed successfully!");
        setTimeout(() => {
        
            navigate("/h1/dashboard");
          
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
    out: { opacity: 0, x: -100 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with brand/logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Professional Profile
          </h1>
          <p className="text-gray-600">
           
              Showcase your skills and experience to attract top employers
            
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />

          {/* Progress tracker */}
          <div className="px-8 pt-8">
            <div className="flex justify-between mb-8 relative">
              {steps.map((stepItem, index) => (
                <div key={index} className="flex flex-col items-center relative z-10 w-1/3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step > index + 1
                        ? "bg-green-500"
                        : step === index + 1
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } transition-all duration-300`}
                  >
                    {step > index + 1 ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      stepItem.icon
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      step >= index + 1 ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {stepItem.title}
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">{stepItem.description}</p>
                </div>
              ))}

              {/* Progress line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0">
                <div
                  className="h-1 bg-blue-600 transition-all duration-500"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <div className="relative">
                        <textarea
                          name="bio"
                          placeholder="Describe your professional background, experience, and what makes you unique..."
                          value={profile.bio}
                          onChange={handleChange}
                          className={`w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.bio ? "border-red-500" : "border-gray-300"
                          }`}
                        ></textarea>
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                        <div className="text-xs text-gray-500 mt-1">
                          {profile.bio.length}/500 characters
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
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
                          <Select
                            options={regionSuggestions}
                            styles={selectStyles}
                            placeholder="Select region..."
                            onChange={handleRegionChange}
                            classNamePrefix="react-select"
                            className={errors.region ? "border-red-500 rounded-lg" : ""}
                          />
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Suburb / Town
                        </label>
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

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
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
                    <div className="relative z-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Skills & Expertise
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select skills that showcase your expertise. Start typing to see suggestions.
                      </p>

                      <CreatableSelect
                        isMulti
                        options={skillSuggestions}
                        styles={selectStyles}
                        onChange={handleSkillChange}
                        placeholder="Search or type your skills..."
                        classNamePrefix="react-select"
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
                        className="py-3 px-6 text-gray-600 bg-gray-100 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="py-3 px-6 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
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
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Photo</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Add a professional photo to help employers trust and recognize you (optional)
                      </p>

                      <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Upload Area */}
                        <div
                          className={`flex-1 w-full border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center bg-gray-50 transition-all ${
                            errors.profileImage
                              ? "border-red-300"
                              : profile.profileImage_preview
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image"
                          />
                          <label
                            htmlFor="profile-image"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            {profile.profileImage_preview ? (
                              <div className="text-green-600 mb-3">
                                <svg
                                  className="w-10 h-10"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <AiOutlineCloudUpload size={48} className="text-blue-500 mb-3" />
                            )}
                            <p
                              className={`text-sm font-medium ${
                                profile.profileImage_preview ? "text-green-600" : "text-gray-700"
                              }`}
                            >
                              {profile.profileImage_preview
                                ? "Photo Selected"
                                : "Drag & drop or click to upload"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG or GIF (Max. 5MB)
                            </p>
                          </label>
                        </div>

                        {/* Preview */}
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {profile.profileImage_preview ? (
                              <img
                                src={profile.profileImage_preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FaUser size={40} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          {profile.profileImage_preview && (
                            <button
                              type="button"
                              onClick={() =>
                                setProfile((prev) => ({
                                  ...prev,
                                  profileImage: "",
                                  profileImage_preview: "",
                                }))
                              }
                              className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                      {errors.profileImage && (
                        <p className="text-red-500 text-xs mt-2">{errors.profileImage}</p>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between">
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
                        className="py-3 px-8 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50"
                      >
                        {isSubmitting ? "Saving..." : "Complete Profile"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Role-specific extra information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              {role === "job_seeker" ? (
                <FaBriefcase className="h-6 w-6 text-blue-500" />
              ) : (
                <FaBuilding className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-800">
               
                  Why complete your profile?
                 
              </h3>
              <p className="mt-2 text-blue-700">
               
                Profiles with complete information are 70% more likely to receive interview invitations. Showcase your skills and experience to stand out to employers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;