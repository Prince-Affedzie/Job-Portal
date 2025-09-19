import { FaEdit, FaSave, FaTimes, FaPlus, FaLink, FaTrash } from "react-icons/fa";
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
    <div className="bg-white rounded-xl mt-5 shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Portfolio</h3>
          <p className="text-sm text-gray-500 mt-1">Showcase your best work and projects</p>
        </div>
        
        {editSection !== "portfolio" ? (
          <button 
            onClick={() => setEditSection("portfolio")}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaEdit className="mr-2" />
            Manage Portfolio
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={saveChanges}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
            <button
              onClick={() => setEditSection(null)}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {formData.workPortfolio?.length > 0 ? (
          <div className="space-y-6">
            {editSection === "portfolio" && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {formData.workPortfolio.length} item{formData.workPortfolio.length !== 1 ? 's' : ''} in your portfolio
                </p>
                <button 
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    setModalType("portfolio");
                    setModalOpen(true);
                  }}
                >
                  <FaPlus className="mr-2" />
                  Add New Item
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.workPortfolio.map((portfolio, index) => (
                <div key={index} className="relative">
                  <PortfolioPreview
                    portfolio={portfolio}
                    isEditable={editSection === "portfolio"}
                    onRemove={() => handleDeletePortfolio(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLink className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your portfolio is empty</h3>
            <p className="text-gray-600 mb-2 max-w-md mx-auto">
              Showcase your best work to attract potential clients and employers
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Add projects, case studies, or links to your work
            </p>
            <button 
              onClick={() => {
                setModalType("portfolio");
                setModalOpen(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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