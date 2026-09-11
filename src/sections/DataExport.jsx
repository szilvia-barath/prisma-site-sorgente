import { useCsv, toCSV, download } from "../lib/useCsv";
import { exportAll, importAll, clearAll } from "../lib/store";
import { Block } from "../components/Badge";

const FILES = [
  "00_dizionario_dati.csv", "01_stakeholder_ecosistema.csv", "02_connessioni_ecosistema.csv",
  "03_glossario_concetti.csv", "04_fonti.csv", "05_argomenti_esame.csv", "06_numeri_chiave.csv",
  "07_requisiti_evidenze.csv", "08_domande_colloquio.csv", "09_fasi_progetto_proposta_kt.csv",
  "10_libreria_sop.csv", "11_commissione.csv", "12_checklist_kt.csv", "13_confronto_strumenti_km.csv",
  "14_dipartimenti_aree_scouting.csv",
];

export default function DataExport() {
  return (
    <div className="max-w-[1180px]">
      <Block source="Tutti i dati vivono come CSV in git, piu' le tue aggiunte nel localStorage del browser. Nessun dato lascia il dispositivo senza un'azione esplicita di esportazione.">
        <h2 className="text-[16px] font-semibold mb-3">Le quindici tabelle sorgente</h2>
        <div className="flex flex-wrap gap-2">
          {FILES.map((f) => (
            <a key={f} href={`${import.meta.env.BASE_URL}data/${f}`} download className="chip">{f}</a>
          ))}
        </div>
      </Block>

      <Block source="Le tue aggiunte (stakeholder, connessioni, SOP proposte, autovalutazioni, checklist, registro contatti) vivono solo in questo browser finche' non le esporti.">
        <h2 className="text-[16px] font-semibold mb-3">I tuoi dati locali</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="bg-ink text-bg text-[13px] rounded-lg px-4 py-2"
            onClick={() => download("prisma-kb-progressi.json", exportAll(), "application/json")}
          >
            Scarica i tuoi progressi
          </button>
          <label className="text-[13px] border border-line rounded-lg px-4 py-2 cursor-pointer bg-white">
            Carica progressi
            <input type="file" accept="application/json" hidden onChange={(e) => {
              const f = e.target.files[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => { try { importAll(r.result); window.location.reload(); } catch { alert("File non leggibile"); } };
              r.readAsText(f);
            }} />
          </label>
          <button
            className="text-[13px] border border-line rounded-lg px-4 py-2 text-[#8a2f27]"
            onClick={() => { if (confirm("Cancellare tutti i progressi locali?")) { clearAll(); window.location.reload(); } }}
          >
            Azzera progressi locali
          </button>
        </div>
      </Block>

      <Block source="Gratuito fino a 50 utenti. La protezione avviene a livello di rete, prima che la pagina venga servita.">
        <h2 className="text-[16px] font-semibold mb-3">Pubblicarlo con una password</h2>
        <ol className="text-[13.5px] space-y-1.5 list-decimal list-inside max-w-[62ch]">
          <li>Carica il progetto (compresa la cartella <code>dist</code> generata dalla build) su un repository GitHub privato.</li>
          <li>Su Cloudflare Pages collega il repository. Build command: <code>npm run build</code>. Output: <code>dist</code>.</li>
          <li>In Cloudflare Zero Trust apri Access, crea un'applicazione sul dominio del sito e una policy che consenta l'accesso solo alla tua email.</li>
          <li>Da quel momento chi apre l'indirizzo riceve un codice usa e getta via email; nessun altro vede nulla.</li>
        </ol>
      </Block>
    </div>
  );
}
