import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getSignedUrl,
  submitWorkForReview,
  sendFileToS3,
} from '../../APIS/API';

const WorkSubmissionModal = ({ isOpen, onClose, taskId }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files);

  // Avoid duplicate files by name (optional)
  const uniqueFiles = [
    ...files,
    ...newFiles.filter((newFile) => !files.some((f) => f.name === newFile.name))
  ];

  setFiles(uniqueFiles);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one file.');
      return;
    }

    setSubmitting(true);
    try {
      const fileKeys = [];

      for (const file of files) {
        const { data } = await getSignedUrl({
          taskId,
          filename: file.name,
          contentType: file.type,
        });

        await sendFileToS3(data.uploadURL, file);

        fileKeys.push({
          fileKey: data.fileKey,
        });
      }

      await submitWorkForReview(taskId, {
        message,
        fileKeys,
      });

      toast.success('Work submitted successfully!');
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setMessage('');
      setFiles([]);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Submit Work for Review
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <textarea
                    className="w-full border rounded p-2"
                    placeholder="Enter submission message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full"
                    onClick={(e) => (e.target.value = null)}
                  />

                  {/* Display selected files */}
                  {files.length > 0 && (
                   <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    {files.map((file, index) => (
                      <li
                    key={index}
                   className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                    >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 truncate">
                  <span className="truncate">📎 {file.name}</span>
                   <span className="text-xs text-gray-500">
                 ({(file.size / 1024).toFixed(1)} KB)
               </span>
               </div>
               <button
              type="button"
              onClick={() =>
              setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
             }
             className="ml-2 text-red-500 hover:text-red-700"
            title="Remove"
             >
            ✕
           </button>
            </li>
          ))}
           </ul>
            )}


                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {submitting ? 'Submitting...' : 'Submit Work'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WorkSubmissionModal;
