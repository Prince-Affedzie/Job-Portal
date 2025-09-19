import { FaEdit, FaSave, FaTimes, FaPlus, FaGraduationCap } from "react-icons/fa";

const EducationSection = ({
  editSection,
  formData,
  setEditSection,
  setModalType,
  setModalOpen,
  handleConfirmDelete,
  saveChanges
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
        <p className="text-sm text-gray-500 mt-1">Your academic qualifications</p>
      </div>
      {editSection !== "education" ? (
        <button 
          onClick={() => setEditSection("education")}
          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Manage Education
        </button>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={saveChanges}
            className="inline-flex items-center px-3 py-2.0 md:px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaSave className="mr-2" />
            Save Changes
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
      {editSection === "education" ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {formData.education?.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mt-1">
                      <FaGraduationCap className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{edu.certification}</p>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(edu.startedOn).toLocaleDateString()} - {new Date(edu.yearOfCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    onClick={() => handleConfirmDelete("education", index)}
                    aria-label="Delete education"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FaGraduationCap className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">No education added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first qualification</p>
              </div>
            )}
          </div>
          <button 
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            onClick={() => {
              setModalType("education");
              setModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.education?.length > 0 ? (
            formData.education.map((edu, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <FaGraduationCap className="text-blue-600 text-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{edu.certification}</h4>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(edu.startedOn).toLocaleDateString()} - {new Date(edu.yearOfCompletion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FaGraduationCap className="mx-auto text-gray-300 text-4xl mb-3" />
              <p className="text-gray-500">No education history available</p>
              <p className="text-sm text-gray-400 mt-1">Add your education to showcase your qualifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default EducationSection;