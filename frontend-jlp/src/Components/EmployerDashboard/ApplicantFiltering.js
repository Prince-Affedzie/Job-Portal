import React, { useState, useEffect } from "react";


export const useApplicantsFiltering = (applicants) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dateApplied");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
   const [scoreFilters, setScoreFilters] = useState({
    minTotalScore: null,
    minSkillsScore: null,
    minExperience: null
  });
  const applicantsPerPage = 10;

  // Get status counts for the filter tabs
  const getStatusCounts = () => {
    const statusMap = {
      all: applicants.length,
      new: 0,
      reviewing: 0,
      shortlisted: 0, 
      interviewing: 0,
      offered: 0,
      rejected: 0
    };
    
    applicants.forEach(applicant => {
      const normalizedStatus = applicant.status.toLowerCase();
      if (normalizedStatus === "new") statusMap.new++;
      else if (normalizedStatus.includes("review")) statusMap.reviewing++;
      else if (normalizedStatus.includes("shortlist")) statusMap.shortlisted++;
      else if (normalizedStatus.includes("interview")) statusMap.interviewing++;
      else if (normalizedStatus.includes("offer")) statusMap.offered++;
      else if (normalizedStatus.includes("reject")) statusMap.rejected++;
    });
    
    return statusMap;
  };

  // Filter and sort applicants
   const filteredApplicants = applicants
    .filter(applicant => {
      // Status filter
      const statusMatch = filterStatus === "all" || 
                         applicant.status.toLowerCase() === filterStatus.toLowerCase();
      
      // Search term filter
      const searchMatch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Score filters
      const totalScoreMatch = scoreFilters.minTotalScore === null || 
                             (applicant.totalScore >= scoreFilters.minTotalScore);
      const skillsScoreMatch = scoreFilters.minSkillsScore === null || 
                             (applicant.skillsScore >= scoreFilters.minSkillsScore);
      const experienceMatch = scoreFilters.minExperience === null || 
                            (applicant.workExperience?.length >= scoreFilters.minExperience);
      
      return statusMatch && searchMatch && totalScoreMatch && skillsScoreMatch && experienceMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "dateApplied":
          comparison = new Date(a.dateApplied) - new Date(b.dateApplied);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "totalScore":
          comparison = (a.totalScore || 0) - (b.totalScore || 0);
          break;
        case "skillsScore":
          comparison = (a.skillsScore || 0) - (b.skillsScore || 0);
          break;
        case "experience":
          comparison = (a.workExperinceScore|| 0) - (b.workExperinceScore || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    scoreFilters,
    setScoreFilters,
    statusCounts: getStatusCounts(),
    filteredApplicants,
    currentApplicants,
    totalPages
  };
};
