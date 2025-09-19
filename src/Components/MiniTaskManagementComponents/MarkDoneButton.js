import React, { useState } from "react";
import {
  markTaskAsDoneTasker,
  markTaskAsDoneClient,
  unmarkTaskAsDoneTasker,
  unmarkTaskAsDoneClient,
} from "../../APIS/microTaskApi";
import { toast } from "react-toastify";

const MarkDoneSwitch = ({ taskId, userRole, initialMarked }) => {
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState(initialMarked);
  console.log(marked)

  const handleToggle = async () => {
    setLoading(true);
    try {
      let response;
      if (marked) {
        // undo
        response =
          userRole === "client"
            ? await unmarkTaskAsDoneClient(taskId)
            : await unmarkTaskAsDoneTasker(taskId);

        if (response.status === 200) {
          setMarked(false);
          toast.info("Marked as undone.");
        }
      } else {
        // mark as done
        response =
          userRole === "client"
            ? await markTaskAsDoneClient(taskId)
            : await markTaskAsDoneTasker(taskId);

        if (response.status === 200) {
          setMarked(true);
          toast.success("Task marked as done!");
        }
      }
    } catch (err) {
      console.error("Error toggling done state:", err);
      toast.error("Failed to update status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">
        {marked ? "Done" : "Mark as Done"}
      </span>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          marked ? "bg-green-600" : "bg-gray-300"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            marked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default MarkDoneSwitch;
