import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const BasicInfoSection = ({
  editSection,
  formData,
  setEditSection,
  handleChange,
  saveChanges
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Basic Info</h3>
      {editSection !== "basic" ? (
        <button 
              onClick={() => setEditSection("basic")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
        <FaEdit 
          onClick={() => setEditSection("basic")} 
         className="mr-2"
        />
        Edit
        </button>
      ) : (
        <div className="flex space-x-2">
         <button
                onClick={saveChanges}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <FaSave className="mr-2" />
                Save
              </button>
         <button
                onClick={() => setEditSection(null)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
        </div>
      )}
    </div>

    <div className="p-6">
      {editSection === "basic" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              name="name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.name || ""} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" 
              value={formData.email || ""} 
              disabled 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input 
              type="tel" 
              name="phone" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.phone || ""} 
              onChange={handleChange}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="Format: 123-456-7890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea 
              name="Bio" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.Bio || ""} 
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.Bio?.length || 0}/500 characters
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-600">{formData.name || "Not provided"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-600">{formData.email || "Not provided"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-600">{formData.phone || "Not provided"}</span>
          </div>
          <div className="pt-2">
            <span className="font-medium text-gray-700 block mb-1">Bio:</span>
            <p className="text-gray-600 whitespace-pre-line">
              {formData.Bio || "No bio provided"}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default BasicInfoSection;