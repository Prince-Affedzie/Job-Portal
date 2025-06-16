import { useState, useEffect } from 'react';
import { Search, Briefcase, Users, MessageSquare, CheckCircle, ArrowRight, Menu, X, Calendar, Clock, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Components/MyComponents/Navbar.css'

export default function WorkaflowLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate()
  
  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock function since we don't have real navigation
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Header/Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600/95 backdrop-blur-md shadow-md py-2 text-white' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className={`${scrolled ? 'text-white' : 'bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent'}`}>Worka</span>
                <span className={`${scrolled ? 'text-blue-200' : 'text-blue-800'}`}>Flow</span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="custom-nav">
              <a href="#features" className={`${scrolled ? 'text-blue-100 hover:text-white' : 'text-blue-700 hover:text-blue-900'} font-medium transition-colors relative group`}>
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className={`${scrolled ? 'text-blue-100 hover:text-white' : 'text-blue-700 hover:text-blue-900'} font-medium transition-colors relative group`}>
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className={`${scrolled ? 'text-blue-100 hover:text-white' : 'text-blue-700 hover:text-blue-900'} font-medium transition-colors relative group`}>
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
              </a>
              
              <button onClick={() => navigate('/login')} className={`px-4 py-2 ${scrolled ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50'} rounded-lg transition-all duration-300`}>
                Sign In
              </button>
              <button onClick={() => navigate('/signup')} className={`px-4 py-2 ${scrolled ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg`}>
                Get Started
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${scrolled ? 'text-white hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'} focus:outline-none`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-600/95 backdrop-blur-md border-t border-blue-500 py-2 shadow-lg animate-fadeIn">
            <div className="container mx-auto px-4 flex flex-col space-y-3 py-3">
              <a href="#features" className="text-blue-100 hover:text-white py-2 font-medium">Features</a>
              <a href="#how-it-works" className="text-blue-100 hover:text-white py-2 font-medium">How It Works</a>
              <a href="#testimonials" className="text-blue-100 hover:text-white py-2 font-medium">Testimonials</a>
              
              <div className="flex flex-col space-y-2 pt-2">
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 w-full">
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:opacity-90 w-full shadow-md">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 md:min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
  {/* Soft Background Accent (reduced from 3 to 1) */}
  <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-300/30 rounded-full blur-[120px] animate-blob opacity-40 z-0"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
          The Future of <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Work</span> Is Here
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 lg:pr-12">
          Discover endless opportunities. Freelance, full-time, or fast gigs — WorkaFlow connects talent and businesses effortlessly.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:shadow-lg text-lg transition-all duration-300 transform hover:-translate-y-1">
            Find Opportunities
          </button>
          <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-white text-blue-700 rounded-xl border border-blue-300 hover:bg-blue-50 transition-all duration-300 text-lg transform hover:-translate-y-1">
            Post Work
          </button>
        </div>
        <p className="mt-8 text-blue-700">
          Join <span className="inline-flex items-center mx-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">10,000+</span> professionals on WorkaFlow
        </p>
      </div>

      <div className="lg:w-1/2 mt-12 lg:mt-0">
        <div className="relative p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-100">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Next Opportunity Awaits</h3>
              <p className="text-blue-600 mt-2">Start your journey with WorkaFlow today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Who We Serve Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who We Serve</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto my-6 rounded-full"></div>
            <p className="mt-4 text-xl text-white-800 max-w-3xl mx-auto">
              WorkaFlow brings together talent and organizations of all sizes on one powerful platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 relative">
            {/* Connection element between cards */}
            <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-xl z-10 border-4 border-white">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white">
                <ArrowRight size={24} className="rotate-90 md:rotate-0" />
              </div>
            </div>
            
            {/* Talent Side */}
            <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-transform hover:-translate-y-2 duration-300 border border-blue-100 relative overflow-hidden group hover:shadow-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Talent</h3>
                <p className="text-white-700 mb-6">
                  Whether you're seeking full-time employment, short-term gigs, freelance projects, or micro-tasks to fit your schedule, WorkaFlow connects you with opportunities that match your skills and preferences.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Access full-time, part-time, and contract roles</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Find freelance projects that match your expertise</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Pick up quick tasks that fit your schedule</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Build your portfolio and client network</span>
                  </li>
                </ul>
                <button onClick={()=>navigate('/signup')} className="flex items-center text-blue-600 font-medium group">
                  <span>Find Work</span>
                  <ChevronRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Employer Side */}
            <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-transform hover:-translate-y-2 duration-300 border border-blue-100 relative overflow-hidden group hover:shadow-blue-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Businesses</h3>
                <p className="text-white-700 mb-6">
                  From startups to enterprises, WorkaFlow helps you find the right talent for any need – whether building a permanent team, bringing on specialized freelancers, or getting quick tasks done efficiently.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Post full-time positions to build your core team</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Hire freelancers for specialized projects</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Outsource small tasks for quick completion</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <span className="text-white-800">Scale your workforce up or down as needed</span>
                  </li>
                </ul>
                <button onClick={()=>navigate('/signup')} className="flex items-center text-blue-600 font-medium group">
                  <span>Post Opportunities</span>
                  <ChevronRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white inline-block">A Complete Work Ecosystem</h2>
            <div className="w-24 h-1 bg-blue-300 mx-auto my-6 rounded-full"></div>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              WorkaFlow provides powerful tools to connect talent with opportunities
              of all sizes, from quick tasks to career positions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-xl duration-300 border border-blue-200 group hover:border-blue-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Flexible Work Options</h3>
              <p className="text-white-700">
                Find full-time positions, short-term gigs, freelance projects, or mini-tasks that fit your schedule and goals.
              </p>
              <div className="mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-300"></div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-xl duration-300 border border-blue-200 group hover:border-blue-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Global Network</h3>
              <p className="text-white-700">
                Connect with talent and businesses around the world, opening up unlimited possibilities.
              </p>
              <div className="mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"></div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-xl duration-300 border border-blue-200 group hover:border-blue-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Seamless Communication</h3>
              <p className="text-white-700">
                Built-in tools for proposals, interviews, and collaboration keep projects flowing smoothly.
              </p>
              <div className="mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-200 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl fonttext-gray-900">How WorkaFlow Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto my-6 rounded-full"></div>
            <p className="mt-4 text-xl text-white-800 max-w-3xl mx-auto">
              Simple, intuitive, and powerful — for both talent and businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 mt-12">
            {/* For Talent */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Talent</h3>
              <div className="space-y-12">
                <div className="flex relative">
                  <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-600 to-blue-300 z-0"></div>
                  <div className="mr-4 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">1</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Create Your Profile</h4>
                    <p className="text-white-700">
                      Showcase your skills, experience, and work preferences, whether you're looking for full-time roles, freelance work, or quick tasks.
                    </p>
                  </div>
                </div>
                
                <div className="flex relative">
                  <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200 z-0"></div>
                  <div className="mr-4 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white flex items-center justify-center font-bold text-xl shadow-md">2</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Discover Opportunities</h4>
                    <p className="text-white-700">
                      Browse personalized recommendations or search for specific positions, projects, or tasks that match your skills and schedule.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 text-white flex items-center justify-center font-bold text-xl shadow-md">3</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Apply & Connect</h4>
                    <p className="text-white-700">
                      Submit proposals, connect with employers, and start building your professional network and income stream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* For Businesses */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Businesses</h3>
              <div className="space-y-12">
                <div className="flex relative">
                <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200 z-0"></div>
                <div className="mr-4 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">1</div>
                </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Post Your Needs</h4>
                    <p className="text-gray-600">
                      Create detailed listings for full-time positions, freelance projects, short-term gigs, or micro-tasks.
                    </p>
                  </div>
                </div>
                
                <div className="flex relative">
                <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200 z-0"></div>
                <div className="mr-4 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">2</div>
                </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Review Candidates</h4>
                    <p className="text-gray-600">
                      Browse profiles, portfolios, and proposals from qualified candidates matched to your specific requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                <div className="mr-4 flex-shrink-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">3</div>
                </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-1 transform transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100 duration-300 border border-blue-50">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Hire & Collaborate</h4>
                    <p className="text-gray-600">
                      Connect with talent and manage projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <button onClick={()=>navigate('/signup')} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Success Stories</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from talent and businesses who've found their perfect match on Workaflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 - Freelancer */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Freelance Developer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Workaflow gives me the flexibility to balance long-term contracts with quick gigs when I have extra time. I've built relationships with amazing clients and tripled my income!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            {/* Testimonial 2 - Full-time Employee */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Michael Chang</h4>
                  <p className="text-gray-600 text-sm">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700">
                "After completing several short-term projects through Workaflow, one of my clients offered me my dream full-time position. The platform's versatility helped me prove my value first."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            {/* Testimonial 3 - Business */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">Emily Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a growing startup, we use Workaflow for everything from hiring our core team to finding specialized freelancers and quick task workers. It's become our complete HR solution."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Join the Future of Work</h2>
              <p className="text-lg text-blue-100 mb-8">
                Whether you're looking for talent or opportunity, Workaflow connects you to possibilities that fit your unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={()=>navigate('/signup')} className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium">
                  Create Free Account
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                  Learn More
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Worka<span className="text-blue-400">Flow</span></h3>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity in the modern job market.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Create Resume</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Job Alerts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post a Job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Candidates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Recruiting Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Workaflow. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



