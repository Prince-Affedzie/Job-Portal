import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {getSignedUrl,submitWorkForReview,sendFileToS3} from '../../APIS/API'


const WorkSubmissionModal = ({ isOpen, onClose, taskId }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fileKeys = [];

      for (const file of files) {
        // Step 1: Get signed URL from your backend
        const { data } = await getSignedUrl({
          taskId,
          filename: file.name,
          contentType: file.type,
        });

        // Step 2: Upload file to S3 directly
        console.log(data)
        console.log(file)
        await sendFileToS3(data.uploadURL,file)

       fileKeys.push({
          fileKey: data.fileKey,
        });
      }

      // Step 3: Submit metadata (fileKeys and message) to your backend
      await submitWorkForReview(taskId,{
        message,
        fileKeys: fileKeys,
      });

      toast.success('Work submitted successfully!');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
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
                  />

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
