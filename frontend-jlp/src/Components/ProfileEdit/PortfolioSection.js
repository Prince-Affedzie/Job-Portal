import { FaEdit, FaSave, FaTimes, FaTrash, FaLink, FaFileUpload, FaPlus } from "react-icons/fa";
import { addPortfolio, sendFileToS3 } from '../../APIS/API';
import { useState } from 'react'
import { toast } from "react-toastify";
import PortfolioPreview from './PortfolioPreview';

const PortfolioSection = ({
  editSection,
  formData,
  setEditSection,
  setFormData,
  isProcessing,
  handleAddPortfolio, 
  saveChanges
}) => {
  const [portfolioData, setPortfolioData] = useState({
    title: '',
    description: '',
    files: [],
    link: ''
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPortfolioData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleRemoveFile = (index) => {
    setPortfolioData(prev => {
      const updatedFiles = [...prev.files];
      updatedFiles.splice(index, 1);
      return { ...prev, files: updatedFiles };
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Check if there's a new portfolio item to add
      const hasNewPortfolioData = portfolioData.title || portfolioData.files.length > 0 || portfolioData.link;
      
      if (hasNewPortfolioData) {
        // Validate the new portfolio item
        if (!validatePortfolio()) return;

        // Upload files and get URLs
        const uploadedFiles = await Promise.all(
          portfolioData.files.map(async (file) => {
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
          ...portfolioData,
          files: uploadedFiles
        };

        // Add to parent
        handleAddPortfolio(portfolioItem);
        toast.success('Portfolio item added!');
      } else {
        // No new item to add, just save existing changes (like deletions)
        toast.success('Portfolio updated successfully!');
      }
      
      // Reset and close
      resetForm();
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to save portfolio');
    }
  };

  const validatePortfolio = () => {
    if (!portfolioData.title && portfolioData.files.length === 0 && !portfolioData.link) {
      toast.error('Please add at least a title, files, or a link');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setPortfolioData({
      title: '',
      description: '',
      files: [],
      link: ''
    });
    setEditSection(null);
  };

  const handleCancel = () => {
    setPortfolioData({
      title: '',
      description: '',
      files: [],
      link: ''
    });
    setEditSection(null);
  };

  const handleDeletePortfolio = (index) => {
    // Show confirmation before deletion
    if (window.confirm('Are you sure you want to remove this portfolio item?')) {
      setFormData(prev => ({
        ...prev,
        workPortfolio: prev.workPortfolio.filter((_, i) => i !== index)
      }));
      toast.success('Portfolio item removed');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-10">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaLink className="text-blue-600 text-sm" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Portfolio</h3>
              <p className="text-sm text-gray-600">Showcase your work and projects</p>
            </div>
          </div>
          
          {editSection !== "portfolio" ? (
            <button 
              onClick={() => setEditSection("portfolio")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaEdit className="mr-2" />
              Edit Portfolio
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSave}
                disabled={isProcessing}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isProcessing 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                }`}
              >
                <FaSave className="mr-2" />
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {editSection === "portfolio" ? (
          <div className="space-y-8">
            {/* Existing Portfolio Items */}
            {formData.workPortfolio?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                    {formData.workPortfolio.length}
                  </span>
                  Current Portfolio Items
                </h4>
                <div className="grid gap-4">
                  {formData.workPortfolio.map((portfolio, index) => (
                    <PortfolioPreview
                      key={index}
                      portfolio={portfolio}
                      isEditable
                      onRemove={() => handleDeletePortfolio(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add New Portfolio Item */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaPlus className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Add New Portfolio Item</h4>
                  <p className="text-sm text-gray-600">Add a title, description, files, or links to showcase your work</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Project Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={portfolioData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your project title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={portfolioData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project, technologies used, your role, and key achievements"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    rows="4"
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Project Files
                  </label>
                  <p className="text-xs text-gray-600 mb-3">Upload images, PDFs, or documents (Max 10MB per file)</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <FaFileUpload className="text-blue-600 text-xl" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 mb-1">Click to upload files</span>
                        <span className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  
                  {/* Uploaded Files List */}
                  {portfolioData.files.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">
                        Uploaded Files ({portfolioData.files.length})
                      </h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {portfolioData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <FaFileUpload className="text-blue-600 text-xs" />
                              </div>
                              <span className="text-sm text-gray-900 truncate">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Link Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Project Link
                  </label>
                  <p className="text-xs text-gray-600 mb-3">Add a link to your live project, repository, or demo</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="link"
                      value={portfolioData.link}
                      onChange={handleInputChange}
                      placeholder="https://example.com/your-project"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div>
            {formData.workPortfolio?.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                      {formData.workPortfolio.length} {formData.workPortfolio.length === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>
                </div>
                <div className="grid gap-6">
                  {formData.workPortfolio.map((portfolio, index) => (
                    <PortfolioPreview 
                      key={index} 
                      portfolio={portfolio} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLink className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                <p className="text-gray-600 mb-6">Start building your portfolio by adding your projects, work samples, and achievements.</p>
                <button 
                  onClick={() => setEditSection("portfolio")}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaPlus className="mr-2" />
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;