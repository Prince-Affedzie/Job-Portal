import React, { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export const MessageInput = ({
  text = "",
  setText,
  handleSend,
  handleTyping,
  triggerFileInput,
  disabled = false,
  hasFile = false, // New prop to track if a file is selected
}) => {
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = isMobile ? 100 : 120;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [text, isMobile]);

  const onEmojiClick = (emojiData, event) => {
    const emojiChar = emojiData?.emoji || "";
    if (!emojiChar) return;

    const before = (text || "").slice(0, cursorPosition);
    const after = (text || "").slice(cursorPosition);
    const newText = before + emojiChar + after;

    setText(newText);
    const newCursorPos = before.length + emojiChar.length;
    setCursorPosition(newCursorPos);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    if (isMobile) setShowEmojiPicker(false);
  };

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    if (handleTyping) handleTyping();
  };

  const handleTextareaClick = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const handleSendMessage = () => {
    if (text.trim() || hasFile) {
      handleSend();
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Check if send button should be enabled
  const canSend = (text.trim() || hasFile) && !disabled;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full mb-3 z-50 shadow-lg rounded-xl bg-white overflow-hidden"
          style={{
            left: isMobile ? 8 : 0,
            maxWidth: isMobile ? "calc(100vw - 16px)" : 320,
          }}
          aria-label="Emoji picker"
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* Input Container */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl">
        <div className="flex items-end gap-1 px-4 py-3">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            aria-label="Toggle emoji picker"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200"
          >
            <Smile size={22} />
          </button>

          {/* File Attachment Button */}
          <button
            type="button"
            onClick={triggerFileInput}
            aria-label="Attach file"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200"
          >
            <Paperclip size={22} />
          </button>

          {/* Text Input */}
          <div className="flex-1 mx-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onClick={handleTextareaClick}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message..."
              className="w-full resize-none min-h-[24px] max-h-[120px] bg-transparent text-gray-800 text-base placeholder-gray-400 outline-none leading-6"
              style={{ 
                 scrollbarWidth: 'none',
                 msOverflowStyle: 'none',
                 scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
              }}
              aria-label="Message input"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!canSend}
            aria-label="Send message"
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
              canSend
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};