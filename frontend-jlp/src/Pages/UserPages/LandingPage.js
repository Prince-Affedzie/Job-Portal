import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, Users, MessageSquare, CheckCircle, 
  ArrowRight, Menu, X, Calendar, Clock, Globe, ChevronRight,
  Star, Award, Zap, Shield, Handshake, FileText, Mail, Linkedin, Twitter, Github,
  Play, Eye, UserCheck, TrendingUp, Heart, Building, Rocket, Lightbulb,
  Activity, Target, Layers, Code, Palette, Cpu, Database, Wifi,
  BarChart3, PieChart, LineChart, ArrowUp, Filter, Settings
} from 'lucide-react';

export default function WorkaflowLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeDemo, setActiveDemo] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSkill, setActiveSkill] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  // Real search suggestions showing both micro tasks and professional roles
  const searchSuggestions = [
    "Fix my WordPress bug",
    "Senior React Developer",
    "Data entry task", 
    "Marketing Director",
    "Logo design needed",
    "Python tutoring session",
    "Full Stack Engineer",
    "Website copywriting",
  ];

  // Mouse tracking for visual effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system for hero background
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Search typing animation
  useEffect(() => {
    let timeout;
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSearch = () => {
      const current = searchSuggestions[currentIndex];
      
      if (!isDeleting && charIndex < current.length) {
        setSearchQuery(current.substring(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(typeSearch, 100);
      } else if (isDeleting && charIndex > 0) {
        setSearchQuery(current.substring(0, charIndex - 1));
        charIndex--;
        timeout = setTimeout(typeSearch, 50);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          currentIndex = (currentIndex + 1) % searchSuggestions.length;
        }
        timeout = setTimeout(typeSearch, isDeleting ? 1000 : 2000);
      }
    };

    timeout = setTimeout(typeSearch, 1000);
    return () => clearTimeout(timeout);
  }, []);

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

  // Demo carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Rotating skills showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % 6);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const skills = [
    { name: 'Frontend Development', icon: <Code />, demand: 95, growth: '+23%' },
    { name: 'UI/UX Design', icon: <Palette />, demand: 88, growth: '+31%' },
    { name: 'Data Engineering', icon: <Database />, demand: 92, growth: '+35%' },
    { name: 'Data Science', icon: <BarChart3 />, demand: 85, growth: '+28%' },
    { name: 'DevOps', icon: <Settings />, demand: 79, growth: '+22%' },
    { name: 'Product Management', icon: <Target />, demand: 83, growth: '+19%' }
  ];

  const platformFeatures = [
    { 
      title: "Micro Task Marketplace", 
      description: "Post quick tasks like logo design, data entry, tutoring, or bug fixes. Get them done fast by skilled freelancers.",
      icon: <Zap />
    },
    { 
      title: "Professional Hiring", 
      description: "Find and hire full-time employees, contractors, and consultants for senior roles and long-term projects.",
      icon: <Building />
    },
    { 
      title: "Smart Matching", 
      description: "Our AI connects you with the right talent whether it's a 2-hour task or a 2-year position.",
      icon: <Heart />
    },
    { 
      title: "Flexible Pricing", 
      description: "Fair rates for every type of work - from $5 micro tasks to six-figure executive positions.",
      icon: <LineChart />
    }
  ];

  const dynamicStats = [
    { value: '15,847', label: 'Active Projects', change: '+12%', icon: <Activity /> },
    { value: '98.9%', label: 'Success Rate', change: '+0.3%', icon: <Target /> },
    { value: '₵2.4M+', label: 'Paid Out Today', change: '+18%', icon: <TrendingUp /> },
    { value: '847', label: 'New Matches/Hour', change: '+25%', icon: <Zap /> }
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* Modern Navigation */}
      <header className={`w-full z-50 fixed transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3 border-b border-white/20' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <h1 className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                  <span className="text-blue-600">Worka</span>
                  <span className="text-blue-400">Flow</span>
                </h1>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            {windowWidth >= 1024 && (
              <nav className="flex items-center space-x-8">
                {['Features', 'How It Works', 'Demo', 'Success Stories', 'Pricing'].map((item, index) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
                
                <div className="flex items-center space-x-4 ml-6">
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium"
                  >
                    Get Started
                  </button>
                </div>
              </nav>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-xl border-t border-gray-200">
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              {['Features', 'How It Works', 'Demo', 'Success Stories', 'Pricing'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="py-3 text-gray-700 font-medium hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {item}
                </a>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full py-3 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
        </div>

        {/* Interactive Mouse Follower */}
        <div 
          className="fixed w-20 h-20 border border-white/20 rounded-full pointer-events-none transition-all duration-300 z-10"
          style={{
            left: mousePosition.x - 40,
            top: mousePosition.y - 40,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent)`,
          }}
        />
        
        <div className="container mx-auto px-6 relative z-20 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Rocket className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">Premium Talent Matching</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight">
                From <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Quick Tasks</span> to <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Dream Jobs</span>
              </h1>
              
              <p className="text-xl md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                Whether you need a quick task completed or want to hire top talent for your team, our platform connects you with the right people instantly.
              </p>

              {/* Interactive Search Demo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <Search className="w-6 h-6 text-blue-300" />
                  <div className="flex-1">
                    <div className="text-lg font-medium text-white">
                      Find: <span className="text-blue-300">{searchQuery}</span>
                      <span className="animate-pulse">|</span>
                    </div>
                    <div className="text-sm text-blue-200 mt-1">
                      {searchQuery.includes('Developer') || searchQuery.includes('Director') || searchQuery.includes('Engineer') ? 
                        'Discovering 847 professional candidates...' : 
                        'Finding 2,341 available freelancers...'
                      }
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/signup')} 
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl text-lg font-medium transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 text-lg font-medium flex items-center justify-center backdrop-blur-sm"
                >
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </button>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { number: '15K+', label: 'Tasks Completed' },
                  { number: '3,200+', label: 'Professionals Hired' },
                  { number: '2.3s', label: 'Avg Match Time' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Dashboard Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Talent Radar</h3>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Skill Radar */}
                  <div className="space-y-4">
                    {skills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                            {skill.icon}
                          </div>
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.demand}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-green-400">{skill.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Real-time Activity */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">Live Activity</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sarah hired for React project</span>
                        <span className="text-green-400">Just now</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Data position posted</span>
                        <span className="text-blue-400">2m ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mike completed Python task</span>
                        <span className="text-purple-400">5m ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-xl animate-bounce">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDelay: '1s' }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Rocket className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Premium Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              One Platform, <span className="text-blue-600">Two Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you need quick help with small tasks or want to build your dream team with top professionals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {platformFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                    activeDemo === index 
                      ? 'bg-white shadow-xl border-2 border-blue-200 transform scale-105' 
                      : 'bg-white/50 hover:bg-white hover:shadow-lg'
                  }`}
                  onClick={() => setActiveDemo(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeDemo === index ? 'bg-blue-600' : 'bg-blue-100'
                    } transition-colors`}>
                      <div className={activeDemo === index ? 'text-white' : 'text-blue-600'}>
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-3">{feature.description}</p>
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Dashboard */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Platform Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                {/* Dynamic Chart */}
                <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 flex items-end space-x-2">
                  {[40, 65, 45, 80, 60, 95, 75, 85].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {dynamicStats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-blue-600">{stat.icon}</div>
                        <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-green-600 font-medium">{stat.change}</div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Market Insight</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    Based on market trends, consider adding TypeScript to your skills. 
                    <span className="font-medium"> High demand opportunity</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Way Platform Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Every Type of <span className="text-blue-600">Work Need</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From quick 1-hour tasks to full-time career opportunities - we've got you covered.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Micro Tasks Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Quick Tasks & Gigs</h3>
                  <p className="text-green-600 font-medium">Get things done fast</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { task: 'Logo design for startup', price: '₵200', time: '2 hours', freelancer: 'Sarah M.' },
                  { task: 'WordPress bug fix', price: '₵700', time: '1 hour', freelancer: 'Mike R.' },
                  { task: 'Apartment Cleaning', price: '₵300', time: '3 hours', freelancer: 'Lisa K.' },
                  { task: 'Event Photographer Needed', price: '₵550', time: '1 hour', freelancer: 'John D.' }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{item.task}</h4>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">{item.price}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">{item.freelancer}</span>
                      </div>
                      <div className="text-xs text-green-600 font-medium">Available Now</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-500 text-white rounded-2xl p-6">
                <h4 className="font-bold mb-2">Perfect for:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Small businesses needing quick help</li>
                  <li>• Individuals with one-off projects</li>
                  <li>• Testing ideas before bigger investments</li>
                  <li>• Getting expert advice on specific topics</li>
                </ul>
              </div>
            </div>

            {/* Professional Hiring Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Professional Hiring</h3>
                  <p className="text-blue-600 font-medium">Build your dream team</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { role: 'Senior React Developer', salary: '₵95-120K', type: 'Full-time', level: 'Senior' },
                  { role: 'Marketing Director', salary: '₵85-110K', type: 'Full-time', level: 'Director' },
                  { role: 'Data Scientist', salary: '₵80-100k', type: 'Contract', level: 'Expert' },
                  { role: 'UX/UI Designer', salary: '₵70-90K', type: 'Full-time', level: 'Mid-level' }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{item.role}</h4>
                      <div className="text-right">
                        <div className="text-blue-600 font-bold">{item.salary}</div>
                        <div className="text-xs text-gray-500">{item.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">{item.level}</span>
                      </div>
                      <div className="text-xs text-blue-600 font-medium">247 Candidates</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-500 text-white rounded-2xl p-6">
                <h4 className="font-bold mb-2">Perfect for:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Companies scaling their teams</li>
                  <li>• Startups looking for co-founders</li>
                  <li>• Long-term project partnerships</li>
                  <li>• Executive and leadership positions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-gray-100 rounded-2xl p-2">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <Zap className="w-2 h-2 md:w-5 h-5" />
                <span>Post Task</span>
              </button>
              <div className="text-gray-500 font-medium">or</div>
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <Building className="w-2 h-2 md:w-5 h-5" />
                <span>Hire Professionals</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Marketplace */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Skills Marketplace</h2>
            <p className="text-xl text-gray-600">Real-time demand and opportunities for top skills</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                  activeSkill === index 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg transform -translate-y-2' 
                    : 'bg-white border-gray-100 hover:shadow-md'
                }`}
                onClick={() => setActiveSkill(index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeSkill === index ? 'bg-blue-600' : 'bg-blue-100'
                  } transition-colors`}>
                    <div className={activeSkill === index ? 'text-white' : 'text-blue-600'}>
                      {skill.icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{skill.growth}</div>
                    <div className="text-sm text-gray-600">Growth</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{skill.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Demand</span>
                    <span className="font-medium">{skill.demand}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.demand}%` }}
                    />
                  </div>
                </div>

                {activeSkill === index && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
                    <div className="text-sm text-gray-600 mb-2">Available Opportunities</div>
                    <div className="text-2xl font-bold text-gray-900">1,247 jobs</div>
                    <div className="text-sm text-green-600">Avg.₵85-120/hr</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience the Platform</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              See how our platform creates meaningful connections between talent and opportunities.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Demo Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-8 flex flex-wrap justify-center gap-2">
              {[
                { label: 'Smart Matching', icon: <Heart /> },
                { label: 'Advanced Search', icon: <Search /> },
                { label: 'Market Analytics', icon: <BarChart3 /> },
                { label: 'Success Tracking', icon: <Target /> }
              ].map((demo, index) => (
                <button 
                  key={index}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeDemo === index 
                      ? 'bg-white text-indigo-600 shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveDemo(index)}
                >
                  {demo.icon}
                  <span>{demo.label}</span>
                </button>
              ))}
            </div>

            {/* Demo Screen */}
            <div className="relative bg-black/20 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <div className="aspect-video relative">
                {/* Browser-like header */}
                <div className="absolute top-0 left-0 right-0 bg-white/10 p-4 flex items-center space-x-2 border-b border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-sm text-white/70">
                    workaflow.com/dashboard
                  </div>
                </div>

                {/* Demo Content */}
                <div className="pt-16 p-8 h-full">
                  {activeDemo === 0 && (
                    <div className="grid grid-cols-2 gap-8 h-full">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Smart Talent Matching</h3>
                        <div className="space-y-3">
                          {['React Developer', 'UI/UX Designer', 'Product Manager'].map((role, idx) => (
                            <div key={idx} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="font-medium">{role}</div>
                                <div className="text-sm text-white/70">98% match • Available now</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="w-48 h-48 border-4 border-blue-400 rounded-full flex items-center justify-center">
                            <Heart className="w-16 h-16 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemo === 1 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <Search className="w-16 h-16 text-blue-400 mx-auto" />
                        <h3 className="text-3xl font-bold">Advanced Search</h3>
                        <div className="bg-white/10 rounded-2xl p-6 max-w-md">
                          <input 
                            type="text"
                            placeholder="Try: Senior React Developer in NYC"
                            className="w-full bg-transparent text-white placeholder-white/50 text-lg outline-none"
                          />
                          <div className="mt-4 text-sm text-white/70">
                            Found 1,247 matches in 0.3 seconds
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemo === 2 && (
                    <div className="grid grid-cols-2 gap-8 h-full">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Market Analytics</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <span>Project Success Rate</span>
                              <span className="text-green-400 font-bold">94.7%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full">
                              <div className="w-[94.7%] h-full bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <span>Timeline Accuracy</span>
                              <span className="text-blue-400 font-bold">89.2%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full">
                              <div className="w-[89.2%] h-full bg-blue-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <BarChart3 className="w-32 h-32 text-purple-400" />
                      </div>
                    </div>
                  )}

                  {activeDemo === 3 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <Target className="w-16 h-16 text-green-400 mx-auto" />
                        <h3 className="text-3xl font-bold">Success Tracking</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-400/20 rounded-xl p-4">
                            <div className="text-2xl font-bold text-green-400">High</div>
                            <div className="text-sm">Success Probability</div>
                          </div>
                          <div className="bg-blue-400/20 rounded-xl p-4">
                            <div className="text-2xl font-bold text-blue-400">3 weeks</div>
                            <div className="text-sm">Est. Completion</div>
                          </div>
                          <div className="bg-purple-400/20 rounded-xl p-4">
                            <div className="text-2xl font-bold text-purple-400">₵12k</div>
                            <div className="text-sm">Projected Value</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button className="bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all rounded-full p-6 shadow-2xl pointer-events-auto group">
                  <Play className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for <span className="text-blue-600">Modern Work</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed to create meaningful connections and successful outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Smart Matching",
                description: "Our algorithm analyzes skills, experience, and preferences to create perfect matches.",
                color: "from-blue-500 to-indigo-600",
                stats: "98.7% accuracy",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Platform",
                description: "Advanced encryption ensures your data and payments are completely secure.",
                color: "from-green-500 to-emerald-600",
                stats: "Zero breaches",
                image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Fast Collaboration",
                description: "Real-time collaboration tools with project management and progress tracking.",
                color: "from-yellow-500 to-orange-600",
                stats: "3x faster delivery",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Success Tracking",
                description: "Monitor project success probability and get suggestions for optimizations.",
                color: "from-purple-500 to-pink-600",
                stats: "94% accuracy",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Network",
                description: "Access talent from around the world with timezone optimization and cultural matching.",
                color: "from-indigo-500 to-blue-600",
                stats: "195+ countries",
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1784&q=80"
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: "Analytics Dashboard",
                description: "Real-time insights with recommendations to optimize your work strategy.",
                color: "from-red-500 to-rose-600",
                stats: "Real-time insights",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-80`}></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/20 backdrop-blur-lg rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">{feature.stats}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  
                  <button className="flex items-center space-x-2 text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people, real results, powered by meaningful connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alexandra Chen",
                role: "Software Engineer",
                company: "TechFlow Inc.",
                story: "WorkaFlow matched me with my dream job at a top tech company. The process was so smooth, I got hired after just one interview!",
                achievement: "Great career move",
                rating: 5,
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
                bgGradient: "from-blue-500 to-indigo-600"
              },
              {
                name: "Marcus Rodriguez",
                role: "Startup Founder",
                company: "InnovateLabs",
                story: "We built our entire 15-person team through WorkaFlow. The platform's matching was spot-on - our team chemistry is incredible.",
                achievement: "Team hired in 2 weeks",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
                bgGradient: "from-green-500 to-emerald-600"
              },
              {
                name: "Sarah Kim",
                role: "Freelance Designer",
                company: "Independent",
                story: "The platform helped me pivot from generic design work to specialized UX for fintech. My rates improved significantly in 6 months!",
                achievement: "Career transformation",
                rating: 5,
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
                bgGradient: "from-purple-500 to-pink-600"
              }
            ].map((story, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className={`relative h-24 bg-gradient-to-r ${story.bgGradient}`}>
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                      <img 
                        src={story.image} 
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute top-4 right-6">
                    <div className="bg-white/20 backdrop-blur-lg rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">{story.achievement}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 p-8">
                  <div className="flex mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                    "{story.story}"
                  </blockquote>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-900 text-lg">{story.name}</h4>
                    <p className="text-blue-600 font-medium">{story.role}</p>
                    <p className="text-gray-500 text-sm">{story.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full mb-8 border border-white/20">
              <Rocket className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Join 127,000+ professionals</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Career</span>?
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join professionals and businesses already using WorkaFlow. 
              Find perfect opportunities, build your career, and achieve your goals.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <button 
                onClick={() => navigate('/signup')}
                className="group px-10 py-5 bg-white text-blue-600 rounded-2xl hover:bg-gray-100 text-xl font-bold transition-all duration-300 hover:-translate-y-1 shadow-2xl flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 text-xl font-bold flex items-center justify-center backdrop-blur-lg"
              >
                <Play className="mr-3" size={24} />
                Watch Demo
              </button>
            </div>
            
            <div className="text-center text-blue-200">
              <p className="text-lg">🚀 Free to start • ⚡ Quality matching • 🎯 97% success rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold">
                  <span className="text-blue-400">Worka</span>
                  <span className="text-blue-300">Flow</span>
                </h3>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Creating meaningful connections between talent and opportunities. 
                Making every match count, every project successful, and every career extraordinary.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">For Talent</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job Matching</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Profile Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Skill Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Coaching</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">For Business</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Talent Sourcing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Hiring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Team Analytics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Matching</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Market Analytics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Recommendations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Prediction</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Access</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <p className="text-gray-400 text-sm">
                  © 2024 WorkaFlow. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Systems Online</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Transparency</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Preferences</a>
              </div>
            </div>
            
            {/* Status Footer */}
            <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Platform Status</span>
                    <div className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">ACTIVE</div>
                  </div>
                  <div className="hidden md:block w-px h-6 bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Processing 1,247 matches/min</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()} UTC
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </button>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Support
            <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45 transform -mt-1"></div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Enhanced Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 3s infinite;
        }
        
        .hover\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
}