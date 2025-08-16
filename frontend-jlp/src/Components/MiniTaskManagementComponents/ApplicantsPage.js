import React, { useState, useEffect } from 'react';
import { useParams, useLocation,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicantScoreCard from './ApplicantScoreCard';
import ApplicantScoreTable from './ApplicantScoreTable';
import { getMicroTaskApplicants, assignApplicantToTask } from '../../APIS/API';
import StartChatButton from "../MessagingComponents/StartChatButton";

import Navbar from '../Common/Navbar';
import ProcessingOverlay from '../Common/ProcessingOverLay';
import { FaBars, FaTh, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ApplicantsPage = () => {
  const { taskId } = useParams();
  const { state } = useLocation();
  const [applicants, setApplicants] = useState([]);
  const [sortedApplicants, setSortedApplicants] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'desc' });
  const [viewMode, setViewMode] = useState(() => 
    window.innerWidth < 768 ? 'cards' : 'table'
  );
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignedApplicantId, setAssignedApplicantId] = useState(state?.assignedTo?._id || null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = windowWidth < 768 ? 8 : 12; // Fewer items on mobile

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768 && viewMode === 'table') {
        setViewMode('cards');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await getMicroTaskApplicants(taskId);
        if (res.status === 200) {
          setApplicants(res.data);
          setSortedApplicants(sortApplicants(res.data, sortConfig));
          setCurrentPage(1);
        } else {
          throw new Error('Failed to fetch applicants');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [taskId]);

  const sortApplicants = (data, config) => {
    return [...data].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key, direction) => {
    const newConfig = { key, direction };
    setSortConfig(newConfig);
    setSortedApplicants(sortApplicants(applicants, newConfig));
    setCurrentPage(1); // Reset to first page when sorting
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedApplicants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedApplicants.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAssign = async (applicantId, name) => {
 
  const isConfirmed = window.confirm(`Are you sure you want to assign to ${name}?`);

  
  if (isConfirmed) {
    setIsProcessing(true);
    try {
      const res = await assignApplicantToTask(taskId, applicantId);
      if (res.status === 200) {
        setAssignedApplicantId(applicantId);
        toast.success(`Successfully assigned to ${name}`);
      } else {
        throw new Error(res.data?.message || 'Assignment failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  }
};
  const handleViewProfile = (applicant) => {
    // Implement navigation to profile page
   navigate(`/applicants/${applicant._id}`, { state: { applicant } });
  };

  const handleChat = (applicantId) => {
     <StartChatButton
        userId2={applicantId}
        jobId={taskId}
        className="chat-btn"
        />
  };

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = windowWidth < 640 ? 1 : 2; // Show fewer pages on mobile
      const range = [];
      const rangeWithDots = [];

      // Calculate range
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedApplicants.length)} of{' '}
          {sortedApplicants.length} applicants
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            aria-label="Previous page"
          >
            <FaChevronLeft className="text-xs" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => pageNum !== '...' && paginate(pageNum)}
              disabled={pageNum === '...'}
              className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : pageNum === '...'
                  ? 'bg-white text-gray-400 cursor-default'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            aria-label="Next page"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ProcessingOverlay message="Loading applicants..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer 
        position={windowWidth < 768 ? 'top-center' : 'top-right'}
        autoClose={5000}
      />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Applicants for Task #{taskId}
            </h1>
            {sortedApplicants.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {sortedApplicants.length} total applicants
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium flex items-center ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Card view"
            >
              <FaTh className="sm:mr-1" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium flex items-center ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              disabled={windowWidth < 768}
              aria-label="Table view"
            >
              <FaBars className="sm:mr-1" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {sortedApplicants.length > 0 ? (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {currentItems.map(applicant => (
                  <ApplicantScoreCard
                    key={applicant._id}
                    applicant={applicant}
                    onAssign={handleAssign}
                    onViewProfile={handleViewProfile}
                    onChat={handleChat}
                    isAssigned={assignedApplicantId === applicant._id}
                    isProcessing={isProcessing}
                    compact={windowWidth < 640}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <ApplicantScoreTable
                  applicants={currentItems}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onViewProfile={handleViewProfile}
                  onAssign={handleAssign}
                  isProcessing={isProcessing}
                  assignedApplicantId={assignedApplicantId}
                  isMobile={windowWidth < 768}
                />
              </div>
            )}
            
            {/* Pagination Controls */}
            <PaginationControls />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
            <p className="text-gray-500">No applicants found for this task.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      <ProcessingOverlay show={isProcessing} message="Processing assignment..." />
    </div>
  );
};

export default ApplicantsPage;