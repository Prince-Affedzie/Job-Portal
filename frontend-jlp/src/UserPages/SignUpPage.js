import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signUp } from "../APIS/API";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../Context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await signUp(formData);
      if (response.status === 200) {
        toast.success("You signed up successfully!");
        const { role } = response.data;

        if (role === "employer") {
          login(role);
          navigate("/employer/onboarding");
        } else {
          navigate("/complete_profile", { state: { role } });
        }
      } else {
        toast.error(response.message || "Oops! Couldn't Sign Up");
      }
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        const errors = {};
        responseData.errors.forEach((err) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
      }

      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen bg-gray-100 px-4">
      <ToastContainer />
      {/* Info Box for Role Explanation */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 lg:mb-0 lg:mr-8 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">Not sure which role to pick?</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          <strong>Job Seekers</strong> can also post quick gigs or tasks they need help with.
          <br />
          <span className="ml-4">E.g. "Looking for a graphic designer to make a logo today".</span>
          <br />
          Choose <strong>"I want to employ Talents"</strong> only if you're hiring for professional or company-level roles.
        </p>
      </div>

      {/* Signup Form */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* Password Field */}
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-blue-50 text-blue-800 text-sm p-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-blue-200">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Minimum 6 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*)</li>
              </ul>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Role Field */}
          <div className="flex flex-col">
           
            <label htmlFor="role" className="mb-1 font-medium">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded"
               required
            >
              <option value="" disabled>
                -- Choose your role --
              </option>
              <option value="job_seeker">I'm Looking For Job</option>
              <option value="employer">I want to employ Talents</option>
            </select>
            {fieldErrors.role && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.role}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
