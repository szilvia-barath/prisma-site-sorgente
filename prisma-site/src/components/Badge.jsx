export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-tint text-ink",
    good: "bg-[#61B136]/15 text-[#3f7223]",
    warn: "bg-[#FFB3AD]/40 text-[#8a2f27]",
    info: "bg-[#FFF0A6]/60 text-[#7a6412]",
    dark: "bg-ink text-bg",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SourceNote({ title = "Fonte", children }) {
  return (
    <div className="source-rail">
      <b className="block text-ink font-semibold mb-0.5">{title}</b>
      {children}
    </div>
  );
}

export function Block({ children, source }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px] gap-6 mb-8 items-start">
      <div className="min-w-0">{children}</div>
      {source && <SourceNote>{source}</SourceNote>}
    </div>
  );
}
