import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const BasicInfoSection = ({
  editSection,
  formData,
  setEditSection,
  handleChange,
  saveChanges
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your personal details</p>
      </div>
      {editSection !== "basic" ? (
        <button 
          onClick={() => setEditSection("basic")}
          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Edit Information
        </button>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={saveChanges}
            className="inline-flex items-center px-3 py-2.0 md:px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
          <button
            onClick={() => setEditSection(null)}
            className="inline-flex items-center px-3 py-2.0 md:px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>
      )}
    </div>

    <div className="p-6">
      {editSection === "basic" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-4">Personal Details</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              value={formData.name || ""} 
              onChange={handleChange}
              placeholder="Enter your full name" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              value={formData.phone || ""} 
              onChange={handleChange}
              placeholder="e.g. 123-456-7890"
            />
            <p className="text-xs text-gray-500 mt-1.5">Format: 123-456-7890</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" 
              value={formData.email || ""} 
              disabled 
            />
            <p className="text-xs text-gray-500 mt-1.5">Contact support to change your email</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
            <textarea 
              name="Bio" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              value={formData.Bio || ""} 
              onChange={handleChange}
              rows="4"
              placeholder="Describe your professional background, skills, and experience..."
              maxLength="500"
            />
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-gray-500">Brief description of yourself (max 500 characters)</p>
              <p className="text-xs text-gray-500">
                {formData.Bio?.length || 0}/500
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-4">Personal Details</h4>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-gray-900 font-medium">{formData.name || "Not provided"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-gray-900 font-medium">{formData.phone || "Not provided"}</p>
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-gray-900 font-medium">{formData.email || "Not provided"}</p>
          </div>
          
          <div className="space-y-1 md:col-span-2 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Professional Bio</p>
            <p className="text-gray-600 whitespace-pre-line">
              {formData.Bio || "No bio provided yet. Add a professional bio to help others learn more about you."}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default BasicInfoSection;