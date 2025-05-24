import React, { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, Smile, Search } from 'lucide-react';

// Emoji data organized by categories
const EMOJI_DATA = {
  'Smileys & People': [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
    '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪',
    '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒',
    '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'
  ],
  'Animals & Nature': [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮',
    '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣',
    '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌',
    '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙',
    '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅'
  ],
  'Food & Drink': [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭',
    '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕',
    '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳',
    '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪',
    '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣'
  ],
  'Objects': [
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽',
    '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️',
    '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️',
    '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸',
    '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧'
  ],
  'Symbols': [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
    '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
    '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌',
    '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️',
    '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️'
  ]
};

// Frequently used emojis
const FREQUENT_EMOJIS = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '😊', '😢', '😮'];

export const MessageInput = ({
  text,
  setText,
  handleSend,
  handleTyping,
  triggerFileInput,
  disabled,
}) => {
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Frequently Used');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Track viewport width for responsive positioning
  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const isMobile = viewportWidth < 768;
  const isSmallMobile = viewportWidth < 400;

  // Auto-resize logic with better mobile handling
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isMobile ? 100 : 120;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [text, isMobile]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close emoji picker on mobile when keyboard appears or orientation changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isMobile && showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    window.addEventListener('resize', handleVisibilityChange);
    window.addEventListener('orientationchange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('resize', handleVisibilityChange);
      window.removeEventListener('orientationchange', handleVisibilityChange);
    };
  }, [showEmojiPicker, isMobile]);

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    handleTyping();
  };

  const handleTextareaClick = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const insertEmoji = (emoji) => {
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + emoji + after;
    setText(newText);
    
    const newCursorPos = cursorPosition + emoji.length;
    setCursorPosition(newCursorPos);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    // Close picker on mobile after emoji selection
    if (isMobile) {
      setShowEmojiPicker(false);
    }
  };

  const getFilteredEmojis = (category) => {
    const emojis = category === 'Frequently Used' ? FREQUENT_EMOJIS : EMOJI_DATA[category] || [];
    if (!emojiSearch) return emojis;
    return emojis.filter(emoji => emoji.includes(emojiSearch));
  };

  const categories = ['Frequently Used', ...Object.keys(EMOJI_DATA)];

  const handleSendMessage = () => {
    if (text.trim()) {
      handleSend();
      setShowEmojiPicker(false);
    }
  };

  const getCategoryDisplayName = (category) => {
    if (category === 'Frequently Used') return isSmallMobile ? '⭐' : isMobile ? '⭐ Frequent' : '⭐ Frequently Used';
    if (isSmallMobile) {
      // Very short names for small screens
      const veryShortNames = {
        'Smileys & People': '😊',
        'Animals & Nature': '🐶',
        'Food & Drink': '🍕',
        'Objects': '📱',
        'Symbols': '❤️'
      };
      return veryShortNames[category] || category;
    }
    if (isMobile) {
      // Shortened category names for mobile
      const shortNames = {
        'Smileys & People': '😊 Faces',
        'Animals & Nature': '🐶 Animals',
        'Food & Drink': '🍕 Food',
        'Objects': '📱 Objects',
        'Symbols': '❤️ Symbols'
      };
      return shortNames[category] || category;
    }
    return category;
  };

  // Calculate dynamic emoji picker dimensions
  const getPickerStyles = () => {
    const padding = 16; // 8px on each side
    const maxWidth = Math.min(viewportWidth - padding, 400); // Never exceed viewport width
    
    if (isMobile) {
      return {
        left: '8px',
        right: '8px',
        width: 'auto',
        maxWidth: `${maxWidth}px`,
        height: '288px' // 18rem
      };
    } else {
      return {
        left: '0',
        width: `${Math.min(320, maxWidth)}px`,
        height: '384px' // 24rem
      };
    }
  };

  const pickerStyles = getPickerStyles();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Emoji Picker - Fully responsive positioning and sizing */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50"
          style={pickerStyles}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search emojis..."
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Tabs - Responsive horizontal scroll */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 scrollbar-hide flex-shrink-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-2 py-2 text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === category
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ minWidth: isSmallMobile ? '32px' : 'auto' }}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>

          {/* Emoji Grid - Responsive grid that adapts to container width */}
          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            <div className={`grid gap-1 ${
              isSmallMobile ? 'grid-cols-6' : isMobile ? 'grid-cols-8' : 'grid-cols-8'
            }`}>
              {getFilteredEmojis(activeCategory).map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-lg active:scale-95"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {getFilteredEmojis(activeCategory).length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No emojis found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Container - Constrained to prevent overflow */}
      <div className="p-2 sm:p-3 bg-white border-t border-gray-200">
        <div className="flex gap-1 sm:gap-2 items-end max-w-full">
          {/* Action Buttons Container - Fixed minimum width */}
          <div className="flex gap-1 flex-shrink-0" style={{ minWidth: '80px' }}>
            {/* Attachment Button */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation flex-shrink-0 flex items-center justify-center"
              aria-label="Attach file"
            >
              <Paperclip size={18} />
            </button>

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`w-9 h-9 rounded-full transition-colors touch-manipulation flex-shrink-0 flex items-center justify-center ${
                showEmojiPicker 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Add emoji"
            >
              <Smile size={18} />
            </button>
          </div>

          {/* Text Input Container - Flexible but constrained */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onClick={handleTextareaClick}
              onKeyUp={handleTextareaClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full border border-gray-300 rounded-full px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all min-h-[40px] scrollbar-hide"
              placeholder="Type a message..."
              rows={1}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                maxWidth: '100%'
              }}
            />
          </div>

          {/* Send Button - Fixed width */}
          <div className="flex-shrink-0" style={{ minWidth: '44px' }}>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={disabled || !text.trim()}
              className={`w-11 h-11 rounded-full transition-all touch-manipulation flex-shrink-0 flex items-center justify-center ${
                disabled || !text.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg active:scale-95 shadow-md'
              }`}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};