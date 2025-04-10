import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeProfile } from "../APIS/API";
import Select from "react-select";
import { AiOutlineCloudUpload } from "react-icons/ai"; // Upload icon
import { IoCloseCircle } from "react-icons/io5"; // Close icon for skill tags

const ProfileCompletion = () => {
  const {role} = useParams()
  const navigate = useNavigate()
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
    profile_image: "",
    profile_image_preview: "",
    bio: "",
    phone: "",
    location: { city: "", town: "", street: "", region: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleSkillChange = (selectedOptions) => {
    setProfile((prev) => ({ ...prev, skills: selectedOptions.map((opt) => opt.value) }));
  };

  const handleRegionChange = (selectedOption) => {
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, region: selectedOption.value },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        profile_image: file,
        profile_image_preview: imageUrl,
      }));
    }
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key === "profile_image") {
          formData.append(key, profile.profile_image);
        } else if (key === "skills") {
          profile.skills.forEach((skill) => formData.append("skills[]", skill));
        } else if (key === "location") {
          Object.keys(profile.location).forEach((locKey) =>
            formData.append(`location[${locKey}]`, profile.location[locKey])
          );
        } else {
          formData.append(key, profile[key]);
        }
      });

      const response = await completeProfile(formData);
      if (response.status === 200) {
        toast.success("Profile Completed Successfully");
        if(role === "job_seeker"){
            navigate('/job/listings')
        }else{
          navigate("/employer/dashboard")
        }
      } else {
        toast.error("Couldn't Complete Profile");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Profile</h2>
      
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className={`h-2 rounded-full transition-all ${
            step === 1 ? "w-1/4 bg-blue-500" : step === 2 ? "w-1/2 bg-blue-600" : step === 3 ? "w-3/4 bg-blue-700" : "w-full bg-green-500"
          }`}
        ></div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        {["Basic Info", "Skills", "Profile Image"].map((label, index) => (
          <div key={index} className={`flex-1 text-center text-sm ${step >= index + 1 ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
            {index + 1}. {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <label className="font-semibold">Bio</label>
            <textarea name="bio" placeholder="Short Bio" value={profile.bio} onChange={handleChange} className="border p-2 rounded w-full" required></textarea>

            <label className="font-semibold">Phone Number</label>
            <input type="text" name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleChange} className="border p-2 rounded w-full" required />

            <label className="font-semibold">Region</label>
            <Select options={regionSuggestions} classNamePrefix="select" onChange={handleRegionChange} />

            <label className="font-semibold">City</label>
            <input type="text" name="city" placeholder="City" value={profile.location.city} onChange={handleLocationChange} className="border p-2 rounded w-full" required />

            <button type="button" onClick={nextStep} className="bg-blue-500 text-white p-2 rounded w-full">Next</button>
          </>
        )}

        {/* Step 2: Skills (Modernized) */}
        {step === 2 && (
          <>
            <label className="font-semibold">Select Your Skills</label>
            <Select
              isMulti
              options={skillSuggestions}
              classNamePrefix="select"
              onChange={handleSkillChange}
              placeholder="Type to search and select..."
            />

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                  <IoCloseCircle className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => removeSkill(skill)} />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="bg-gray-500 text-white p-2 rounded">Back</button>
              <button type="button" onClick={() => setStep(3)} className="bg-blue-500 text-white p-2 rounded">Next</button>
            </div>
          </>
        )}

        {/* Step 3: Profile Image */}
        {step === 3 && (
          <>
            <label className="font-semibold">Upload Profile Image</label>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center flex flex-col items-center">
              <AiOutlineCloudUpload size={50} className="text-gray-500 mb-2" />
              <p className="text-gray-500">Drag & drop or click to upload</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="mt-2 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">Choose File</label>
            </div>

            {/* Live Preview */}
            {profile.profile_image_preview && (
              <div className="mt-4 flex flex-col items-center">
                <img src={profile.profile_image_preview} alt="Preview" className="w-24 h-24 rounded-full shadow-md" />
                <button onClick={() => setProfile({ ...profile, profile_image: "", profile_image_preview: "" })} className="mt-2 text-red-500">
                  Remove
                </button>
              </div>
            )}

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="bg-gray-500 text-white p-2 rounded">Back</button>
              <button type="submit" className="bg-green-500 text-white p-2 rounded">Finish</button>
            </div>
          </>
        )}
        
      </form>
    </div>
  );
};

export default ProfileCompletion;
