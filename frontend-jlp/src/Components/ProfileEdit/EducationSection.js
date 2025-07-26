import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const EducationSection = ({
  editSection,
  formData,
  setEditSection,
  setModalType,
  setModalOpen,
  handleConfirmDelete,
  saveChanges
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Education</h3>
      {editSection !== "education" ? (
        <button 
              onClick={() => setEditSection("education")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
        <FaEdit 
          onClick={() => setEditSection("education")} 
         className="mr-2"
        />
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

    <div className="p-6">
      {editSection === "education" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {formData.education?.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{edu.certification}</p>
                    <p className="text-sm text-gray-600">{edu.institution} ({new Date(edu.yearOfCompletion).toDateString()})</p>
                  </div>
                  <button 
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleConfirmDelete("education", index)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education added yet.</p>
            )}
          </div>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => {
              setModalType("education");
              setModalOpen(true);
            }}
          >
            + Add Education
          </button>
        </div>
      ) : (
        <div>
          {formData.education?.length > 0 ? (
            <div className="space-y-3">
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800">{edu.certification}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{new Date(edu.startedOn).toDateString()}-{new Date(edu.yearOfCompletion).toDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education history available.</p>
          )}
        </div>
      )}
    </div>
  </div>
);

export default EducationSection;