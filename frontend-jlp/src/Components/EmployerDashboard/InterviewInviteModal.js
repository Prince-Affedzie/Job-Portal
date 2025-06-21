import { useState } from "react";
import { scheduleAnInterview } from "../../APIS/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterviewInviteModal = ({ isOpen, onClose, selectedApplicants, jobId }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedApplicants.length === 0) {
      return alert("No applicants selected.");
    }
    const invitationsTo = selectedApplicants.map(app=>app.userId)
    const applications = selectedApplicants.map(app=>app.applicationId)
   

    setLoading(true);
    try {
    const response =  await scheduleAnInterview({
        invitationsTo:  invitationsTo,
        applications:applications,
        jobId,
        interviewDate:interviewDate,
        interviewTime:interviewTime,
        location:location

      });
if(response.status ===200){
  setSuccess(true);
  toast.success('Interview Invitation Sent Successfully')
}
else{
   toast.error(response.errorMessage || `Operation failed.`);
}
   } catch (error) {
     toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Send Interview Invitation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Interview Date</label>
            <input
              type="date"
              required
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Interview Time</label>
            <input
              type="time"
              required
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>

          {success && (
            <p className="text-green-600 mt-2 text-center">Invitations sent successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default InterviewInviteModal;
