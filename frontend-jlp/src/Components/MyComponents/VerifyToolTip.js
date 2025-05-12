import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const VerifyTooltip = ({ isVerified, message = "Your account is not verified yet. It might be verified soon by Admins. If not contact our support team. " }) => {
  if (isVerified) return null;

  return (
    <Tooltip title={message}>
      <div className="flex items-center text-yellow-600 text-sm bg-yellow-50 border border-yellow-300 px-3 py-2 rounded-lg gap-2 shadow-sm mt-5 mb-5">
        <InfoCircleOutlined className="text-yellow-500" />
        <span>{message}</span>
      </div>
    </Tooltip>
  );
};

export default VerifyTooltip;
