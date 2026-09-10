import { useMemo, useState } from "react";
import { useCsv, toCSV, download } from "../lib/useCsv";
import { getSlice, setSlice } from "../lib/store";
import { Badge, Block } from "../components/Badge";
import { Clock, Plus, ChevronRight } from "lucide-react";
import AnimatedList from "../components/reactbits/AnimatedList";

const FREQ_DAYS = { mensile: 30, trimestrale: 90, semestrale: 180, annuale: 365 };

function reviewStatus(sop) {
  const days = FREQ_DAYS[sop.frequenza_revisione];
  if (!days) return { flag: "evento", label: "revisione legata a evento" };
  const last = new Date(sop.ultimo_aggiornamento);
  const elapsed = (Date.now() - last.getTime()) / 86400000;
  if (elapsed > days) return { flag: "scaduta", label: `da rivedere — ultima revisione ${Math.round(elapsed)} giorni fa` };
  return { flag: "ok", label: `prossima revisione tra ${Math.round(days - elapsed)} giorni` };
}

export default function SopLibrary({ query }) {
  const sops = useCsv("10_libreria_sop.csv");
  const [categoria, setCategoria] = useState("tutte");
  const [open, setOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const extra = getSlice("extra-sop", []);
  const [draft, setDraft] = useState({ titolo_sop: "", categoria: "", scopo: "", sintesi_passaggi: "" });

  const all = useMemo(() => [...(sops.rows || []), ...extra], [sops.rows, extra]);
  const categorie = useMemo(() => ["tutte", ...new Set(all.map((s) => s.categoria).filter(Boolean))], [all]);

  const rows = useMemo(() => {
    let r = all;
    if (categoria !== "tutte") r = r.filter((s) => s.categoria === categoria);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((s) => (s.titolo_sop + s.scopo).toLowerCase().includes(q));
    }
    return r;
  }, [all, categoria, query]);

  function addSop() {
    if (!draft.titolo_sop) return;
    const id = `custom-${Date.now()}`;
    const next = [...extra, { ...draft, id, conoscenza_tipo: "esplicita", owner: "KTM", stato: "bozza", versione: "0.1", frequenza_revisione: "trimestrale", ultimo_aggiornamento: new Date().toISOString().slice(0, 10) }];
    setSlice("extra-sop", next);
    setDraft({ titolo_sop: "", categoria: "", scopo: "", sintesi_passaggi: "" });
    setShowForm(false);
  }

  return (
    <div className="max-w-[1180px]">
      <Block source="Le SOP seguono il principio di questa base di conoscenza: cattura, trasferisci, applica, mantieni. Uno stato scaduto non è un errore — è il sistema che funziona.">
        <p className="text-[13.5px] text-muted max-w-[65ch]">
          Quindici procedure di partenza, tutte in stato bozza: sono un punto di avvio, non un archivio da consultare passivamente.
          Ogni scheda mostra da quanto tempo non viene rivista rispetto alla cadenza dichiarata.
        </p>
      </Block>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {categorie.map((c) => (
          <button key={c} className="chip" aria-pressed={categoria === c} onClick={() => setCategoria(c)}>{c}</button>
        ))}
        <button className="ml-auto chip flex items-center gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus size={13} /> proponi una SOP
        </button>
        <button className="chip" onClick={() => download("libreria-sop.csv", toCSV(rows))}>Scarica in CSV</button>
      </div>

      {showForm && (
        <div className="card p-4 mb-5 space-y-2">
          <input placeholder="titolo" className="w-full text-[13px] border border-line rounded-lg px-3 py-2"
            value={draft.titolo_sop} onChange={(e) => setDraft({ ...draft, titolo_sop: e.target.value })} />
          <input placeholder="categoria" className="w-full text-[13px] border border-line rounded-lg px-3 py-2"
            value={draft.categoria} onChange={(e) => setDraft({ ...draft, categoria: e.target.value })} />
          <textarea placeholder="scopo" className="w-full text-[13px] border border-line rounded-lg px-3 py-2"
            value={draft.scopo} onChange={(e) => setDraft({ ...draft, scopo: e.target.value })} />
          <textarea placeholder="passaggi separati da >" className="w-full text-[13px] border border-line rounded-lg px-3 py-2"
            value={draft.sintesi_passaggi} onChange={(e) => setDraft({ ...draft, sintesi_passaggi: e.target.value })} />
          <button className="bg-ink text-bg text-[13px] rounded-lg px-4 py-2" onClick={addSop}>Aggiungi come bozza</button>
        </div>
      )}

      <AnimatedList
        items={rows}
        gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        renderItem={(s) => {
          const rs = reviewStatus(s);
          const isOpen = open === s.id;
          return (
            <div className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <Badge>{s.categoria}</Badge>
                <Badge tone={s.stato === "attiva" ? "good" : "neutral"}>{s.stato} · v{s.versione}</Badge>
              </div>
              <h4 className="text-[13.5px] font-semibold mb-1.5 leading-snug">{s.titolo_sop}</h4>
              <p className="text-[12.5px] text-ink/75 mb-2 line-clamp-3">{s.scopo}</p>
              <p className={`text-[11.5px] flex items-center gap-1 mb-3 ${rs.flag === "scaduta" ? "text-[#8a2f27] font-medium" : "text-muted"}`}>
                <Clock size={11} /> {rs.label}
              </p>
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="text-[12.5px] font-medium flex items-center gap-1">
                {isOpen ? "Chiudi" : "Vedi i passaggi"} <ChevronRight size={13} className={isOpen ? "rotate-90" : ""} />
              </button>
              {isOpen && (
                <ol className="mt-3 pt-3 border-t border-line space-y-1.5 text-[12px] list-decimal list-inside">
                  {(s.sintesi_passaggi || "").split(">").map((step, i) => (
                    <li key={i}>{step.trim()}</li>
                  ))}
                </ol>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
