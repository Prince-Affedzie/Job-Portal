import { CheckCircle, XCircle, Shield, Clock, User } from "lucide-react";

const StatusBadge = ({ status, label, variant = "default" }) => {
  const variants = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-red-100 text-red-800",
    verified: "bg-blue-100 text-blue-800",
    pending: "bg-amber-100 text-amber-800",
    default: "bg-gray-100 text-gray-800"
  };

  const icons = {
    active: CheckCircle,
    inactive: XCircle,
    verified: Shield,
    pending: Clock,
    default: User
  };

  const Icon = icons[variant] || icons.default;
  const className = `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`;

  return (
    <span className={className}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default StatusBadge;