import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../APIS/API";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import RequestStatusIndicator from "../../Components/Common/RequestStatusIndicator";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [statusMessage, setStatusMessage] = useState('');
  const { login } = useAuth();
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (status === 'loading') return;
    
    setStatus('loading');
    setStatusMessage('Logging you in...');
    
    try {
      const response = await loginUser(formData);
      
      if (response.status === 200) {
        setStatus('success');
        setStatusMessage('Login successful!');
        toast.success("Login Successful");
        const { role } = response.data;
        login(role);

       setTimeout(() => {
       
        if (role === "job_seeker" || role === "admin") {
          navigate("/mini_task/listings");
        } else if (role === "employer") {
          navigate('/employer/dashboard');
        } else {
          
          navigate('/client/microtask_dashboard');
        }
      }, 1000);
      } else {
        setStatus('error');
        setStatusMessage('Invalid email or password');
        toast.error("Invalid email or password");
      }
    } catch (error) {
      setStatus('error');
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error || 
        "An unexpected error occurred. Please try again.";
      
      setStatusMessage(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  const handleStatusReset = () => {
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className={`relative border rounded-lg transition-all duration-200 ${isFocused.email ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiMail className="h-5 w-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className="w-full pl-10 pr-4 py-3 bg-transparent outline-none rounded-lg"
                placeholder="Email address"
                required
                disabled={status === 'loading'}
                autoComplete="username"
              />
            </div>
            
            {/* Password Field */}
            <div className={`relative border rounded-lg transition-all duration-200 ${isFocused.password ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className="w-full pl-10 pr-10 py-3 bg-transparent outline-none rounded-lg"
                placeholder="Password"
                required
                disabled={status === 'loading'}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={status === 'loading'}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={status === 'loading'}
                id="rememberMe"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              status === 'loading' 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <FiUserPlus className="mr-2 h-4 w-4" />
              Create new account
            </Link>
          </div>
        </div>
        
        <RequestStatusIndicator 
          status={status}
          message={statusMessage}
          hideAfter={3000}
          onHide={handleStatusReset}
          variant="toast"
        />
      </div>
    </div>
  );
};

export default Login;