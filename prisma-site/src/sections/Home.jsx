import { useMemo } from "react";
import { useCsv } from "../lib/useCsv";
import { getSlice } from "../lib/store";
import StatCard from "../components/StatCard";
import { Badge, Block } from "../components/Badge";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { STATUS_COLOR, LEVEL_COLOR } from "../lib/colors";
import AnimatedList from "../components/reactbits/AnimatedList";
import {
  BookOpen, Gauge, Network, ListChecks, FileStack, Library, GraduationCap, Database, ArrowRight,
} from "lucide-react";

function daysUntil(iso) {
  return Math.ceil((new Date(iso) - new Date()) / 86400000);
}

const QUICK_LINKS = [
  { id: "kb", label: "Base di conoscenza", desc: "teoria, contesto, fonti normative", icon: BookOpen },
  { id: "metrics", label: "Metriche KTT", desc: "il cubo metriche, PoC/PoV, TRL, opt-out, standardizzazione", icon: Gauge },
  { id: "ecosystem", label: "Ecosistema", desc: "visualizzazione, mappa, opportunita' di connessione", icon: Network },
  { id: "proposal", label: "Proposta operativa", desc: "fasi, rischi, indicatori", icon: ListChecks },
  { id: "sop", label: "Libreria SOP", desc: "procedure operative vive", icon: FileStack },
  { id: "fonti", label: "Fonti", desc: "bibliografia annotata", icon: Library },
  { id: "exam", label: "Preparazione esame", desc: "programma, numeri, domande", icon: GraduationCap },
  { id: "data", label: "Dati ed esportazione", desc: "esportazione dei dati", icon: Database },
];

export default function Home({ setView }) {
  const stakeholders = useCsv("01_stakeholder_ecosistema.csv");
  const connections = useCsv("02_connessioni_ecosistema.csv");
  const sops = useCsv("10_libreria_sop.csv");
  const fonti = useCsv("04_fonti.csv");
  const glossario = useCsv("03_glossario_concetti.csv");
  const azioni = useCsv("09_fasi_progetto_proposta_kt.csv");

  const g = daysUntil("2026-09-11T10:00:00");

  const connByStatus = useMemo(() => {
    if (!connections.rows) return [];
    const counts = { esistente: 0, lacuna: 0, ipotizzata: 0 };
    connections.rows.forEach((r) => { if (counts[r.stato] !== undefined) counts[r.stato]++; });
    return Object.entries(counts).map(([stato, valore]) => ({ stato, valore }));
  }, [connections.rows]);

  const stakeByLevel = useMemo(() => {
    if (!stakeholders.rows) return [];
    const counts = {};
    stakeholders.rows.forEach((r) => { counts[r.livello] = (counts[r.livello] || 0) + 1; });
    return Object.entries(counts).map(([livello, valore]) => ({ livello, valore }));
  }, [stakeholders.rows]);

  return (
    <div className="max-w-[1180px]">
      {/* Progetto: chi, cosa, come */}
      <Block source="Bando 2026_12 TD, descrizione del progetto e obiettivi; Bando MIMIT UTT 2025-2027.">
        <h2 className="text-[16px] font-semibold mb-2">Proprieta' Intellettuale e Scouting Multidisciplinare (PR.I.S.MA.)</h2>
        <p className="text-[13.5px] text-ink/80 max-w-[68ch] mb-3">
          Progetto finanziato dal bando MIMIT per il potenziamento degli Uffici di Trasferimento Tecnologico, presso la Sezione Tutela e Valorizzazione della Proprieta' Intellettuale dell'UNITO. L'obiettivo centrale del ruolo KTM è di
          rafforzare lo scouting nelle aree meno attive (fisica, chimica, scienze umanistiche) e allineare
          l'ufficio alla S3 regionale e alle politiche europee di valorizzazione della conoscenza.
        </p>

      </Block>

      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4 density-gap">
        <StatCard tone="dark" value={stakeholders.rows?.length ?? "…"} label="attori mappati nell'ecosistema, 4 livelli" />
        <StatCard tone="accent" value={connections.rows?.filter((c) => c.stato !== "esistente").length ?? "…"} label="opportunita' di connessione identificate" />
        <StatCard tone="white" value={sops.rows?.length ?? "…"} label="SOP nella libreria vivente" />
        <StatCard tone="tint" value={fonti.rows?.length ?? "…"} label="fonti verificate in bibliografia" />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className="p-5 card">
          <h3 className="text-[14px] font-semibold mb-1">Stato delle connessioni dell'ecosistema</h3>
          <p className="text-[12.5px] text-muted mb-4">esistenti, lacune, ipotizzate: dataset 02</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={connByStatus} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E7E4" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="stato" tick={{ fontSize: 12.5 }} width={80} />
              <Tooltip />
              <Bar dataKey="valore" radius={[0, 6, 6, 0]}>
                {connByStatus.map((e) => <Cell key={e.stato} fill={STATUS_COLOR[e.stato]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 card">
          <h3 className="text-[14px] font-semibold mb-1">Stakeholder per livello</h3>
          <p className="text-[12.5px] text-muted mb-4">ateneo, locale, nazionale, internazionale: dataset 01</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stakeByLevel} dataKey="valore" nameKey="livello" innerRadius={45} outerRadius={72} paddingAngle={2}>
                {stakeByLevel.map((e) => <Cell key={e.livello} fill={LEVEL_COLOR[e.livello]} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold mb-3">Accesso rapido</h3>
      <AnimatedList
        items={QUICK_LINKS}
        className="mb-8"
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        renderItem={(l) => {
          const Icon = l.icon;
          return (
            <button onClick={() => setView(l.id)} className="w-full p-4 text-left card hover:bg-tint/30 group">
              <Icon size={18} className="mb-2 text-ink/70" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">{l.label}</span>
                <ArrowRight size={13} className="transition-opacity opacity-0 group-hover:opacity-60" />
              </div>
              <p className="text-[11.5px] text-muted mt-1">{l.desc}</p>
            </button>
          );
        }}
      />


    </div>
  );
}
