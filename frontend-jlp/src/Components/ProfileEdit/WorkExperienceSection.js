import { FaEdit, FaSave, FaTimes, FaSpinner, FaPlus, FaBriefcase, FaTrash } from "react-icons/fa";

const WorkExperienceSection = ({
  editSection,
  formData,
  setEditSection,
  setModalType,
  setModalOpen,
  handleConfirmDelete,
  saveChanges,
  isProcessing
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-5">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
        <p className="text-sm text-gray-500 mt-1">Your professional journey and accomplishments</p>
      </div>
      {editSection !== "experience" ? (
        <button 
          onClick={() => setEditSection("experience")}
          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Manage Experience
        </button>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={saveChanges}
            disabled={isProcessing}
            className="inline-flex items-center px-3 py-2.0 md:px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
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
      {editSection === "experience" ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {formData.workExperience?.length > 0 ? (
              formData.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 p-5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mt-1">
                        <FaBriefcase className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{work.jobTitle}</h4>
                        <p className="text-gray-700">{work.company}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(work.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {work.endDate ? new Date(work.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"}
                        </p>
                        {work.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                              {work.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors ml-4"
                      onClick={() => handleConfirmDelete("workExperience", index)}
                      aria-label="Delete work experience"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FaBriefcase className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">No work experience added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first professional experience</p>
              </div>
            )}
          </div>
          
          <button 
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            onClick={() => {
              setModalType("work");
              setModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" />
            Add Work Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.workExperience?.length > 0 ? (
            formData.workExperience.map((work, index) => (
              <div key={index} className="border border-gray-100 p-5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <FaBriefcase className="text-blue-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{work.jobTitle}</h4>
                    <p className="text-gray-700">{work.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(work.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {work.endDate ? new Date(work.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Present"}
                    </p>
                    {work.description && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {work.description.length > 150 ? (
                            <>
                              {work.description.slice(0, 150).trim()}...
                              <span className="text-blue-600 ml-1 cursor-pointer hover:underline">Read more</span>
                            </>
                          ) : (
                            work.description
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FaBriefcase className="mx-auto text-gray-300 text-4xl mb-3" />
              <p className="text-gray-500">No work experience available</p>
              <p className="text-sm text-gray-400 mt-1">Add your professional experience to showcase your career journey</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default WorkExperienceSection;