import {useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { userContext } from "../../Context/FetchUser";


const PostEligibilityGate = ({children,fallbackMessage }) => {
  const navigate = useNavigate();
  const { user, fetchUserInfo, fetchRecentApplications, recentApplications, minitasks } = useContext(userContext);

  const isEligible =
    user &&
    user.isVerified &&
    user.miniTaskEligible;

  if (!user) return null; // or redirect to login

  if (isEligible) {
    return <>{children}</>; // show the form/page
  }

  // Show fallback message
  return (
    <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm max-w-xl mx-auto mt-10 text-center space-y-4">
      <div className="text-yellow-600 text-lg font-medium flex items-center justify-center gap-2">
        <InfoCircleOutlined className="text-xl" />
        {"Only verified job seekers can post mini-tasks. Your Account Will be Verified Soon if you uploaded the right Credentials, If not Contact Our Support Team."}
      </div>
      { !isEligible && (
          <button
            onClick={() => navigate("/h1/dashboard")}
            className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        )}
    </div>
  );
};

export default PostEligibilityGate;
