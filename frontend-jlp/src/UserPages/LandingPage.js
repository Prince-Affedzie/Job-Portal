import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, Users, MessageSquare, CheckCircle, 
  ArrowRight, Menu, X, Calendar, Clock, Globe, ChevronRight,
  Star, Award, Zap, Shield, Handshake, FileText, Mail, Linkedin, Twitter, Github
} from 'lucide-react';

export default function WorkaflowLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Modern Navigation */}
       <header className={`w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'}`}>
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-600">Worka</span>
            <span className="text-blue-400">Flow</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav style={{
             display: windowWidth >= 1024 ? 'flex' : 'none',
            }} className="items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
          <a href="#solutions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Solutions</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Testimonials</a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</a>
          
          <div className="flex items-center space-x-4 ml-6">
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Get Started
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
    
    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
          <a href="#features" className="py-2 text-gray-700 font-medium">Features</a>
          <a href="#solutions" className="py-2 text-gray-700 font-medium">Solutions</a>
          <a href="#testimonials" className="py-2 text-gray-700 font-medium">Testimonials</a>
          <a href="#pricing" className="py-2 text-gray-700 font-medium">Pricing</a>
          
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full py-2.5 text-gray-700 font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg mt-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    )}
  </header>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The Future of <span className="text-blue-200">Work</span> Is Here
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Connect with top talent or find your dream job. From full-time positions to quick gigs, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/signup')} 
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-lg text-lg font-medium transition-all duration-300 hover:-translate-y-1"
              >
                Find Work
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 text-lg font-medium"
              >
                Hire Talent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center">
              <Users className="text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">10,000+ Professionals</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">5,000+ Jobs Posted</span>
            </div>
            <div className="flex items-center">
              <Award className="text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">Trusted by 1,000+ Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose WorkaFlow</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make finding work or talent simple, fast, and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Lightning Fast Matching",
                description: "Our AI-powered algorithm connects you with the most relevant opportunities or talent in seconds."
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Secure Payments",
                description: "Escrow protection ensures you only pay for work you're satisfied with."
              },
              {
                icon: <Handshake className="w-8 h-8 text-blue-600" />,
                title: "Direct Communication",
                description: "Chat and video call features built right into the platform."
              },
              {
                icon: <FileText className="w-8 h-8 text-blue-600" />,
                title: "Comprehensive Profiles",
                description: "Detailed profiles with verified skills and work history."
              },
              {
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Flexible Work Options",
                description: "From full-time to micro-tasks, choose what works for you."
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-600" />,
                title: "Global Network",
                description: "Access talent and opportunities from around the world."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started, whether you're looking for work or talent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Users className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Talent</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  "Create your profile in minutes",
                  "Browse personalized job recommendations",
                  "Apply with one click",
                  "Get hired and start working"
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate('/signup')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                Join as Talent
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
            
            {/* For Employers */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Briefcase className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Employers</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  "Post your job or project",
                  "Review matched candidates",
                  "Interview top talent",
                  "Hire and manage work"
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate('/signup')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                Post a Job
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from professionals and businesses who found success with WorkaFlow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Freelance Designer",
                quote: "WorkaFlow helped me triple my income by connecting me with high-quality clients.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Startup Founder",
                quote: "We found our entire development team through WorkaFlow. The platform saved us months of recruiting.",
                rating: 5
              },
              {
                name: "David Wilson",
                role: "Marketing Director",
                quote: "The flexibility to hire for both full-time roles and short-term projects is invaluable.",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Work Life?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals and businesses already using WorkaFlow.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-lg text-lg font-medium transition-all duration-300 hover:-translate-y-1"
          >
            Get Started - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Worka<span className="text-blue-400">Flow</span></h3>
              <p className="text-gray-400 mb-6">
                Connecting the world's professionals to make them more productive and successful.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Professionals</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Find Work</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Create Profile</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Businesses</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post a Job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Find Talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Enterprise Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2023 WorkaFlow. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}