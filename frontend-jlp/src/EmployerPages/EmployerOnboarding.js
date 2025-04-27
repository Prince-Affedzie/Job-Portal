import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { completeProfile } from '../APIS/API'; // Adjust this path as needed
import 'react-toastify/dist/ReactToastify.css';

const EmployerOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: {
      region: '',
      city: '',
      town: '',
      street: ''
    },
    businessName: '',
    businessRegistrationProof: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location')) {
      const [key] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [key]: value
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      businessRegistrationProof: e.target.files[0]
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await completeProfile(formData);
      if (response.status === 200) {
        toast.success('Profile completed successfully!');
        setTimeout(() => {
          navigate('/employer/dashboard');
        }, 1500);
      } else {
        toast.error("Couldn't complete profile");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Complete Your Employer Profile</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label htmlFor="region" className="text-sm font-medium text-gray-700">Region</label>
              <input
                type="text"
                id="region"
                name="location.region"
                value={formData.location.region}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label htmlFor="town" className="text-sm font-medium text-gray-700">Town</label>
              <input
                type="text"
                id="town"
                name="location.town"
                value={formData.location.town}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="street" className="text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                id="street"
                name="location.street"
                value={formData.location.street}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Business Name */}
          <div className="flex flex-col mb-6">
            <label htmlFor="businessName" className="text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Business Registration Proof */}
          <div className="flex flex-col mb-6">
            <label htmlFor="businessRegistrationProof" className="text-sm font-medium text-gray-700">Business Registration Proof</label>
            <input
              type="file"
              id="businessRegistrationProof"
              name="businessRegistrationProof"
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
