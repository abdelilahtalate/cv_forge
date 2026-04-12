export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up px-4 md:px-0">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className="fa-solid fa-wand-magic-sparkles text-white text-xs" />
      </div>
      <div className="bg-[#1c1c21] border border-[#27272a] rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
