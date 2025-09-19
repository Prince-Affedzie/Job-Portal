import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signUp } from "../../APIS/API";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiUser, FiMail, FiLock, FiBriefcase, FiSearch, FiPlusSquare } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import RequestStatusIndicator from "../../Components/Common/RequestStatusIndicator";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    
    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    
    if (!/[0-9]/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return false;
    }
    
    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    if (!validateForm()) return;

    setStatus('loading');
    setStatusMessage('Creating your account...');
    
    try {
      const response = await signUp(formData);
      if (response.status === 200) {
        setStatus('success');
        setStatusMessage('Account created successfully!');
        toast.success("Welcome aboard!");
        const { role } = response.data;
        login(role);
        
        // Redirect based on role
        let redirectPath = "/complete_profile";
        if (role === "employer") {
          redirectPath = "/employer/onboarding";
        } else if (role === "client") {
          redirectPath = "/task_poster/onboarding";
        }
        
        setTimeout(() => {
          navigate(redirectPath, { state: { role } });
        }, 1500);
      }
    } catch (error) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 
        "An account with this email already exists. Please login instead.";
      setStatusMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Visual & Info */}
          <div className="md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Join Our Community</h1>
              <p className="opacity-90">Find your perfect opportunity or post micro tasks</p>
            </div>
            
            <div className="space-y-6">
              {/*<div className="flex items-start">
                <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                  <FiBriefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">For Employers</h3>
                  <p className="text-sm opacity-80 mt-1">
                    Find qualified candidates and build your dream team.
                  </p>
                </div>
              </div>*/}
              
              <div className="flex items-start">
                <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                  <FiSearch className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">For Job Seekers</h3>
                  <p className="text-sm opacity-80 mt-1">
                    Discover opportunities that match your skills and aspirations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                  <FiPlusSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">For Task Posters</h3>
                  <p className="text-sm opacity-80 mt-1">
                    Post micro tasks and find skilled professionals to complete them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
              <p className="text-gray-600 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <AiFillEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {passwordFocused && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                      Minimum 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                      At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>
                      At least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <AiFillEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am signing up as:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "job_seeker" }))}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.role === "job_seeker"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <FiSearch className="h-5 w-5 mx-auto mb-2" />
                    <span className="text-sm">Job Seeker</span>
                  </button>
                 {/* <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "employer" }))}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.role === "employer"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <FiBriefcase className="h-5 w-5 mx-auto mb-2" />
                    <span className="text-sm">Employer</span>
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "client" }))}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.role === "client"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <FiPlusSquare className="h-5 w-5 mx-auto mb-2" />
                    <span className="text-sm">Task Poster</span>
                  </button>
                </div>
              </div>

              {/* Role Descriptions */}
              {formData.role && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  {formData.role === "job_seeker" && (
                    <p>Perfect for individuals looking for job opportunities and full-time positions.</p>
                  )}
                  {formData.role === "employer" && (
                    <p>Ideal for companies and recruiters looking to hire full-time employees.</p>
                  )}
                  {formData.role === "client" && (
                    <p>Great for posting micro tasks and finding skilled professionals for short-term projects.</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  status === 'loading'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <RequestStatusIndicator 
        status={status}
        message={statusMessage}
        hideAfter={3000}
        onHide={() => setStatus('idle')}
        variant="toast"
      />
    </div>
  );
};

export default Signup;