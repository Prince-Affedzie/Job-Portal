import { FaSpinner, FaEdit, FaCheck } from "react-icons/fa";

const ProfileImageSection = ({
  previewImage,
  formData,
  isProcessing,
  handleProfileImageChange,
  saveImageChanges
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 self-start">Profile Photo</h2>
      
      {/* Profile Image Container - Centered with improved styling */}
      <div className="relative group mb-6">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-blue-50 to-gray-50 p-1 shadow-inner">
          <img
            src={previewImage || formData.profileImage || '/default-avatar.png'}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md transition-all duration-300 group-hover:opacity-90"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
              e.target.onerror = null;
            }}
          />
        </div>
        
        {/* Edit Button Overlay (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 rounded-full cursor-pointer">
          <input 
            type="file" 
            id="profile-image" 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfileImageChange} 
          />
          <label 
            htmlFor="profile-image" 
            className="flex flex-col items-center justify-center text-white"
          >
            <div className="bg-white rounded-full p-3 mb-1">
              <FaEdit className="text-blue-600 text-lg" />
            </div>
            <span className="text-sm font-medium">Update photo</span>
          </label>
        </div>
      </div>
      
      {/* Helper text */}
      <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
        Recommended: Square JPG, PNG or GIF, at least 400x400 pixels
      </p>
      
      {/* Action Buttons - Centered with improved styling */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <div className="w-full sm:w-auto">
          <input 
            type="file" 
            id="profile-image-mobile" 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfileImageChange} 
          />
          <label 
            htmlFor="profile-image-mobile" 
            className="flex items-center justify-center w-full px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            <FaEdit className="mr-2" />
            Change Photo
          </label>
        </div>
        
        {previewImage && (
          <button 
            type="button"
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={saveImageChanges}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProfileImageSection;