import { FaSpinner, FaEdit } from "react-icons/fa";

const ProfileImageSection = ({
  previewImage,
  formData,
  isProcessing,
  handleProfileImageChange,
  saveImageChanges
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <div className="flex flex-col items-center">
      {/* Profile Image Container - Centered */}
      <div className="relative group mb-4">
        <img
          src={previewImage || formData.profileImage || '/default-avatar.png'}
          alt="Profile"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-gray-200 shadow-sm transition-all duration-200 group-hover:opacity-90"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
            e.target.onerror = null;
          }}
        />
        
        {/* Edit Button Overlay (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30 rounded-full">
          <input 
            type="file" 
            id="profile-image" 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfileImageChange} 
          />
          <label 
            htmlFor="profile-image" 
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <FaEdit className="mr-2" />
            Change Photo
          </label>
        </div>
      </div>
      
      {/* Action Buttons - Centered */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div>
          <input 
            type="file" 
            id="profile-image-mobile" 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfileImageChange} 
          />
          <label 
            htmlFor="profile-image-mobile" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaEdit className="mr-2" />
            Edit Photo
          </label>
        </div>
        
        {previewImage && (
          <button 
            type="button"
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={saveImageChanges}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <FaSpinner className="animate-spin inline mr-2" />
            ) : null}
            Save Changes
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProfileImageSection;