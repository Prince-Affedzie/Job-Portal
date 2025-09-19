import {useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { userContext } from "../../Context/FetchUser";
import { useEmployerProfileContext } from "../../Context/EmployerProfileContext";



const EmployerPostEligibilityGate = ({children,fallbackMessage }) => {
  const navigate = useNavigate();
  const { user, fetchUserInfo, fetchRecentApplications, recentApplications, minitasks } = useContext(userContext);
  const {loading1,employerprofile,fetchEmloyerProfile} = useEmployerProfileContext()

  const isEligible =
    user && employerprofile &&
    user.isVerified &&
    employerprofile.isVerified;

  if (!user || !employerprofile) return null; // or redirect to login

  if (isEligible) {
    return <>{children}</>; // show the form/page
  }

  // Show fallback message
  return (
    <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm max-w-xl mx-auto mt-10 text-center space-y-4">
      <div className="text-yellow-600 text-lg font-medium flex items-center justify-center gap-2">
        <InfoCircleOutlined className="text-xl" />
        {
        "Only verified Employers can post Jobs. Your Account Will be Verified Soon if you uploaded the right Credentials And Documents, If not Contact Our Support Team."}
      </div>
      { !isEligible && (
          <button
            onClick={() => navigate("/employer/dashboard")}
            className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        )}
    </div>
  );
};

export default EmployerPostEligibilityGate ;
