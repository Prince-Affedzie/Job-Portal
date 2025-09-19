import { useState } from "react";
import { FaFileUpload, FaTimes, FaTrash } from "react-icons/fa";
import { addPortfolio, sendFileToS3 } from "../../APIS/API"; // Import your API functions
import { ToastContainer, toast } from "react-toastify";
const AddItemModal = ({ isOpen, type, onClose, onSave,handleAddPortfolio }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState(() => {
    // Initialize form data based on the type
    if (type === "skills") return { skill: "" };
    if (type === "education") return { 
      certification: "", 
      institution: "",
      startedOn:"" ,
      yearOfCompletion: "" 
    };
    if (type === "work") return { 
      jobTitle: "", 
      company: "", 
      startDate: "", 
      endDate: "", 
      description: "" 
    };
    if (type === "portfolio") return {
      title: "",
      description: "",
      files: [], // This will store File objects temporarily
      link: ""
    };
    return {};
  });

   const handleFileChange = (e) => {
     const files = Array.from(e.target.files || []); // Add fallback for empty case
  setFormData(prev => ({
    ...prev,
    files: [...(prev.files || []), ...files] // Safely spread previous files
  }));
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const updatedFiles = [...prev.files];
      updatedFiles.splice(index, 1);
      return { ...prev, files: updatedFiles };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async(e) => {
  e.preventDefault();
  
  // For skills, we just want the string value, not the object
   if (type === "portfolio") {
      if (!formData.title) {
        toast.error("Please add at least a title, files, or a link");
        return;
      }

      try {
        setIsProcessing(true);
        
        // Only upload files when submitting
        const uploadedFiles = await Promise.all(
          formData.files.map(async (file) => {
            const response = await addPortfolio({
              filename: file.name,
              contentType: file.type
            });
            const { fileUrl, publicUrl } = response.data;
            await sendFileToS3(fileUrl, file);
            return {
              publicUrl,
              name: file.name
            };
          })
        );

        // Create final portfolio item with uploaded files
        const portfolioItem = {
          title: formData.title,
          description: formData.description,
          files: uploadedFiles,
          link: formData.link
        };

        onSave(portfolioItem);
        onClose();
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to save portfolio");
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Handle other types (skills, education, work) as before
      if (type === "skills") {
        onSave(formData.skill);
      } else {
        onSave(formData);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {type === "skills" && "Add New Skill"}
          {type === "education" && "Add Education"}
          {type === "work" && "Add Work Experience"}
           {type === "portfolio" && "Add Portfolio"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Form */}
          {type === "skills" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
              <input
                type="text"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Education Form */}
          {type === "education" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Started On: </label>
                <input
                  type="date"
                  name="startedOn"
                  value={formData.startedOn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                <input
                  type="date"
                  name="yearOfCompletion"
                  value={formData.yearOfCompletion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        
                  required
                />
              </div>
            </div>
          )}

          {/* Work Experience Form */}
          {type === "work" && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Present (if current)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
          )}

          {type === "portfolio" && (
     <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 mt-5">
    {/* Title Input */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
    
    {/* Description Input - Reduced height */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"  // Reduced from 3 to 2
      />
    </div>

    {/* File Upload Section - Made more compact */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Files (PDF, Images)
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer text-sm">
          <FaFileUpload className="mr-2" />
          Select Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
        {formData.files && formData.files.length > 0 && (
          <span className="text-xs text-gray-500">
            {formData.files.length} file(s) selected
          </span>
        )}
      </div>
      
      {/* Uploaded Files List - Made scrollable */}
      {formData.files && formData.files.length > 0 && (
        <div className="mt-2 max-h-[120px] overflow-y-auto border border-gray-200 rounded-lg">
          {formData.files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
              <span className="text-sm truncate flex-1">{file.name}</span>
              <button
                type="button"
                className="text-red-600 hover:text-red-800 ml-2"
                onClick={() => handleRemoveFile(index)}
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Link Section */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Project Link (Optional)
      </label>
      <input
        type="url"
        name="link"
        value={formData.link}
        onChange={handleChange}
        placeholder="https://example.com"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  </div>
)}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;