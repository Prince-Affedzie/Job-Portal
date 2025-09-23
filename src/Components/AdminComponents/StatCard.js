import { Eye, Edit, Trash2, Search, User, Briefcase, Users, Plus, Filter, Download, MoreVertical, ArrowUpDown, Calendar, Mail, Phone, MapPin, Shield, Check, X, AlertCircle, TrendingUp, Activity, } from "lucide-react";


 const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/25",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/25",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/25"
  };

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                {trend && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
                    {trendValue}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
