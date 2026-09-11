import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCsv, toCSV, download } from "../lib/useCsv";
import { getSlice, setSlice } from "../lib/store";
import EcosystemGraph from "../components/EcosystemGraph";
import DataTable from "../components/DataTable";
import { Badge, Block } from "../components/Badge";
import { LEVEL_COLOR, STATUS_COLOR } from "../lib/colors";
import { coordsFor } from "../lib/geo";
import { Plus, MapPin, GitBranch, Table2, ListFilter } from "lucide-react";

const LEVELS = ["tutti", "ateneo", "locale", "nazionale", "internazionale"];
const TABS = [
  { id: "graph", label: "Grafo", icon: GitBranch },
  { id: "map", label: "Mappa", icon: MapPin },
  { id: "table", label: "Elenco", icon: Table2 },
  { id: "gaps", label: "Opportunita'", icon: ListFilter },
];

export default function Ecosystem({ query }) {
  const stakeholders = useCsv("01_stakeholder_ecosistema.csv");
  const connectionsBase = useCsv("02_connessioni_ecosistema.csv");

  const [tab, setTab] = useState("graph");
  const [level, setLevel] = useState("tutti");
  const [tipo, setTipo] = useState("tutti");
  const [verifica, setVerifica] = useState("tutti");
  const [selected, setSelected] = useState(null);
  const [logDraft, setLogDraft] = useState({ tipo: "", esito: "", prossimo: "" });

  const extraStake = getSlice("extra-stakeholders", []);
  const extraConn = getSlice("extra-connections", []);
  const logs = getSlice("interaction-logs", {}); // { stakeholderId: [{data,tipo,esito,prossimo}] }

  const allStake = useMemo(
    () => [...(stakeholders.rows || []), ...extraStake],
    [stakeholders.rows, extraStake]
  );
  const allConn = useMemo(
    () => [...(connectionsBase.rows || []), ...extraConn],
    [connectionsBase.rows, extraConn]
  );

  const tipi = useMemo(() => ["tutti", ...new Set(allStake.map((s) => s.tipo).filter(Boolean))], [allStake]);

  const filteredStake = useMemo(() => {
    let rows = allStake;
    if (level !== "tutti") rows = rows.filter((s) => s.livello === level);
    if (tipo !== "tutti") rows = rows.filter((s) => s.tipo === tipo);
    if (verifica !== "tutti") rows = rows.filter((s) => s.stato_verifica === verifica);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((s) => (s.nome + s.descrizione_ruolo).toLowerCase().includes(q));
    }
    return rows;
  }, [allStake, level, tipo, verifica, query]);

  const filteredStakeIds = useMemo(() => new Set(filteredStake.map((s) => s.id)), [filteredStake]);
  const filteredConn = useMemo(
    () => allConn.filter((c) => filteredStakeIds.has(c.origine_id) || filteredStakeIds.has(c.destinazione_id)),
    [allConn, filteredStakeIds]
  );

  const gaps = useMemo(() => {
    const stakeById = new Map(allStake.map((s) => [s.id, s]));
    return allConn
      .filter((c) => c.stato !== "esistente")
      .map((c) => ({ ...c, origine: stakeById.get(c.origine_id)?.nome, destinazione: stakeById.get(c.destinazione_id)?.nome }))
      .sort((a, b) => {
        const order = { alta: 0, media: 1, bassa: 2 };
        return (order[a.priorita] ?? 3) - (order[b.priorita] ?? 3);
      });
  }, [allConn, allStake]);

  const selectedStake = allStake.find((s) => s.id === selected);

  function addLogEntry() {
    if (!selected || !logDraft.tipo) return;
    const entry = { data: new Date().toISOString().slice(0, 10), ...logDraft };
    const next = { ...logs, [selected]: [...(logs[selected] || []), entry] };
    setSlice("interaction-logs", next);
    setLogDraft({ tipo: "", esito: "", prossimo: "" });
  }

  return (
    <div className="max-w-[1180px]">
      <Block source="Livelli e stati definiti nel modello dati. Lo stato «lacuna» segnala un collegamento assente e utile; «ipotizzata» segnala un collegamento non verificato da esplorare.">
        <p className="text-[13.5px] text-muted mb-1 max-w-[65ch]">
          Grafo, mappa ed elenco condividono gli stessi filtri: cambiare livello qui si riflette ovunque.
          Le connessioni esistenti sono tratto pieno verde; le lacune tratto tratteggiato rosa; le ipotizzate tratto punteggiato giallo.
        </p>
      </Block>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {LEVELS.map((l) => (
          <button key={l} className="chip" aria-pressed={level === l} onClick={() => setLevel(l)}>
            {l}{l !== "tutti" && <span className="inline-block w-2 h-2 rounded-full ml-1.5" style={{ background: LEVEL_COLOR[l] }} />}
          </button>
        ))}
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="chip !cursor-pointer text-[13px]">
          {tipi.map((t) => <option key={t} value={t}>{t === "tutti" ? "tutti i tipi" : t}</option>)}
        </select>
        <select value={verifica} onChange={(e) => setVerifica(e.target.value)} className="chip !cursor-pointer text-[13px]">
          <option value="tutti">verificati e non</option>
          <option value="verificato">solo verificati</option>
          <option value="da_verificare">solo da verificare</option>
        </select>
        <div className="ml-auto flex gap-1 bg-tint/50 p-1 rounded-full">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium ${tab === t.id ? "bg-ink text-bg" : "text-ink/70"}`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "graph" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          <div className="card p-3">
            <EcosystemGraph
              nodes={filteredStake}
              links={filteredConn}
              onSelect={setSelected}
              selectedId={selected}
            />
            <div className="flex flex-wrap gap-4 px-3 pb-2 pt-1 text-[12px] text-muted">
              <span><i className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle" style={{ background: STATUS_COLOR.esistente }} />esistente</span>
              <span><i className="inline-block w-4 h-0.5 mr-1 align-middle" style={{ background: STATUS_COLOR.lacuna, borderTop: `2px dashed ${STATUS_COLOR.lacuna}` }} />lacuna</span>
              <span><i className="inline-block w-4 h-0.5 mr-1 align-middle" style={{ borderTop: `2px dotted ${STATUS_COLOR.ipotizzata}` }} />ipotizzata</span>
            </div>
          </div>
          <StakeDetail
            stake={selectedStake}
            log={selected ? logs[selected] || [] : []}
            logDraft={logDraft}
            setLogDraft={setLogDraft}
            onAddLog={addLogEntry}
          />
        </div>
      )}

      {tab === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          <div className="card p-2 overflow-hidden">
            <MapContainer center={[45.065, 7.685]} zoom={11} style={{ height: 520, width: "100%", borderRadius: 12 }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredStake.filter((s) => s.livello === "locale").map((s) => {
                const [lat, lng] = coordsFor(s);
                return (
                  <CircleMarker key={s.id} center={[lat, lng]} radius={7} pathOptions={{ color: LEVEL_COLOR.locale, fillOpacity: 0.85 }} eventHandlers={{ click: () => setSelected(s.id) }}>
                    <Popup>
                      <b>{s.nome}</b><br />{s.descrizione_ruolo}
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
            <p className="text-[11.5px] text-muted px-2 pt-2 pb-1">
              Posizione approssimata sul centro citta' dichiarato nella scheda, salvo indicazioni piu' precise. Mostra solo gli attori di livello locale.
            </p>
          </div>
          <StakeDetail
            stake={selectedStake}
            log={selected ? logs[selected] || [] : []}
            logDraft={logDraft}
            setLogDraft={setLogDraft}
            onAddLog={addLogEntry}
          />
        </div>
      )}

      {tab === "table" && (
        <StakeTable rows={filteredStake} onSelect={setSelected} />
      )}

      {tab === "gaps" && (
        <GapsTable rows={gaps} />
      )}

      <AddPanels
        onAddStake={(s) => setSlice("extra-stakeholders", [...extraStake, s])}
        onAddConn={(c) => setSlice("extra-connections", [...extraConn, c])}
        stakeIds={allStake.map((s) => s.id)}
      />
    </div>
  );
}

function StakeDetail({ stake, log, logDraft, setLogDraft, onAddLog }) {
  if (!stake) {
    return (
      <div className="card p-5 h-fit">
        <p className="text-[13px] text-muted">Seleziona un nodo, un marker o una riga per vedere la scheda completa e il registro dei contatti.</p>
      </div>
    );
  }
  return (
    <div className="card p-5 h-fit">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: LEVEL_COLOR[stake.livello] }} />
        <h3 className="text-[14.5px] font-semibold">{stake.nome}</h3>
      </div>
      <div className="flex gap-1.5 mb-3">
        <Badge>{stake.livello}</Badge>
        <Badge tone={stake.stato_verifica === "verificato" ? "good" : "warn"}>{stake.stato_verifica?.replace("_", " ")}</Badge>
      </div>
      <p className="text-[13px] text-ink/80 mb-3">{stake.descrizione_ruolo}</p>
      <p className="text-[12.5px] text-muted mb-1">
        Contatto: {stake.email_contatto ? <a className="underline" href={`mailto:${stake.email_contatto}`}>{stake.email_contatto}</a> : <Badge tone="warn">da raccogliere</Badge>}
      </p>
      {stake.sito_web && <p className="text-[12.5px] mb-3"><a className="underline" href={stake.sito_web} target="_blank" rel="noreferrer">{stake.sito_web}</a></p>}

      <div className="border-t border-line pt-3 mt-3">
        <h4 className="text-[12.5px] font-semibold mb-2">Registro dei contatti</h4>
        {log.length === 0 && <p className="text-[12px] text-muted mb-2">Nessun contatto registrato.</p>}
        <ul className="space-y-1.5 mb-3">
          {log.map((e, i) => (
            <li key={i} className="text-[12px] border border-line rounded-lg p-2">
              <b>{e.data}</b> — {e.tipo}. {e.esito}{e.prossimo && <> · prossimo passo: {e.prossimo}</>}
            </li>
          ))}
        </ul>
        <div className="space-y-1.5">
          <input className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5" placeholder="tipo di contatto"
            value={logDraft.tipo} onChange={(e) => setLogDraft({ ...logDraft, tipo: e.target.value })} />
          <input className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5" placeholder="esito"
            value={logDraft.esito} onChange={(e) => setLogDraft({ ...logDraft, esito: e.target.value })} />
          <input className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5" placeholder="prossimo passo"
            value={logDraft.prossimo} onChange={(e) => setLogDraft({ ...logDraft, prossimo: e.target.value })} />
          <button onClick={onAddLog} className="w-full text-[12.5px] bg-ink text-bg rounded-lg py-1.5 hover:opacity-90">Registra contatto</button>
        </div>
      </div>
    </div>
  );
}

function StakeTable({ rows, onSelect }) {
  const columns = [
    { header: "Nome", accessorKey: "nome", cell: (i) => <button className="text-left font-medium hover:underline" onClick={() => onSelect(i.row.original.id)}>{i.getValue()}</button> },
    { header: "Livello", accessorKey: "livello", cell: (i) => <Badge>{i.getValue()}</Badge> },
    { header: "Tipo", accessorKey: "tipo" },
    { header: "Ruolo", accessorKey: "descrizione_ruolo", cell: (i) => <span className="text-muted">{i.getValue()}</span> },
    { header: "Verifica", accessorKey: "stato_verifica", cell: (i) => <Badge tone={i.getValue() === "verificato" ? "good" : "warn"}>{i.getValue()?.replace("_", " ")}</Badge> },
  ];
  return (
    <div>
      <DataTable columns={columns} data={rows} />
      <button
        className="mt-3 chip"
        onClick={() => download("ecosistema-filtrato.csv", toCSV(rows))}
      >
        Scarica questa vista in CSV
      </button>
    </div>
  );
}

function GapsTable({ rows }) {
  const columns = [
    { header: "Priorita'", accessorKey: "priorita", cell: (i) => <Badge tone={i.getValue() === "alta" ? "warn" : "info"}>{i.getValue() || "—"}</Badge> },
    { header: "Stato", accessorKey: "stato", cell: (i) => <Badge tone={i.getValue() === "lacuna" ? "warn" : "info"}>{i.getValue()}</Badge> },
    { header: "Da", accessorKey: "origine" },
    { header: "A", accessorKey: "destinazione" },
    { header: "Motivazione", accessorKey: "motivazione", cell: (i) => <span className="text-muted text-[12.5px]">{i.getValue()}</span> },
  ];
  return (
    <div>
      <p className="text-[13px] text-muted mb-3 max-w-[65ch]">
        Solo le connessioni non ancora esistenti, ordinate per priorita'. E' la lista da cui partire per decidere dove investire tempo di relazione nella Fase 2 e 3.
      </p>
      <DataTable columns={columns} data={rows} />
      <button className="mt-3 chip" onClick={() => download("opportunita-ecosistema.csv", toCSV(rows))}>
        Scarica in CSV
      </button>
    </div>
  );
}

function AddPanels({ onAddStake, onAddConn, stakeIds }) {
  const [open, setOpen] = useState(null);
  const [stakeDraft, setStakeDraft] = useState({ id: "", nome: "", livello: "locale", tipo: "", descrizione_ruolo: "", stato_verifica: "da_verificare" });
  const [connDraft, setConnDraft] = useState({ origine_id: "", destinazione_id: "", tipo_connessione: "potenziale_collaborazione", stato: "ipotizzata", priorita: "media", motivazione: "" });

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card p-4">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold" onClick={() => setOpen(open === "s" ? null : "s")}>
          <Plus size={15} /> Aggiungi uno stakeholder
        </button>
        {open === "s" && (
          <div className="mt-3 space-y-2">
            {["id", "nome", "tipo", "descrizione_ruolo"].map((f) => (
              <input key={f} placeholder={f} className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5"
                value={stakeDraft[f]} onChange={(e) => setStakeDraft({ ...stakeDraft, [f]: e.target.value })} />
            ))}
            <select className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5" value={stakeDraft.livello}
              onChange={(e) => setStakeDraft({ ...stakeDraft, livello: e.target.value })}>
              {["ateneo", "locale", "nazionale", "internazionale"].map((l) => <option key={l}>{l}</option>)}
            </select>
            <button
              className="w-full text-[12.5px] bg-ink text-bg rounded-lg py-1.5"
              onClick={() => { if (stakeDraft.id && stakeDraft.nome) { onAddStake(stakeDraft); setStakeDraft({ id: "", nome: "", livello: "locale", tipo: "", descrizione_ruolo: "", stato_verifica: "da_verificare" }); setOpen(null); } }}
            >
              Aggiungi
            </button>
          </div>
        )}
      </div>
      <div className="card p-4">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold" onClick={() => setOpen(open === "c" ? null : "c")}>
          <Plus size={15} /> Aggiungi una connessione
        </button>
        {open === "c" && (
          <div className="mt-3 space-y-2">
            <input list="stake-ids" placeholder="id origine" className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5"
              value={connDraft.origine_id} onChange={(e) => setConnDraft({ ...connDraft, origine_id: e.target.value })} />
            <input list="stake-ids" placeholder="id destinazione" className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5"
              value={connDraft.destinazione_id} onChange={(e) => setConnDraft({ ...connDraft, destinazione_id: e.target.value })} />
            <datalist id="stake-ids">{stakeIds.map((id) => <option key={id} value={id} />)}</datalist>
            <select className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5" value={connDraft.stato}
              onChange={(e) => setConnDraft({ ...connDraft, stato: e.target.value })}>
              {["esistente", "lacuna", "ipotizzata"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea placeholder="motivazione" className="w-full text-[12.5px] border border-line rounded-lg px-2.5 py-1.5"
              value={connDraft.motivazione} onChange={(e) => setConnDraft({ ...connDraft, motivazione: e.target.value })} />
            <button
              className="w-full text-[12.5px] bg-ink text-bg rounded-lg py-1.5"
              onClick={() => { if (connDraft.origine_id && connDraft.destinazione_id) { onAddConn({ ...connDraft, id: `custom-${Date.now()}` }); setOpen(null); } }}
            >
              Aggiungi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
