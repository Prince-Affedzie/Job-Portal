import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const LocationSection = ({
  editSection,
  formData,
  setEditSection,
  handleLocationChange,
  saveChanges
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Location</h3>
      {editSection !== "location" ? (
       <button 
              onClick={() => setEditSection("location")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
        <FaEdit 
        onClick={() => setEditSection("location")} 
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
      {editSection === "location" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location?.region || ""}
              onChange={(e) => handleLocationChange("region", e.target.value)}
              placeholder="Region"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location?.city || ""}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location?.street || ""}
              onChange={(e) => handleLocationChange("street", e.target.value)}
              placeholder="Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.location?.town || ""}
              onChange={(e) => handleLocationChange("town", e.target.value)}
              placeholder="Town"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Region:</span>
            <span className="text-gray-600">{formData.location?.region || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">City:</span>
            <span className="text-gray-600">{formData.location?.city || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Street:</span>
            <span className="text-gray-600">{formData.location?.street || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Town:</span>
            <span className="text-gray-600">{formData.location?.town || "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default LocationSection;