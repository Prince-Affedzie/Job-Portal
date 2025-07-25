import { FaSpinner,FaEdit } from "react-icons/fa";

const ProfileImageSection = ({
  previewImage,
  formData,
  isProcessing,
  handleProfileImageChange,
  saveImageChanges
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <div className="flex items-center space-x-6">
      <img
        src={previewImage || formData.profileImage || '/default-avatar.png'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
        onError={(e) => {
          e.target.src = '/default-avatar.png';
          e.target.onerror = null;
        }}
      />
      <div className="flex-1">
        <input 
          type="file" 
          id="profile-image" 
          className="hidden" 
          accept="image/*" 
          onChange={handleProfileImageChange} 
        />
        <label 
          htmlFor="profile-image" 
           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"        >
            <FaEdit className="mr-2" />
            Edit   
        </label>
        {previewImage && (
          <button 
            type="button"
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            onClick={saveImageChanges}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <FaSpinner className="animate-spin inline mr-2" />
            ) : null}
            Save Profile Picture
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProfileImageSection;