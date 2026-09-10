export default function StatCard({ label, value, sub, tone = "tint" }) {
  const tones = {
    tint: "bg-tint text-ink",
    accent: "bg-accent text-ink",
    dark: "bg-ink text-bg",
    white: "bg-white text-ink border border-line",
  };
  return (
    <div className={`density-p rounded-xl2 p-5 ${tones[tone]} card`}>
      <div className="text-[27px] font-extrabold tracking-tight leading-none">{value}</div>
      <div className="text-[12.5px] mt-2 opacity-80 leading-snug">{label}</div>
      {sub && <div className="text-[11.5px] mt-1 opacity-60">{sub}</div>}
    </div>
  );
}
