import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const statuses = [
  "Pending",
  "Accepted",
  "Rejected",
  "Completed",
  "Reviewing",
  "Shortlisted",
  "Offered",
  "Interviewing",
];

const BulkStatusModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSubmit = () => {
    if (!selectedStatus) return;
    onSubmit(selectedStatus);
    setSelectedStatus("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold mb-4">Update Application Status</h2>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {statuses.map((status) => (
            <label
              key={status}
              className="block px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <input
                type="radio"
                name="status"
                value={status}
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
                className="mr-2"
              />
              {status}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkStatusModal;
