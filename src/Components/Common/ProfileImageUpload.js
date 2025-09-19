import { useState } from "react";
import "../Styles/ProfileImageUpload.css"; // Create this CSS file for styling

const ProfileImageUpload = ({ image, onImageUpload }) => {
  const [preview, setPreview] = useState(image || "");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(reader.result); // Pass the image URL to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-image-upload">
      <label htmlFor="imageUpload" className="image-upload-label">
        <div className="image-preview">
          {preview ? <img src={preview} alt="Profile" /> : <p>Click to Upload</p>}
        </div>
      </label>
      <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} hidden />
    </div>
  );
};

export default ProfileImageUpload;
