import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicantScoreCard from './ApplicantScoreCard';
import ApplicantScoreTable from './ApplicantScoreTable';
import { useAssignmentGuide } from './AssignmentSuccessGuide';
import BidCard from './BidCard'; // You'll need to create this
import BidTable from './BidTable'; // You'll need to create this
import { getMicroTaskApplicants, getMicroTaskBids, assignApplicantToTask, acceptBidForTask,getMiniTaskInfo } from '../../APIS/API';
import StartChatButton from "../MessagingComponents/StartChatButton";

import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import ProcessingOverlay from '../Common/ProcessingOverLay';
import { FaBars, FaTh, FaChevronLeft, FaChevronRight, FaMoneyBillWave, FaUserFriends } from 'react-icons/fa';

const ApplicantsPage = () => {
  const { taskId } = useParams();
  const { state } = useLocation();
  const [biddingType, setBiddingType] = useState('fixed'); // Default to fixed
  const [applicants, setApplicants] = useState([]);
  const [bids, setBids] = useState([]);
  const [displayData, setDisplayData] = useState([]); // Will hold either applicants or bids based on biddingType
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'desc' });
  const [viewMode, setViewMode] = useState(() => 
    window.innerWidth < 768 ? 'cards' : 'table'
  );
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignedApplicantId, setAssignedApplicantId] = useState(state?.assignedTo?._id || null);
  const [acceptedBidId, setAcceptedBidId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = windowWidth < 768 ? 8 : 12;

  const [isOpen, setIsOpen] = useState(false);
  const { showGuide, hideGuide, Guide } = useAssignmentGuide();

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
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        
        // First, get task details to determine bidding type
        const taskRes = await getMiniTaskInfo(taskId); // You'll need to implement this API call
        if (taskRes.status === 200) {
          setBiddingType(taskRes.data.biddingType);
          
          // Fetch appropriate data based on bidding type
          if (taskRes.data.biddingType === 'fixed') {
            const res = await getMicroTaskApplicants(taskId);
            if (res.status === 200) {
              setApplicants(res.data);
              setDisplayData(res.data);
              setSortedData(sortData(res.data, sortConfig));
            } else {
              throw new Error('Failed to fetch applicants');
            }
          } else { // open-bid
            const res = await getMicroTaskBids(taskId); // You'll need to implement this API call
            if (res.status === 200) {
              setBids(res.data);
              setDisplayData(res.data);
              setSortedData(sortData(res.data, sortConfig));
            } else {
              throw new Error('Failed to fetch bids');
            }
          }
        } else {
          throw new Error('Failed to fetch task details');
        }
        
        setCurrentPage(1);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskData();
  }, [taskId]);

  const sortData = (data, config) => {
    return [...data].sort((a, b) => {
      // Handle different sorting for bids vs applicants
      if (biddingType === 'open-bid') {
        // For bids, we might sort by amount, timeline, etc.
        if (config.key === 'amount') {
          return config.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        }
        // Default sorting for bids
        if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
        if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      } else {
        // For applicants, use existing sorting logic
        if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
        if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key, direction) => {
    const newConfig = { key, direction };
    setSortConfig(newConfig);
    setSortedData(sortData(displayData, newConfig));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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
          showGuide("assignment", name);
        } else {
          throw new Error(res.data?.message || 'Assignment failed');
        }
      } catch (error) {
        const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "An unexpected error occurred. Please try again.";
                
              toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAcceptBid = async (bidId, bidderName) => {
    const isConfirmed = window.confirm(`Are you sure you want to accept ${bidderName}'s bid?`);
    
    if (isConfirmed) {
      setIsProcessing(true);
      try {
        const res = await acceptBidForTask(taskId, bidId); // You'll need to implement this API call
        if (res.status === 200) {
          setAcceptedBidId(bidId);
          toast.success(`Successfully accepted ${bidderName}'s bid`);
          showGuide("bid", bidderName);
        } else {
          throw new Error(res.data?.message || 'Bid acceptance failed');
        }
      } catch (error) {
        const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "An unexpected error occurred. Please try again.";
                
              toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleViewProfile = (applicant) => {
    
    navigate(`/applicants/${applicant._id}`, { state: {applicant: applicant } });
  };

  const handleChat = (userData) => {
    const userId = biddingType === 'fixed' ? userData._id : userData.bidder._id;
    return <StartChatButton
      userId2={userId}
      jobId={taskId}
      className="chat-btn"
    />;
  };

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = windowWidth < 640 ? 1 : 2;
      const range = [];
      const rangeWithDots = [];

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
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of{' '}
          {sortedData.length} {biddingType === 'fixed' ? 'applicants' : 'bids'}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
         <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Please wait</h2>
          <p className="text-gray-600">Loading Applicants</p>
        </div>
      </div>
    </div>
  );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div className="flex-1 overflow-auto">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <ToastContainer 
          position={windowWidth < 768 ? 'top-center' : 'top-right'}
          autoClose={5000}
        />
        
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {biddingType === 'fixed' ? 'Applicants' : 'Bids'} for Task #{taskId}
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {biddingType === 'fixed' ? 'Fixed Price' : 'Open Bid'}
              </span>
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

          {sortedData.length > 0 ? (
            <>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {currentItems.map(item => (
                    biddingType === 'fixed' ? (
                      <ApplicantScoreCard
                        key={item._id}
                        applicant={item}
                        onAssign={handleAssign}
                        onViewProfile={handleViewProfile}
                        onChat={handleChat}
                        isAssigned={assignedApplicantId === item._id}
                        isProcessing={isProcessing}
                        compact={windowWidth < 640}
                      />
                    ) : (
                      <BidCard
                        key={item._id}
                        bid={item}
                        onAccept={handleAcceptBid}
                        onViewProfile={handleViewProfile}
                        onChat={handleChat}
                        isAccepted={acceptedBidId === item._id}
                        isProcessing={isProcessing}
                        compact={windowWidth < 640}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  {biddingType === 'fixed' ? (
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
                  ) : (
                    <BidTable
                      bids={currentItems}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      onViewProfile={handleViewProfile}
                      onAccept={handleAcceptBid}
                      isProcessing={isProcessing}
                      acceptedBidId={acceptedBidId}
                      isMobile={windowWidth < 768}
                    />
                  )}
                </div>
              )}
              
              <PaginationControls />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
              {biddingType === 'fixed' ? (
                <>
                  <FaUserFriends className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">No applicants found for this task.</p>
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">No bids found for this task.</p>
                </>
              )}
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Refresh
              </button>
            </div>
          )}
        </main>

        <ProcessingOverlay show={isProcessing} message="Processing..." />
        <Guide />
      </div>
    </div>
  );
};

export default ApplicantsPage;