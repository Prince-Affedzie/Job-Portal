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
  hasFile = false,
  isUploading = false,
}) => {
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Handle emoji picker outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [text]);

  const onEmojiClick = (emojiData) => {
    const emojiChar = emojiData?.emoji || "";
    if (!emojiChar) return;

    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + emojiChar + after;

    setText(newText);
    const newCursorPos = before.length + emojiChar.length;
    setCursorPosition(newCursorPos);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    handleTyping?.();
  };

  const handleSendMessage = () => {
    if (text.trim() || hasFile) {
      handleSend();
      setText(""); // Always clear input after send
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = (text.trim() || hasFile) && !disabled;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef} 
          className="absolute bottom-full mb-2 left-0 z-50 shadow-lg rounded-lg overflow-hidden"
        >
          <EmojiPicker 
            onEmojiClick={onEmojiClick} 
            width={300}
            height={350}
            searchDisabled
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* Input container */}
      <div className="flex items-end gap-2 bg-white rounded-2xl p-2 pl-3 border border-gray-200 hover:border-gray-300 transition-colors">
        {/* Emoji button */}
        <button
          onClick={() => setShowEmojiPicker(v => !v)}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-blue-500 disabled:text-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* File attachment button */}
        <button
          onClick={triggerFileInput}
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-blue-500 disabled:text-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextareaChange}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={disabled ? "Please wait..." : "Type a message..."}
          disabled={disabled}
          className="flex-1 max-h-32 px-3 py-2 text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none resize-none disabled:opacity-50 scrollbar-none"
        />

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={!canSend}
          className={`p-2 rounded-full transition-all ${
            canSend
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};