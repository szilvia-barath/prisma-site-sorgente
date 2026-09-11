import { useMemo, useState } from "react";
import { useCsv } from "../lib/useCsv";
import { getSlice, setSlice } from "../lib/store";
import { Badge, Block } from "../components/Badge";

export default function ExamPrep({ query }) {
  const argomenti = useCsv("05_argomenti_esame.csv");
  const numeri = useCsv("06_numeri_chiave.csv");
  const requisiti = useCsv("07_requisiti_evidenze.csv");
  const domande = useCsv("08_domande_colloquio.csv");
  const [tab, setTab] = useState("argomenti");

  return (
    <div className="max-w-[1180px]">
      <div className="flex gap-1 bg-tint/50 p-1 rounded-full w-fit mb-6 flex-wrap">
        {[["argomenti", "Programma d'esame"], ["numeri", "Numeri chiave"], ["matrice", "Requisiti ed evidenze"], ["domande", "Domande"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${tab === id ? "bg-ink text-bg" : "text-ink/70"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "argomenti" && <Argomenti rows={argomenti.rows} query={query} />}
      {tab === "numeri" && <Numeri rows={numeri.rows} query={query} />}
      {tab === "matrice" && <Matrice rows={requisiti.rows} query={query} />}
      {tab === "domande" && <Domande rows={domande.rows} query={query} />}
    </div>
  );
}

function Argomenti({ rows, query }) {
  const ratings = getSlice("ratings-argomenti", {});
  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((a) => (a.argomento + a.contenuto_chiave).toLowerCase().includes(q));
  }, [rows, query]);

  function rate(id, v) {
    setSlice("ratings-argomenti", { ...ratings, [id]: ratings[id] === v ? 0 : v });
  }

  return (
    <div className="space-y-3">
      {filtered.map((a) => (
        <details key={a.id} className="card p-4" open={a.priorita_studio === "1"}>
          <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
            <span className="text-[13.5px] font-medium">{a.argomento}</span>
            <Badge tone={a.priorita_studio === "1" ? "warn" : "neutral"}>priorita' {a.priorita_studio}</Badge>
          </summary>
          <p className="text-[12.5px] text-muted mt-2 mb-1"><b>Livello richiesto:</b> {a.livello_richiesto}</p>
          <p className="text-[13px] text-ink/80 mt-2 max-w-[65ch]">{a.contenuto_chiave}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[12px] text-muted mr-1">Quanto te la senti?</span>
            {[1, 2, 3].map((v) => (
              <button
                key={v}
                onClick={() => rate(a.id, v)}
                className={`w-7 h-7 rounded-full text-[12px] border ${ratings[a.id] === v ? "bg-accent2 text-white border-accent2" : "border-line"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function Numeri({ rows, query }) {
  const [revealed, setRevealed] = useState({});
  const [group, setGroup] = useState("tutti");
  const groups = useMemo(() => ["tutti", ...new Set((rows || []).map((n) => n.gruppo))], [rows]);
  const filtered = useMemo(() => {
    let r = rows || [];
    if (group !== "tutti") r = r.filter((n) => n.gruppo === group);
    if (query) r = r.filter((n) => n.domanda.toLowerCase().includes(query.toLowerCase()));
    return r;
  }, [rows, group, query]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map((g) => <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(g)}>{g}</button>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((n, i) => (
          <button key={i} onClick={() => setRevealed({ ...revealed, [i]: !revealed[i] })} className="card p-4 text-left h-[110px] flex flex-col justify-between">
            <span className="text-[12.5px]">{n.domanda}</span>
            <span>
              {revealed[i] ? <span className="text-[22px] font-extrabold text-ink">{n.risposta}</span> : <span className="text-[11px] text-muted">{n.fonte}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Matrice({ rows, query }) {
  const toneMap = { lacuna: "warn", parziale: "info", solida: "good" };
  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!query) return rows;
    return rows.filter((r) => r.requisito.toLowerCase().includes(query.toLowerCase()));
  }, [rows, query]);
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-tint/40 border-b border-line text-left">
            <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Requisito</th>
            <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Evidenza</th>
            <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Stato</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              <td className="px-3.5 py-2.5 font-medium">{r.requisito}</td>
              <td className="px-3.5 py-2.5 text-muted">{r.evidenza}</td>
              <td className="px-3.5 py-2.5"><Badge tone={toneMap[r.stato]}>{r.stato}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Domande({ rows, query }) {
  const [group, setGroup] = useState("tutte");
  const groups = useMemo(() => ["tutte", ...new Set((rows || []).map((d) => d.gruppo))], [rows]);
  const filtered = useMemo(() => {
    let r = rows || [];
    if (group !== "tutte") r = r.filter((d) => d.gruppo === group);
    if (query) r = r.filter((d) => d.domanda.toLowerCase().includes(query.toLowerCase()));
    return r;
  }, [rows, group, query]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map((g) => <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(g)}>{g}</button>)}
      </div>
      <div className="space-y-3">
        {filtered.map((d, i) => (
          <details key={i} className="card p-4">
            <summary className="cursor-pointer list-none text-[13.5px] font-medium">{d.domanda}</summary>
            <p className="text-[13px] text-ink/80 mt-2 pt-2 border-t border-line max-w-[68ch]">{d.traccia_risposta}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
