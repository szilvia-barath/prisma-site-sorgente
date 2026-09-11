import { Search, Printer } from "lucide-react";

export default function Topbar({ query, setQuery, title, subtitle }) {
  return (
    <header className="app-topbar sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-line">
      <div className="px-8 py-4 flex items-center justify-between gap-6">
        <div>
          <h1 className="text-[19px] font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca in tutto il sito..."
              className="pl-8 pr-3 py-2 text-[13.5px] rounded-full border border-line bg-white w-[240px] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-full border border-line bg-white hover:bg-tint"
            title="Stampa"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
