import { FaEdit, FaSave, FaTimes, FaPlus, FaLink } from "react-icons/fa";
import PortfolioPreview from './PortfolioPreview';

const PortfolioSection = ({
  editSection,
  formData,
  setEditSection,
  saveChanges,
  handleRemovePortfolio,
  setModalOpen,
  setModalType
}) => {
  const handleDeletePortfolio = (index) => {
    if (window.confirm('Are you sure you want to remove this portfolio item?')) {
      const updatedPortfolio = formData.workPortfolio.filter((_, i) => i !== index);
      handleRemovePortfolio(updatedPortfolio);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-10">
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
      </div>

      <div className="p-6">
        {formData.workPortfolio?.length > 0 ? (
          <div className="space-y-4">
            {editSection === "portfolio" && (
              <button 
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-4"
                onClick={() => {
                  setModalType("portfolio");
                  setModalOpen(true);
                }}
              >
                + Add Portfolio Item
              </button>
            )}
            
            <div className="grid gap-6">
              {formData.workPortfolio.map((portfolio, index) => (
                <PortfolioPreview
                  key={index}
                  portfolio={portfolio}
                  isEditable={editSection === "portfolio"}
                  onRemove={() => handleDeletePortfolio(index)}
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
            <p className="text-gray-600 mb-6">Start building your portfolio by adding your projects</p>
            <button 
              onClick={() => {
                setModalType("portfolio");
                setModalOpen(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;