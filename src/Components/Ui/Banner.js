import React, { useEffect, useState, useRef } from 'react';
import { Search, Briefcase, MapPin, Users, Star, ChevronDown, X } from 'lucide-react';

const JobBanner = ({ 
  title = "Find Your Next Job Opportunity", 
  subtitle = "Explore thousands of jobs tailored for you.",
  showSearch = true,
  theme = "blue",
  animation = "all",
  compact = false,
  searchQuery = "",
  onSearchChange = () => {},
  locationQuery = "",
  onLocationChange = () => {},
  onSearchSubmit = () => {}
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const dropdownRef = useRef(null);

  // Ghana regions data
  const ghanaRegions = [
    "Greater Accra", "Ashanti", "Central", "Western", "Northern", 
    "Eastern", "Upper East", "Upper West", "Volta", "Oti", 
    "North East", "Bono", "Bono East", "Ahafo", "Savannah", "Western North"
  ];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme colors
  const themes = {
    blue: {
      bg: 'from-blue-600 to-blue-800',
      accent: 'bg-blue-500',
      text: 'text-white',
      button: 'bg-white text-blue-700 hover:bg-blue-50',
      dropdown: 'bg-white border-blue-200'
    },
    purple: {
      bg: 'from-purple-600 to-purple-800',
      accent: 'bg-purple-500',
      text: 'text-white',
      button: 'bg-white text-purple-700 hover:bg-purple-50',
      dropdown: 'bg-white border-purple-200'
    },
    teal: {
      bg: 'from-teal-600 to-teal-800',
      accent: 'bg-teal-500',
      text: 'text-white',
      button: 'bg-white text-teal-700 hover:bg-teal-50',
      dropdown: 'bg-white border-teal-200'
    }
  };

  const currentTheme = themes[theme] || themes.blue;

  // Filter regions based on search
  const filteredRegions = ghanaRegions.filter(region =>
    region.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleLocationSelect = (region) => {
    onLocationChange(region);
    setShowLocationDropdown(false);
    setLocationSearch("");
  };

  const clearLocation = () => {
    onLocationChange("");
    setLocationSearch("");
  };

  return (
    <div className={`relative overflow-visible  rounded-xl md:rounded-2xl bg-gradient-to-r ${currentTheme.bg} ${currentTheme.text} p-4 md:p-6 lg:p-8 shadow-lg mb-6 ${compact ? 'max-h-96' : ''}`}>
      {/* Animated background elements - simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating briefcases - fewer on mobile */}
        {!isSmallScreen && (
          <>
            <div className={`absolute -top-4 -left-4 w-8 h-8 md:w-12 md:h-12 opacity-20 ${animation !== 'none' ? 'animate-float-slow' : ''}`}>
              <Briefcase className="w-full h-full" />
            </div>
            <div className={`absolute top-6 -right-4 w-10 h-10 md:w-16 md:h-16 opacity-15 ${animation !== 'none' ? 'animate-float-medium' : ''}`}>
              <Briefcase className="w-full h-full" />
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
                    <div className="font-semibold text-sm md:text-base">10K+</div>
                    <div className="text-xs opacity-80">Jobs</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-1 md:p-2 rounded-lg ${currentTheme.accent} bg-opacity-20`}>
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">5K+</div>
                    <div className="text-xs opacity-80">Users</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-1 md:p-2 rounded-lg ${currentTheme.accent} bg-opacity-20`}>
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">98%</div>
                    <div className="text-xs opacity-80">Success</div>
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
                <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords..."
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              
              {/* Enhanced Location Select */}
              <div className="flex-1 relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 p-2 md:p-3 border-t sm:border-t-0 sm:border-l border-gray-200 h-full">
                  <MapPin className="text-gray-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <div 
                    className="flex-1 flex items-center justify-between cursor-pointer"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  >
                    <span className={`text-sm md:text-base ${locationQuery ? 'text-gray-800' : 'text-gray-400'}`}>
                      {locationQuery || "All Regions"}
                    </span>
                    <div className="flex items-center gap-1">
                      {locationQuery && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearLocation();
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Location Dropdown */}
                {showLocationDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border ${currentTheme.dropdown} z-50 overflow-hidden`}>
                    {/* Search input inside dropdown */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search regions..."
                          className="w-full pl-8 pr-3 py-2 text-sm text-gray-800 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Region list */}
                    <div className="max-h-48 overflow-y-auto">
                      <div
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleLocationSelect("")}
                      >
                        All Regions
                      </div>
                      {filteredRegions.map((region) => (
                        <div
                          key={region}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-800 text-sm md:text-base"
                          onClick={() => handleLocationSelect(region)}
                        >
                          {region}
                        </div>
                      ))}
                      {filteredRegions.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                          No regions found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button onClick={onSearchSubmit} className={`px-4 py-2 md:px-5 md:py-3 rounded-lg font-semibold transition-all ${currentTheme.button} flex items-center gap-2 text-sm md:text-base`}>
                <Search className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            
            {/* Quick filters - hidden on small screens when compact */}
            {(!isSmallScreen || !compact) && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs md:text-sm opacity-80">Trending:</span>
                {['Remote', 'Developer', 'Designer'].map((tag) => (
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
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-medium { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default JobBanner;