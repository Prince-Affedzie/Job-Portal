import { useState, useEffect,} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { 
  Search, Star, ArrowRight, Menu, X, Check, Shield, Clock, 
  Hammer, Wrench, Home, Truck, Paintbrush, Zap, Users, 
  Heart, Award, TrendingUp, Play, ChevronRight, MapPin,
  Phone, Mail, Twitter, Linkedin, Github, Sparkles, ThumbsUp,
  ClipboardCheck, CreditCard, UserCheck, Calendar, Settings
} from 'lucide-react';

export default function WorkaFlowLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Simple search suggestions
  const searchSuggestions = [
    "Fix my sink",
    "Clean my house", 
    "Mount my TV",
    "Assemble furniture",
    "Paint a room",
    "Move my stuff"
  ];

  // Rotate search suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % searchSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Features carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  const categories = [
    { name: 'Home Repairs', icon: <Wrench className="w-6 h-6" />, color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cleaning', icon: <Home className="w-6 h-6" />, color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
    { name: 'Assembly', icon: <Hammer className="w-6 h-6" />, color: 'bg-blue-700', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Moving', icon: <Truck className="w-6 h-6" />, color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1600965962384-8b5efb2b6f18?auto=format&fit=crop&w=800&q=80' },
    { name: 'Painting', icon: <Paintbrush className="w-6 h-6" />, color: 'bg-indigo-600', image: 'https://images.unsplash.com/photo-1591768793355-5c0a2f2e819d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Electrical', icon: <Zap className="w-6 h-6" />, color: 'bg-indigo-700', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80' },
    { name: 'Plumbing', icon: <Wrench className="w-6 h-6" />, color: 'bg-cyan-500', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gardening', icon: <Home className="w-6 h-6" />, color: 'bg-cyan-600', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' }
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      rating: 5,
      text: "Found someone to fix my kitchen sink in 30 minutes. Amazing service and affordable pricing!",
      task: "Plumbing repair",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Mike T.", 
      rating: 5,
      text: "Perfect assembly job on my IKEA furniture. Very professional and completed ahead of schedule.",
      task: "Furniture assembly",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Lisa M.",
      rating: 5, 
      text: "House cleaning was thorough and affordable. Will definitely use WorkaFlow again!",
      task: "House cleaning",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const features = [
    {
      title: "Verified Taskers",
      description: "All taskers are background-checked and reviewed so you can hire with confidence.",
      icon: <Shield className="w-8 h-8" />,
      stats: "1000+ verified professionals"
    },
    {
      title: "Secure Payments",
      description: "Payments held securely until work is completed to your satisfaction.",
      icon: <CreditCard className="w-8 h-8" />,
      stats: "Zero payment issues reported"
    },
    {
      title: "Quick Matching",
      description: "Get connected with available taskers in your area within minutes.",
      icon: <Zap className="w-8 h-8" />,
      stats: "Average response time: 12 minutes"
    },
    {
      title: "Satisfaction Guarantee",
      description: "We ensure quality work or your money back. Your happiness is our priority.",
      icon: <ThumbsUp className="w-8 h-8" />,
      stats: "98.9% customer satisfaction rate"
    }
  ];

  const stats = [
    { value: "15,847", label: "Tasks Completed" },
    { value: "4.9★", label: "Average Rating" },
    { value: "₵120K+", label: "Earned by Taskers" },
    { value: "98.9%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">Worka</span>
                <span className="text-blue-400">Flow</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav  style={{
              display: windowWidth >= 720 ? 'flex' : 'none',
            }} className=" md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">How It Works</a>
              <a href="#taskers" className="text-gray-700 hover:text-blue-600 font-medium">Become a Tasker</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Sign In</a>
              <Link to='/signup' className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Join Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <a href="#services" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#how-it-works" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">How It Works</a>
              <a href="#taskers" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Become a Tasker</a>
              <a href="/login" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Sign In</a>
              <Link to='/signup' className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium mt-2">
                Join Now
              </Link>
            </div>
          </div>
        )}
      </header>

    {/* Modern Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
  {/* Background Elements */}
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
  
  {/* Animated Background Shapes */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <div className="text-left">
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
          <span className="text-sm font-medium text-white">Ghana's Premium Handywork Platform</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Get anything done, 
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> anywhere</span>
          <br />in Ghana
        </h1>
        
        <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
          From quick fixes to complex projects, connect with skilled professionals ready to help. 
          Experience the future of handywork services.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Try "${searchSuggestions[currentCategory]}"`}
              className="w-full pl-12 pr-24 py-5 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Visual Element */}
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Hammer className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Matching</h3>
              <p className="text-blue-200">Connect with taskers in your area within minutes</p>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { name: 'Sarah', rating: 4.9, color: 'bg-pink-500' },
                  { name: 'Mike', rating: 4.8, color: 'bg-blue-500' },
                  { name: 'Lisa', rating: 5.0, color: 'bg-green-500' }
                ].map((tasker, index) => (
                  <div key={index} className="text-center">
                    <div className={`${tasker.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white`}>
                      {tasker.name.charAt(0)}
                    </div>
                    <div className="flex justify-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white ml-1">{tasker.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg animate-bounce">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="flex flex-col items-center">
        <span className="text-blue-200 text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whatever you need, there's a tasker for that
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-4 text-center">
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 text-white`}>
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                    Browse tasks
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose <span className="text-blue-600">WorkaFlow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it safe and easy to get your tasks done
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Features list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    activeFeature === index 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-100 bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      activeFeature === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{feature.stats}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature image */}
            <div style={{
              display: windowWidth >= 720 ? 'block' : 'none',
            }} className="md:block">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {features[activeFeature].icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{features[activeFeature].title}</h3>
                    <p className="text-gray-600">{features[activeFeature].description}</p>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm">
                      {features[activeFeature].stats}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Simple */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How <span className="text-blue-600">WorkaFlow</span> works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600 font-bold text-xl">1</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Your Task</h3>
              <p className="text-gray-600">Describe what you need done, set your budget, and when you need it completed</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600 font-bold text-xl">2</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Tasker</h3>
              <p className="text-gray-600">Browse profiles, reviews and chat with available taskers in your area</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600 font-bold text-xl">3</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get It Done</h3>
              <p className="text-gray-600">Pay securely through the platform only when the work is completed to your satisfaction</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={()=>navigate('/signup')} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto">
              Get Started Now
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            What our <span className="text-blue-600">customers</span> say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">"{testimonial.text}"</p>
                <p className="text-sm text-blue-600 font-medium">{testimonial.task}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasker Section */}
      <section id="taskers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Become a <span className="text-blue-600">Tasker</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn money doing what you love. Set your own schedule and rates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why join WorkaFlow?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-1 rounded-full mr-4 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Set your own rates</h4>
                      <p className="text-gray-600">You decide what to charge for your services</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-1 rounded-full mr-4 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible schedule</h4>
                      <p className="text-gray-600">Work when you want, as much as you want</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 p-1 rounded-full mr-4 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Get paid securely</h4>
                      <p className="text-gray-600">Payments processed directly to your account</p>
                    </div>
                  </li>
                </ul>
                <button onClick={()=>navigate('/signup')} className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Sign Up as Tasker
                </button>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" 
                alt="Happy tasker" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get your task done?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of people in Ghana who get things done with WorkaFlow
          </p>
          <div  className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate('/signup')} className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors">
              Post a Task
            </button>
            <button  onClick={()=>navigate('/signup')} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors">
              Become a Tasker
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <span className="text-blue-400">Worka</span>
                <span className="text-blue-300">Flow</span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Ghana's trusted marketplace for handywork and micro jobs.
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

            {/* For Customers */}
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/login" className="text-gray-400 hover:text-white">Post a Task</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Safety</a></li>
              </ul>
            </div>

            {/* For Taskers */}
            <div>
              <h4 className="font-semibold mb-4">For Taskers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Become a Tasker</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">How to Earn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 WorkaFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}