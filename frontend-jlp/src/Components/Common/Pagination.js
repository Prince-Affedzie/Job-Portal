import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationGroup = () => {
    let pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, 5, "...", totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page === "...") return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center mt-8 space-x-2 mb-10">
      
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-semibold rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPaginationGroup().map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={page === "..."}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition
            ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }
            ${page === "..." ? "cursor-default pointer-events-none" : ""}
          `}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-semibold rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
