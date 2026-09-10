import { DATAVIZ } from "../lib/colors";

// Cubo isometrico con le tre dimensioni del framework ASTP/NAAC:
// asse verticale = Input / Output / Impatto
// asse orizzontale = Interno / Esterno
// profondita' = Canali di trasferimento (brevetti, licenze, spin-off, formazione...)
export default function KttMetricsCube({ active, onSelect }) {
  const FACES = [
    { id: "input", label: "INPUT", sub: "risorse che permettono il trasferimento", color: DATAVIZ.d1 },
    { id: "output", label: "OUTPUT", sub: "quello che l'ufficio produce", color: DATAVIZ.d2 },
    { id: "impatto", label: "IMPATTO", sub: "l'effetto reale generato", color: DATAVIZ.d5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[340px] mx-auto">
        {/* faccia superiore: Impatto */}
        <polygon points="60,70 160,20 260,70 160,120"
          fill={active === "impatto" ? DATAVIZ.d5 : "#FFD9D2"} stroke="#161616" strokeWidth="1.5"
          className="cursor-pointer" onClick={() => onSelect("impatto")} />
        {/* faccia sinistra: Input (interno) */}
        <polygon points="60,70 160,120 160,230 60,180"
          fill={active === "input" ? DATAVIZ.d1 : "#DCF0C9"} stroke="#161616" strokeWidth="1.5"
          className="cursor-pointer" onClick={() => onSelect("input")} />
        {/* faccia destra: Output (esterno) */}
        <polygon points="260,70 160,120 160,230 260,180"
          fill={active === "output" ? DATAVIZ.d2 : "#CFEAE6"} stroke="#161616" strokeWidth="1.5"
          className="cursor-pointer" onClick={() => onSelect("output")} />

        <text x="160" y="72" textAnchor="middle" fontSize="12" fontWeight={800} fill="#161616">IMPATTO</text>
        <text x="95" y="155" textAnchor="middle" fontSize="12" fontWeight={800} fill="#161616" transform="rotate(-28 95 155)">INPUT</text>
        <text x="225" y="155" textAnchor="middle" fontSize="12" fontWeight={800} fill="#161616" transform="rotate(28 225 155)">OUTPUT</text>

        {/* assi */}
        <line x1="160" y1="230" x2="160" y2="300" stroke="#161616" strokeWidth="1.2" markerEnd="url(#arrow)" />
        <text x="160" y="315" textAnchor="middle" fontSize="10" fill="#6B6B68">interno ↔ esterno</text>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#161616" />
          </marker>
        </defs>
      </svg>

      <div className="space-y-3">
        {FACES.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`w-full text-left p-3.5 rounded-xl2 border transition-colors ${active === f.id ? "border-ink bg-tint/60" : "border-line bg-white hover:bg-tint/30"}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-3 h-3 rounded-full" style={{ background: f.color }} />
              <span className="text-[13px] font-bold">{f.label}</span>
            </div>
            <p className="text-[12px] text-muted">{f.sub}</p>
          </button>
        ))}
        <p className="text-[11.5px] text-muted pt-1">
          Terza dimensione (profondita' del cubo, non disegnata separatamente): i <b>canali</b> di trasferimento — brevetti, licenze, spin-off, formazione continua, consulenza, ricerca collaborativa. Ogni cella del cubo è una combinazione possibile, ad esempio "input interno del canale spin-off" = budget dedicato dall'ufficio alla creazione di nuove imprese.
        </p>
      </div>
    </div>
  );
}
