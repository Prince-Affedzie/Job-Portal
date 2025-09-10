import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const SkillsSection = ({
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
        <h3 className="text-xl font-semibold text-gray-800">Skills & Expertise</h3>
        <p className="text-sm text-gray-500 mt-1">Showcase your professional capabilities</p>
      </div>
      {editSection !== "skills" ? (
        <button 
          onClick={() => setEditSection("skills")}
          className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="mr-2" />
          Manage Skills
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
      {editSection === "skills" ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Your Current Skills</h4>
            <div className="flex flex-wrap gap-3">
              {formData.skills?.length > 0 ? (
                formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full group hover:bg-blue-100 transition-colors">
                    <span className="text-sm font-medium">{skill}</span>
                    <button 
                      type="button"
                      className="ml-2 text-blue-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                      onClick={() => handleConfirmDelete("skills", index)}
                      aria-label={`Remove ${skill}`}
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-6 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <FaPlus className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No skills added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add your first skill to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button 
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            onClick={() => {
              setModalType("skills");
              setModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" />
            Add New Skill
          </button>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Add relevant skills that match your expertise. This helps clients and employers find you more easily.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {formData.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {formData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaPlus className="text-gray-400 text-xl" />
              </div>
              <p className="text-gray-500">No skills added yet</p>
              <p className="text-sm text-gray-400 mt-1">Add skills to showcase your expertise</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default SkillsSection;