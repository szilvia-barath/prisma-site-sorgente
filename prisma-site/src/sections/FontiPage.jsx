import { useMemo, useState } from "react";
import { useCsv, toCSV, download } from "../lib/useCsv";
import { Badge, Block } from "../components/Badge";

export default function FontiPage({ query }) {
  const fonti = useCsv("04_fonti.csv");
  const [tipo, setTipo] = useState("tutti");
  const [tier, setTier] = useState("tutte");

  const tipi = useMemo(() => ["tutti", ...new Set((fonti.rows || []).map((f) => f.tipo).filter(Boolean))], [fonti.rows]);

  const rows = useMemo(() => {
    let r = fonti.rows || [];
    if (tipo !== "tutti") r = r.filter((f) => f.tipo === tipo);
    if (tier !== "tutte") r = r.filter((f) => f.livello_affidabilita === tier);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((f) => (f.titolo + f.editore + f.parole_chiave).toLowerCase().includes(q));
    }
    return [...r].sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  }, [fonti.rows, tipo, tier, query]);

  return (
    <div className="max-w-[1180px]">
      <Block source="Ogni fonte porta un grado di affidabilita' dichiarato: A_primaria (norma o rapporto ufficiale), B_istituzionale (associazione o progetto UE), C_secondaria (mercato o materiale fornito dall'utente).">
        <p className="text-[13.5px] text-muted max-w-[65ch]">
          Bibliografia annotata di tutte le {fonti.rows?.length || "…"} fonti usate in questo sito, con parole
          chiave per orientarsi rapidamente. Non e' un elenco statico: ogni volta che si aggiunge un documento
          al progetto, questa pagina si aggiorna da sola.
        </p>
      </Block>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {tipi.map((t) => <button key={t} className="chip" aria-pressed={tipo === t} onClick={() => setTipo(t)}>{t}</button>)}
        <span className="w-px h-5 bg-line mx-1" />
        {["tutte", "A_primaria", "B_istituzionale", "C_secondaria"].map((t) => (
          <button key={t} className="chip" aria-pressed={tier === t} onClick={() => setTier(t)}>{t}</button>
        ))}
        <button className="ml-auto chip" onClick={() => download("bibliografia.csv", toCSV(rows))}>Scarica in CSV</button>
      </div>

      <div className="space-y-3">
        {rows.map((f) => (
          <div key={f.id} className="card p-4">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h4 className="text-[13.5px] font-semibold">
                {f.url ? <a href={f.url} target="_blank" rel="noreferrer" className="underline">{f.titolo}</a> : f.titolo}
              </h4>
              <div className="flex gap-1.5 shrink-0">
                <Badge>{f.tipo}</Badge>
                <Badge tone={f.livello_affidabilita === "A_primaria" ? "good" : f.livello_affidabilita === "B_istituzionale" ? "info" : "neutral"}>
                  {f.livello_affidabilita}
                </Badge>
              </div>
            </div>
            <p className="text-[12.5px] text-muted mb-2">{f.editore}{f.data ? ` — ${f.data}` : ""}</p>
            {f.note_locator && <p className="text-[12.5px] text-ink/80 mb-2 max-w-[65ch]">{f.note_locator}</p>}
            {f.parole_chiave && (
              <div className="flex flex-wrap gap-1.5">
                {f.parole_chiave.split(";").map((k) => <Badge key={k}>{k.trim()}</Badge>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
