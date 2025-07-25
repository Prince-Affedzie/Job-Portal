import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const SkillsSection = ({
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
      <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
      {editSection !== "skills" ? (
        <button 
              onClick={() => setEditSection("skills")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
        <FaEdit 
        onClick={() => setEditSection("skills")} 
         className="mr-2"
        />
        Edit
        </button>
      ) : (
        <div className="flex space-x-2">
          <FaSave 
            onClick={saveChanges} 
            className="text-green-600 hover:text-green-800 cursor-pointer text-lg"
          />
          <FaTimes 
            onClick={() => setEditSection(null)} 
            className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
          />
        </div>
      )}
    </div>

    <div className="p-6">
      {editSection === "skills" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills?.length > 0 ? (
              formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span className="text-sm">{skill}</span>
                  <button 
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() => handleConfirmDelete("skills", index)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => {
              setModalType("skills");
              setModalOpen(true);
            }}
          >
            + Add Skill
          </button>
        </div>
      ) : (
        <div>
          {formData.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>
      )}
    </div>
  </div>
);

export default SkillsSection;