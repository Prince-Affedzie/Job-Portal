import React, { useEffect, useState } from 'react';
import { Search, Briefcase, Clock, DollarSign, Zap, TrendingUp } from 'lucide-react';

const MicroJobBanner = ({ 
  title = "Find Mini Tasks & Earn", 
  subtitle = "Browse through short-term gigs and apply for tasks that match your skills.",
  showSearch = true,
  theme = "green",
  animation = "all",
  compact = false,
  searchQuery = "",
  onSearchChange = () => {},
  categoryQuery = "",
  onCategoryChange = () => {},
  onSearchSubmit = () => {},
  // Add categoryOptions prop to match your data structure
  categoryOptions = {}
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Theme colors - green theme for micro jobs
  const themes = {
    green: {
      bg: 'from-green-600 to-green-800',
      accent: 'bg-green-500',
      text: 'text-white',
      button: 'bg-white text-green-700 hover:bg-green-50'
    },
    orange: {
      bg: 'from-orange-600 to-orange-800',
      accent: 'bg-orange-500',
      text: 'text-white',
      button: 'bg-white text-orange-700 hover:bg-orange-50'
    },
    teal: {
      bg: 'from-teal-600 to-teal-800',
      accent: 'bg-teal-500',
      text: 'text-white',
      button: 'bg-white text-teal-700 hover:bg-teal-50'
    },
    blue: {
      bg: 'from-blue-600 to-blue-800',
      accent: 'bg-blue-500',
      text: 'text-white',
      button: 'bg-white text-blue-700 hover:bg-blue-50'
    }
  };

  const currentTheme = themes[theme] || themes.green;

  return (
    <div className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r ${currentTheme.bg} ${currentTheme.text} p-4 md:p-6 lg:p-8 shadow-lg mb-6 ${compact ? 'max-h-96' : ''}`}>
      {/* Animated background elements - simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating lightning bolts - fewer on mobile */}
        {!isSmallScreen && (
          <>
            <div className={`absolute -top-4 -left-4 w-8 h-8 md:w-12 md:h-12 opacity-20 ${animation !== 'none' ? 'animate-float-slow' : ''}`}>
              <Zap className="w-full h-full" />
            </div>
            <div className={`absolute top-6 -right-4 w-10 h-10 md:w-16 md:h-16 opacity-15 ${animation !== 'none' ? 'animate-float-medium' : ''}`}>
              <Zap className="w-full h-full" />
            </div>
          </>
        )}
        
        {/* Pulsing circles - smaller on mobile */}
        <div className={`absolute -bottom-6 -left-6 w-20 h-20 md:w-32 md:h-32 rounded-full ${currentTheme.accent} opacity-10 ${animation !== 'none' ? 'animate-pulse-slow' : ''}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-sm md:text-base opacity-90 mb-4 md:mb-5 max-w-2xl">
              {subtitle}
            </p>

            {/* Stats - hidden on small screens when compact */}
            {(!isSmallScreen || !compact) && (
              <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-5">
                <div className="flex items-center gap-2">
                  <div className={`p-1 md:p-2 rounded-lg ${currentTheme.accent} bg-opacity-20`}>
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">5K+</div>
                    <div className="text-xs opacity-80">Tasks</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-1 md:p-2 rounded-lg ${currentTheme.accent} bg-opacity-20`}>
                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">Quick</div>
                    <div className="text-xs opacity-80">Completion</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-1 md:p-2 rounded-lg ${currentTheme.accent} bg-opacity-20`}>
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">Instant</div>
                    <div className="text-xs opacity-80">Payouts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search bar - simplified for mobile */}
        {showSearch && (
          <div className="mt-4 md:mt-6 max-w-2xl">
            <div className="bg-white rounded-lg md:rounded-xl p-1 shadow-md flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 md:p-3">
                <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Task title, skills..."
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              
              <div className="flex-1 flex items-center gap-2 p-2 md:p-3 border-t sm:border-t-0 sm:border-l border-gray-200">
                <TrendingUp className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <select
                  value={categoryQuery}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="flex-1 outline-none text-gray-800 text-sm md:text-base bg-transparent"
                >
                  <option value="">All Categories</option>
                  {Object.keys(categoryOptions).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <button onClick={onSearchSubmit} className={`px-4 py-2 md:px-5 md:py-3 rounded-lg font-semibold transition-all ${currentTheme.button} flex items-center gap-2 text-sm md:text-base`}>
                <Search className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            
            {/* Quick filters - hidden on small screens when compact */}
            {(!isSmallScreen || !compact) && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs md:text-sm opacity-80">Popular:</span>
                {['Quick Tasks', 'Remote', 'Writing', 'Design', 'Under ₵500'].map((tag) => (
                  <button
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs bg-white bg-opacity-15 hover:bg-opacity-25 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes zap {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-medium { animation: float 6s ease-in-out infinite; }
        .animate-zap { animation: zap 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MicroJobBanner;