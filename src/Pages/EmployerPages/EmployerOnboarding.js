import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employerSignUp,sendFileToS3 } from '../../APIS/API'; // Adjust this path as needed
import 'react-toastify/dist/ReactToastify.css';
import ProcessingOverlay from '../../Components/Common/ProcessingOverLay';

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyLine: '',
    personalLine: '',
    companyLocation: '',
    companyWebsite: '',
    businessDocs: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing,setIsProcessing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      businessDocs: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsProcessing(true);
  
    // Convert to FormData
    const data = new FormData();
    data.append('companyName', formData.companyName);
    data.append('companyEmail', formData.companyEmail);
    data.append('companyLine', formData.companyLine);
    data.append('personalLine', formData.personalLine);
    data.append('companyLocation', formData.companyLocation);
    data.append('companyWebsite', formData.companyWebsite);
    data.append('businessDocs', formData.businessDocs)
   
    
  
    try {
      const response = await employerSignUp(data); // API must handle FormData
      if (response.status === 200) {
        const { uploadUrl } = response.data;
        await sendFileToS3(uploadUrl, formData.businessDocs);
        toast.success('Profile completed successfully!');
        setTimeout(() => {
          navigate('/employer/dashboard');
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
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="bg-gradient-to-tr from-indigo-50 to-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">Complete Your Company Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="flex flex-col">
            <label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Acme Corporation"
              required
            />
          </div>

          {/* Company Email */}
          <div className="flex flex-col">
            <label htmlFor="companyEmail" className="text-sm font-medium text-gray-700 mb-1">Company Email</label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., contact@acmecorp.com"
              required
            />
          </div>

          {/* Company Line (Phone Number) */}
          <div className="flex flex-col">
            <label htmlFor="companyLine" className="text-sm font-medium text-gray-700 mb-1">Company Phone Number</label>
            <input
              type="tel"
              id="companyLine"
              name="companyLine"
              value={formData.companyLine}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., + 233 567 8901"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="personalLine" className="text-sm font-medium text-gray-700 mb-1">Personal Phone Number</label>
            <input
              type="tel"
              id="personalLine"
              name="personalLine"
              value={formData.personalLine}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., + 233 567 8901"
              required
            />
          </div>

          {/* Company Location */}
          <div className="flex flex-col">
            <label htmlFor="companyLocation" className="text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <input
              type="text"
              id="companyLocation"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 123 Main St, Springfield"
              required
            />
          </div>

          {/* Company Website */}
          <div className="flex flex-col">
            <label htmlFor="companyWebsite" className="text-sm font-medium text-gray-700 mb-1">Company Website</label>
            <input
              type="url"
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., https://www.acmecorp.com"
            />
          </div>

          {/* Business Registration Documents */}
          <div className="flex flex-col">
            <label htmlFor="businessDocs" className="text-sm font-medium text-gray-700 mb-1">Business Registration Documents Or Your Ghana Card</label>
            <input
              type="file"
              id="businessDocs"
              name="businessDocs"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
