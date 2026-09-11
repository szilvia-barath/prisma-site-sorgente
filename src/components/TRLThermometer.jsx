import { DATAVIZ } from "../lib/colors";

const LEVELS = [
  { n: 9, label: "Sistema provato in ambiente operativo", group: "Test, lancio e operazioni di sistema" },
  { n: 8, label: "Sistema completo e qualificato", group: "Sviluppo di sistema/sottosistema" },
  { n: 7, label: "Dimostrazione del prototipo in ambiente operativo", group: "Sviluppo di sistema/sottosistema" },
  { n: 6, label: "Dimostrazione in ambiente rilevante", group: "Dimostrazione della tecnologia" },
  { n: 5, label: "Validazione in ambiente rilevante", group: "Dimostrazione della tecnologia" },
  { n: 4, label: "Validazione in laboratorio", group: "Sviluppo della tecnologia" },
  { n: 3, label: "Proof of concept sperimentale", group: "Sviluppo della tecnologia" },
  { n: 2, label: "Concetto tecnologico formulato", group: "Ricerca per dimostrare la fattibilita'" },
  { n: 1, label: "Principi di base osservati", group: "Ricerca tecnologica di base" },
];

const GROUP_COLOR = {
  "Test, lancio e operazioni di sistema": DATAVIZ.d1,
  "Sviluppo di sistema/sottosistema": DATAVIZ.d2,
  "Dimostrazione della tecnologia": DATAVIZ.d3,
  "Sviluppo della tecnologia": DATAVIZ.d4,
  "Ricerca per dimostrare la fattibilita'": DATAVIZ.d5,
  "Ricerca tecnologica di base": DATAVIZ.d6,
};

export default function TRLThermometer({ highlight }) {
  const h = 36; // altezza per livello
  const top = 20;
  return (
    <div className="flex gap-6 items-start">
      <svg viewBox={`0 0 90 ${top + h * 9 + 60}`} width={110} className="shrink-0">
        <defs>
          <linearGradient id="trlGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E4436B" />
            <stop offset="100%" stopColor="#FCFCFC" />
          </linearGradient>
        </defs>
        <rect x="30" y={top} width="30" height={h * 9} rx="15" fill="url(#trlGrad)" stroke="#161616" strokeWidth="1.5" />
        <circle cx="45" cy={top + h * 9 + 22} r="22" fill="#E4436B" stroke="#161616" strokeWidth="1.5" />
        {LEVELS.map((l, i) => {
          const y = top + h * i;
          const active = highlight === l.n;
          return (
            <g key={l.n}>
              <line x1="30" y1={y} x2="60" y2={y} stroke="#161616" strokeOpacity="0.25" />
              <text x="45" y={y + h / 2 + 4} textAnchor="middle" fontSize={active ? 13 : 11} fontWeight={700}
                fill={i < 3 ? "#161616" : "#fff"}>
                {l.n}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex-1 space-y-1.5">
        {[...LEVELS].reverse().map((l) => (
          <div key={l.n} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 ${highlight === l.n ? "bg-tint" : ""}`}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GROUP_COLOR[l.group] }} />
            <span className="text-[11.5px] font-bold w-5 shrink-0">TRL{l.n}</span>
            <span className="text-[12px] text-ink/80">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
