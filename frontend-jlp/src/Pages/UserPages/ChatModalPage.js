// src/components/ChatModal.jsx
import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import ChatApp from '../../Components/MyComponents/Chat';

Modal.setAppElement('#root');

const ChatModal2 = ({ isOpen, onClose, targetUserId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 50,
        },
        content: {
          position: 'fixed',
          bottom: '0',
          right: '0',
          left: 'auto',
          top: 'auto',
          margin: '0',
          padding: '0',
          border: 'none',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '24rem',
          height: '90vh',
          maxHeight: '36rem',
          overflow: 'hidden',
          background: 'transparent',
        },
      }}
    >
      <div className="bg-white h-full rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Chat</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg font-bold"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-grow overflow-hidden">
          <ChatApp targetUserId={targetUserId} />
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal2;
