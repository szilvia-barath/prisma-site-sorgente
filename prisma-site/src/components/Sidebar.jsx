import {
  LayoutDashboard, BookOpen, Network, ListChecks, FileStack,
  GraduationCap, Database, Focus, Rows3, Gauge, Library, UserCircle2,
} from "lucide-react";

const ITEMS = [
  { id: "home", label: "Cruscotto", icon: LayoutDashboard },
  { id: "kb", label: "Base di conoscenza", icon: BookOpen },
  { id: "metrics", label: "Metriche KTT", icon: Gauge },
  { id: "ecosystem", label: "Ecosistema", icon: Network },
  { id: "proposal", label: "Proposta operativa", icon: ListChecks },
  { id: "sop", label: "Libreria SOP", icon: FileStack },
  { id: "fonti", label: "Fonti", icon: Library },
  { id: "exam", label: "Preparazione esame", icon: GraduationCap },
  { id: "cv", label: "CV & STAR", icon: UserCircle2 },
  { id: "data", label: "Dati ed esportazione", icon: Database },
];

export default function Sidebar({ view, setView, density, setDensity, focus, setFocus }) {
  return (
    <aside className="app-sidebar fixed left-0 top-0 h-screen w-[236px] bg-ink text-bg flex flex-col z-20">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-ink font-extrabold text-sm">P</div>
          <div>
            <div className="font-semibold text-[15px] leading-tight">PR.I.S.MA. KB</div>
            <div className="text-[11px] text-white/50 leading-tight">selezione 2026_12 TD</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] transition-colors ${
                active ? "bg-white/10 text-accent font-medium" : "text-white/75 hover:bg-white/5"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {it.label}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => setDensity(density === "ariosa" ? "compatta" : "ariosa")}
          className="w-full flex items-center gap-2 text-[12.5px] text-white/70 hover:text-white"
        >
          <Rows3 size={15} /> Densita': {density}
        </button>
        <button
          onClick={() => setFocus(!focus)}
          className="w-full flex items-center gap-2 text-[12.5px] text-white/70 hover:text-white"
        >
          <Focus size={15} /> Modalita' focus
        </button>
      </div>
    </aside>
  );
}
