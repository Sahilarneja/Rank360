export default function InsightBox({ children, title = "What it means for students" }) {
  return (
    <div className="insight-card my-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎓</span>
        <h3 className="text-[15px] font-bold text-brand-blue">{title}</h3>
      </div>
      <div className="text-[15px] text-[#1e3a5f] leading-relaxed">{children}</div>
    </div>
  );
}
