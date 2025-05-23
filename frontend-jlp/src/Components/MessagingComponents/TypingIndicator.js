export const TypingIndicator = () => (
  <div className="flex items-center gap-1 text-sm text-gray-500 pl-2 py-2">
    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
      <span className="text-sm">✎</span>
    </div>
    <div className="flex gap-1">
      <span className="animate-bounce delay-0">•</span>
      <span className="animate-bounce delay-100">•</span>
      <span className="animate-bounce delay-200">•</span>
    </div>
  </div>
);