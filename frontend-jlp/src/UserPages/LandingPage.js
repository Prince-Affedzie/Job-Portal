import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaSearch, 
  FaCheckCircle, 
  FaRegLightbulb, 
  FaUsers, 
  FaHandshake, 
  FaHeadset,
  FaBars,
  FaTimes,
  FaStar,
  FaShieldAlt,
  FaRocket,
  FaClock
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">WorkaFlow</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-300">Find Talent</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-300">Find Work</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-300">Why Us?</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-300">Enterprise</a>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4 items-center">
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 transition duration-300"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white pt-4 pb-6 px-6 mt-4 space-y-4">
            <a href="#" className="block text-gray-600 hover:text-indigo-600 py-2">Find Talent</a>
            <a href="#" className="block text-gray-600 hover:text-indigo-600 py-2">Find Work</a>
            <a href="#" className="block text-gray-600 hover:text-indigo-600 py-2">Why Us?</a>
            <a href="#" className="block text-gray-600 hover:text-indigo-600 py-2">Enterprise</a>
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
              <button 
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-indigo-600 text-center hover:bg-indigo-50 rounded"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-indigo-600 text-white text-center rounded"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              Find the <span className="text-indigo-600">Best Talent</span> for Your Job
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Connect with skilled professionals or land your next big gig on the platform trusted by top companies worldwide.
            </p>
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto md:mx-0">
              <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
                <FaSearch className="ml-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for jobs or freelancers..." 
                  className="w-full py-4 px-4 focus:outline-none text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 transition duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Hero Image */}
              <div className="bg-indigo-100 rounded-lg p-6 md:p-8">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center text-indigo-500">
                    <FaUsers size={64} />
                    <p className="mt-4 text-lg font-medium">Connect with top talent</p>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white shadow rounded-lg p-3">
                <div className="flex items-center text-indigo-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Verified Talent</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white shadow rounded-lg p-3">
                <div className="flex items-center text-green-600">
                  <FaRocket className="mr-2" />
                  <span className="font-medium">Fast Hiring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Trusted by Top Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">COMPANY A</span>
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">COMPANY B</span>
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">COMPANY C</span>
            </div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">COMPANY D</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRegLightbulb className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Sign Up</h3>
              <p className="text-gray-600">Create a profile as a freelancer or an employer in just a few minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Find Work or Talent</h3>
              <p className="text-gray-600">Browse job listings or search for skilled professionals using our advanced filters.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Get Hired & Paid</h3>
              <p className="text-gray-600">Apply, collaborate, and get paid securely through our protected payment system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Freelancers Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Top Freelancers</h2>
            <a href="#" className="text-indigo-600 flex items-center hover:text-indigo-800 transition duration-300">
              View all <FaArrowRight className="ml-2" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Alice Johnson", 
                skill: "Web Developer", 
                rating: 4.9, 
                image: "https://randomuser.me/api/portraits/women/44.jpg" 
              },
              { 
                name: "Mark Smith", 
                skill: "Graphic Designer", 
                rating: 4.8, 
                image: "https://randomuser.me/api/portraits/men/32.jpg" 
              },
              { 
                name: "Sophia Lee", 
                skill: "Content Writer", 
                rating: 4.7, 
                image: "https://randomuser.me/api/portraits/women/68.jpg" 
              }
            ].map((freelancer, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <FaUsers className="text-gray-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{freelancer.name}</h3>
                      <p className="text-indigo-600">{freelancer.skill}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(freelancer.rating) ? "text-yellow-500" : "text-gray-300"} />
                    ))}
                    <span className="ml-2 text-gray-600">{freelancer.rating}/5</span>
                  </div>
                  <button className="w-full py-2 mt-4 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Posting Statistics */}
      <section className="py-16 px-6 bg-indigo-700 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <FaUsers className="text-5xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">50,000+</h3>
              <p className="text-xl">Freelancers</p>
            </div>
            <div className="text-center">
              <FaHandshake className="text-5xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">30,000+</h3>
              <p className="text-xl">Jobs Posted</p>
            </div>
            <div className="text-center">
              <FaCheckCircle className="text-5xl mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-xl">Successful Hires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Why Choose JobConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-l-4 border-indigo-600 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <FaClock className="text-indigo-600 text-2xl mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Fast Hiring Process</h3>
              </div>
              <p className="text-gray-600">Post jobs and find talent quickly with AI-powered matching that works for your schedule.</p>
            </div>
            <div className="p-6 border-l-4 border-indigo-600 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-indigo-600 text-2xl mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Verified Professionals</h3>
              </div>
              <p className="text-gray-600">We screen freelancers to ensure quality and professionalism for all your projects.</p>
            </div>
            <div className="p-6 border-l-4 border-indigo-600 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <FaHandshake className="text-indigo-600 text-2xl mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Secure Payments</h3>
              </div>
              <p className="text-gray-600">Our escrow system guarantees fair and safe transactions every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Support */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Join Our Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:translate-y-[-10px]">
              <FaUsers className="text-indigo-600 text-4xl mb-6" />
              <h3 className="text-xl font-bold mb-4 text-gray-800">Freelancer Forums</h3>
              <p className="text-gray-600 mb-6">Engage with other freelancers and share experiences in our active community forums.</p>
              <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-300 flex items-center">
                Join Forum <FaArrowRight className="ml-2" />
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:translate-y-[-10px]">
              <FaHeadset className="text-indigo-600 text-4xl mb-6" />
              <h3 className="text-xl font-bold mb-4 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600 mb-6">Get help whenever you need it with our dedicated support team available around the clock.</p>
              <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-300 flex items-center">
                Contact Support <FaArrowRight className="ml-2" />
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:translate-y-[-10px]">
              <FaHandshake className="text-indigo-600 text-4xl mb-6" />
              <h3 className="text-xl font-bold mb-4 text-gray-800">Mentorship Program</h3>
              <p className="text-gray-600 mb-6">Learn from experienced professionals in your field with our structured mentorship program.</p>
              <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-300 flex items-center">
                Find a Mentor <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-6 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center text-yellow-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6">"JobConnect helped me land my first big client! The platform was easy to use and the team was incredibly supportive throughout the process. It's been an amazing experience."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-indigo-600">SK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Sarah K.</h4>
                  <p className="text-gray-600">Graphic Designer</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center text-yellow-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6">"Hiring top talent has never been easier. I found the perfect team for my project within days. The quality of freelancers on JobConnect is unmatched."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-indigo-600">MJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Michael J.</h4>
                  <p className="text-gray-600">Project Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-12 opacity-90">Sign up now and connect with top freelancers and employers from around the world.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white text-indigo-600 text-lg font-bold rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Sign Up For Free
            </button>
            <button className="px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">JobConnect</h3>
              <p className="mb-4">Connecting talent with opportunities worldwide</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">For Talent</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-300">Find Work</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Create Profile</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">For Clients</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-300">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Blog</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition duration-300">Terms</a>
              <a href="#" className="hover:text-white transition duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;