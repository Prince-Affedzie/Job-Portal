import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

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
  <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
      {editSection !== "experience" ? (
        <button 
          onClick={() => setEditSection("experience")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={saveChanges}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-75"
          >
            {isProcessing ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaSave className="mr-2" />
            )}
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
      {editSection === "experience" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {formData.workExperience?.length > 0 ? (
              formData.workExperience.map((work, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{work.jobTitle}</p>
                      <p className="text-sm text-gray-600">{work.company}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(work.startDate).toLocaleDateString()} - 
                        {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                      </p>
                      {work.description && (
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                          {work.description}
                        </p>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="text-red-600 hover:text-red-800 ml-4"
                      onClick={() => handleConfirmDelete("workExperience", index)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No work experience added yet.</p>
            )}
          </div>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => {
              setModalType("work");
              setModalOpen(true);
            }}
          >
            + Add Work Experience
          </button>
        </div>
      ) : (
        <div>
          {formData.workExperience?.length > 0 ? (
            <div className="space-y-4">
              {formData.workExperience.map((work, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">{work.jobTitle}</p>
                  <p className="text-sm text-gray-600">{work.company}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(work.startDate).toLocaleDateString()} - 
                    {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                  </p>
                 {
              work.description && (
         <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700">Role Description:</h4>
       <p className="text-sm text-gray-600 whitespace-pre-line">
         {work.description.length > 100 ? (
          <>
            {work.description.slice(0, 100).trim()}...
            
          </>
        ) : (
          work.description
        )}
      </p>
    </div>
  )
}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No work experience available.</p>
          )}
        </div>
      )}
    </div>
  </div>
);

export default WorkExperienceSection;