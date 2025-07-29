import { motion } from "framer-motion";
import { 
  FaUserCircle, 
  FaClipboardList, 
  FaBriefcase, 
  FaTasks,
  FaRegCalendarCheck 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const UserGuide = ({ 
  showGuide, 
  setShowGuide, 
  profileCompletion, 
  topTask 
}) => {
  const navigate = useNavigate();

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-20 pointer-events-auto"
        onClick={() => setShowGuide(false)}
      ></div>
      
      {/* Guide Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-80 bg-white shadow-lg pointer-events-auto flex flex-col max-h-[85vh] mt-20 mr-4 rounded-lg border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Welcome to WorkaFlow!</h2>
          <button
            onClick={() => setShowGuide(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            aria-label="Close guide"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                  1
                </div>
                <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 mb-1">Complete your profile</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Add your skills and experience to help employers find you.
                </p>
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                  {topTask ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs">
                        {topTask.id === 1 && <FaUserCircle />}
                        {topTask.id === 2 && <FaClipboardList />}
                        {topTask.id === 3 && <FaUserCircle />}
                        {topTask.id === 4 && <FaBriefcase />}
                        {topTask.id === 5 && <FaUserCircle />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800">{topTask.title}</p>
                        <button
                          onClick={() => {
                            navigate(topTask.link);
                            setShowGuide(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Complete now →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-green-600">Your profile is complete!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                  2
                </div>
                <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 mb-1">Find your first job</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Browse listings to find opportunities that match your skills.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigate('/job/listings');
                      setShowGuide(false);
                    }}
                    className="flex items-center gap-1 p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                  >
                    <FaBriefcase className="text-blue-500 text-xs" />
                    <span className="text-xs font-medium">Regular Jobs</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/mini_task/listings');
                      setShowGuide(false);
                    }}
                    className="flex items-center gap-1 p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                  >
                    <FaTasks className="text-purple-500 text-xs" />
                    <span className="text-xs font-medium">Micro Jobs</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 mb-1">Track your applications</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Monitor applications and get notified when employers respond.
                </p>
                <button
                  onClick={() => {
                    navigate('/view/applied/jobs');
                    setShowGuide(false);
                  }}
                  className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors w-full"
                >
                  <FaRegCalendarCheck className="text-green-500 text-xs" />
                  <span className="text-xs font-medium">View Applications</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={() => {
              navigate('/user/modify/profile');
              setShowGuide(false);
            }}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors"
          >
            Complete My Profile ({profileCompletion}%)
          </button>
        </div>
      </motion.div>
    </div>
  );
};