import { FaEdit, FaSave, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

const LocationSection = ({
  editSection,
  formData,
  setEditSection,
  handleLocationChange,
  saveChanges
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Location Details</h3>
        <p className="text-sm text-gray-500 mt-1">Your primary location information</p>
      </div>
      {editSection !== "location" ? (
        <button 
          onClick={() => setEditSection("location")}
          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Edit Location
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
      {editSection === "location" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-gray-800 mb-4">Address Information</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.location?.street || ""}
              onChange={(e) => handleLocationChange("street", e.target.value)}
              placeholder="Enter street address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Town/City</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.location?.town || ""}
              onChange={(e) => handleLocationChange("town", e.target.value)}
              placeholder="Enter town or city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.location?.city || ""}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region/State</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.location?.region || ""}
              onChange={(e) => handleLocationChange("region", e.target.value)}
              placeholder="Enter region or state"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 mb-3">Your Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Street Address</p>
                <p className="text-gray-900">{formData.location?.street || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Town</p>
                <p className="text-gray-900">{formData.location?.town || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">City</p>
                <p className="text-gray-900">{formData.location?.city || "Not specified"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Region</p>
                <p className="text-gray-900">{formData.location?.region || "Not specified"}</p>
              </div>
            </div>
            
            {(!formData.location?.street && !formData.location?.town && 
              !formData.location?.city && !formData.location?.region) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 text-center">
                  Location information not provided. Add your location to help clients find you.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default LocationSection;