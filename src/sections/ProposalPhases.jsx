import { useMemo, useState } from "react";
import { useCsv, toCSV, download } from "../lib/useCsv";
import { getSlice, setSlice } from "../lib/store";
import { Badge, Block } from "../components/Badge";
import { SERIES } from "../lib/colors";
import { Check, Layers, Type } from "lucide-react";

const PHASE_LABEL = {
  1: "Inserimento e formazione iniziale",
  2: "Mappatura e connessione con l'ecosistema",
  3: "Sessioni operative e prime sperimentazioni",
  4: "Consolidamento",
};
const KTYPE_LABEL = { esplicita: "Conoscenza esplicita", tacita: "Conoscenza tacita", implicita: "Conoscenza implicita" };
const KTYPE_COLOR = { esplicita: SERIES[0], tacita: SERIES[2], implicita: SERIES[3] };

function parseHorizon(text, fase) {
  const t = (text || "").toLowerCase();
  const nums = (t.match(/\d+/g) || []).map(Number);
  let range;
  if (t.includes("settiman")) {
    range = nums.length >= 2 ? [nums[0] / 4.33, nums[1] / 4.33] : [nums[0] / 4.33, nums[0] / 4.33 + 1];
  } else if (t.includes("continuo")) {
    range = nums.length ? [nums[0], 12] : [{ 1: 1, 2: 3, 3: 5, 4: 9 }[fase], 12];
  } else if (nums.length >= 2) {
    range = [nums[0], nums[1]];
  } else if (nums.length === 1) {
    range = [Math.max(1, nums[0] - 0.5), Math.min(12, nums[0] + 0.5)];
  } else {
    range = [{ 1: 1, 2: 3, 3: 5, 4: 9 }[fase], { 1: 3, 2: 8, 3: 12, 4: 12 }[fase]];
  }
  return [Math.max(1, range[0]), Math.min(12, range[1])];
}

export default function ProposalPhases({ query }) {
  const azioni = useCsv("09_fasi_progetto_proposta_kt.csv");
  const checklist = useCsv("12_checklist_kt.csv");
  const [groupBy, setGroupBy] = useState("fase");
  const checkState = getSlice("checklist-kt", {});

  const rows = useMemo(() => {
    let r = azioni.rows || [];
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((a) => (a.azione + a.obiettivo + a.rischio).toLowerCase().includes(q));
    }
    return r;
  }, [azioni.rows, query]);

  const byFase = useMemo(() => {
    const g = { 1: [], 2: [], 3: [], 4: [] };
    rows.forEach((r) => g[r.fase_numero]?.push(r));
    return g;
  }, [rows]);

  const byType = useMemo(() => {
    const g = { esplicita: [], tacita: [], implicita: [] };
    rows.forEach((r) => g[r.tipo_conoscenza]?.push(r));
    return g;
  }, [rows]);

  function toggleCheck(id) {
    setSlice("checklist-kt", { ...checkState, [id]: !checkState[id] });
  }

  return (
    <div className="max-w-[1180px]">
      <Block source="Le quattro fasi sono quelle del bando 2026_12 TD. Metodo, rischio, mitigazione e indicatore sono la proposta operativa, costruita sulla metodologia di Knowledge Transfer dei materiali forniti.">
        <p className="text-[13.5px] text-muted max-w-[65ch]">
          Il bando dice esplicitamente che le fasi possono sovrapporsi. La timeline sotto lo mostra;
          la vista per tipo di conoscenza risponde a una domanda diversa: quanto sforzo va a documentazione,
          quanto ad affiancamento, quanto a far emergere prassi non scritte.
        </p>
        <p className="text-[12.5px] text-ink/70 max-w-[65ch] mt-2">
          Base: genealogia dei bandi UTT dal 2015, le 4 elementi che rendono
          efficace un PoC (sezione Metriche KTT), e soluzioni concrete come i corsi Netval, il framework
          REVALORISE+, il caso dei centri Alzheimer olandesi.
        </p>
      </Block>

      <Timeline rows={rows} />

      <div className="flex items-center gap-2 my-5">
        <button className="chip" aria-pressed={groupBy === "fase"} onClick={() => setGroupBy("fase")}>
          <Layers size={13} className="inline mr-1 -mt-0.5" /> per fase
        </button>
        <button className="chip" aria-pressed={groupBy === "tipo"} onClick={() => setGroupBy("tipo")}>
          <Type size={13} className="inline mr-1 -mt-0.5" /> per tipo di conoscenza
        </button>
        <button className="ml-auto chip" onClick={() => download("azioni-proposta.csv", toCSV(rows))}>Scarica in CSV</button>
      </div>

      {groupBy === "fase" && Object.entries(byFase).map(([n, actions]) => (
        <PhaseGroup key={n} title={`Fase ${n} — ${PHASE_LABEL[n]}`} actions={actions} />
      ))}
      {groupBy === "tipo" && Object.entries(byType).map(([t, actions]) => (
        <PhaseGroup key={t} title={KTYPE_LABEL[t]} actions={actions} accent={KTYPE_COLOR[t]} />
      ))}

      <div className="p-5 mt-8 card">
        <h3 className="text-[14px] font-semibold mb-3">Checklist di Knowledge Transfer</h3>
        <p className="text-[12.5px] text-muted mb-4 max-w-[60ch]">Adattata dalla checklist KT dei materiali forniti, collegata alle fasi del progetto. Le spunte restano nel browser.</p>
        <ul className="space-y-1.5">
          {(checklist.rows || []).map((c) => (
            <li key={c.id} className="flex items-start gap-2.5 text-[13px]">
              <button
                onClick={() => toggleCheck(c.id)}
                className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 ${checkState[c.id] ? "bg-accent2 border-accent2" : "border-line"}`}
                style={{ width: 18, height: 18 }}
              >
                {checkState[c.id] && <Check size={12} color="#fff" />}
              </button>
              <span className={checkState[c.id] ? "line-through text-muted" : ""}>{c.domanda_checklist}</span>
              {c.fase_collegata && <Badge>fase {c.fase_collegata}</Badge>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhaseGroup({ title, actions, accent }) {
  return (
    <div className="mb-6">
      <h3 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
        {accent && <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />}
        {title}
      </h3>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <details key={i} className="p-4 card group">
            <summary className="flex items-start justify-between gap-3 list-none cursor-pointer">
              <span className="text-[13.5px] font-medium">{a.azione}</span>
              <span className="flex gap-1.5 shrink-0">
                <Badge>{a.tipo_conoscenza}</Badge>
                <Badge tone="info">{a.orizzonte_temporale}</Badge>
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
              <div><b className="block text-muted mb-0.5">Obiettivo</b>{a.obiettivo}</div>
              <div><b className="block text-muted mb-0.5">Metodo KT</b>{a.metodo_kt}</div>
              <div><b className="block text-muted mb-0.5">Rischio</b>{a.rischio}</div>
              <div><b className="block text-muted mb-0.5">Mitigazione</b>{a.mitigazione}</div>
              <div className="md:col-span-2"><b className="block text-muted mb-0.5">Indicatore di valutazione</b>{a.indicatore_valutazione}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function Timeline({ rows }) {
  const items = useMemo(() => rows.map((r) => ({ ...r, range: parseHorizon(r.orizzonte_temporale, Number(r.fase_numero)) })), [rows]);
  const byFase = useMemo(() => {
    const g = { 1: [], 2: [], 3: [], 4: [] };
    items.forEach((r) => g[r.fase_numero]?.push(r));
    return g;
  }, [items]);
  const faseColor = { 1: SERIES[0], 2: SERIES[1], 3: SERIES[2], 4: SERIES[3] };

  return (
    <div className="p-5 mb-2 card">
      <h3 className="text-[14px] font-semibold mb-1">Sovrapposizione delle quattro fasi</h3>
      <p className="text-[12.5px] text-muted mb-4">mesi 1-12 del contratto, stimati dagli orizzonti temporali di ciascuna azione</p>
      <div className="space-y-2.5">
        {Object.entries(byFase).map(([n, acts]) => {
          if (!acts.length) return null;
          const min = Math.min(...acts.map((a) => a.range[0]));
          const max = Math.max(...acts.map((a) => a.range[1]));
          const left = (min / 12) * 100;
          const width = ((max - min) / 12) * 100;
          return (
            <div key={n} className="flex items-center gap-3">
              <span className="w-16 text-[12px] text-muted shrink-0">Fase {n}</span>
              <div className="relative flex-1 h-6 overflow-hidden rounded-full bg-tint/40">
                <div
                  className="absolute h-full rounded-full flex items-center px-2 text-[10.5px] text-ink/80 font-medium"
                  style={{ left: `${left}%`, width: `${Math.max(width, 4)}%`, background: faseColor[n] }}
                >
                  {Math.round(min)}–{Math.round(max)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10.5px] text-muted mt-2 px-[76px]">
        <span>mese 1</span><span>mese 6</span><span>mese 12</span>
      </div>
    </div>
  );
}
