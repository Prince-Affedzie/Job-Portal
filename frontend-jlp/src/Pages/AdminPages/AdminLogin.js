import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLogin } from "../../APIS/API";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import RequestStatusIndicator from "../../Components/Common/RequestStatusIndicator";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); 
  const [statusMessage, setStatusMessage] = useState('');
  const {login} = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions while loading
    if (status === 'loading') return;
    
    // Set loading state
    setStatus('loading');
    setStatusMessage('Logging you in...');
    
    try {

      const response = await adminLogin(formData);
      
      if (response.status === 200) {
       
        setStatus('success');
        setStatusMessage('Login successful!');
        
        toast.success("Login Successful");
        const {role} = response.data;
        login(role)

        
        // Navigate after a slight delay to allow users to see the success state
        setTimeout(() => {
          if(role === "admin"){
            navigate("/admin/dashboard");
          } else {
            navigate('/login');
          }
        }, 1000);
      } else {
        // Set error state
        setStatus('error');
        setStatusMessage('Invalid email or password');
        toast.error("Invalid email or password");
      }
    } catch (error) {
      // Set error state
      setStatus('error');
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error || 
        "An unexpected error occurred. Please try again.";
      
      setStatusMessage(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  // Reset status handler
  const handleStatusReset = () => {
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label className="block font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded pr-10"
                required
                disabled={status === 'loading'}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={status === 'loading'}
              >
                {showPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
              disabled={status === 'loading'}
            />
            <label>Remember Me</label>
          </div>
          <button 
            type="submit" 
            className={`w-full ${
              status === 'loading' 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white p-2 rounded flex justify-center items-center`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500">Register</a>
        </p>
        
        {/* Add the RequestStatusIndicator component */}
        <RequestStatusIndicator 
          status={status}
          message={statusMessage}
          hideAfter={3000}
          onHide={handleStatusReset}
          variant="toast" // You can change to "overlay" or "inline" based on preference
        />
      </div>
    </div>
  );
};

export default AdminLogin;