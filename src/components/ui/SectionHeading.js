export default function SectionHeading({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="section-heading">{children}</h2>
      {action && (
        <a
          href={action.href}
          className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
        >
          {action.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
