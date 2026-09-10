import { useState } from "react";
import { Badge, Block } from "../components/Badge";
import KttMetricsCube from "../components/KttMetricsCube";
import TRLThermometer from "../components/TRLThermometer";
import OptOutDecisionTool from "../components/OptOutDecisionTool";
import { CheckCircle2, AlertCircle } from "lucide-react";

const CUBE_DETAIL = {
  input : {
    title : "Input  :le risorse che permettono il trasferimento",
    body : "Interno : personale e budget dell'ufficio, spesa in ricerca dell'Ateneo. Esterno : spesa in R&D delle imprese del territorio, domanda di laureati  :quasi mai raccolto nelle rilevazioni europee.",
    example : "Il budget dell'Area Trasferimento Tecnologico e della Conoscenza, o la spesa in ricerca di UniTo servita dall'ufficio (paragonabile alla media europea di 85M€ per KTO secondo ASTP).",
  },
  output : {
    title : "Output  :quello che l'ufficio produce",
    body : "La dimensione piu' misurata di tutte : un brevetto depositato, una licenza firmata, un corso di formazione continua, un contratto di ricerca collaborativa.",
    example : "Le 9 tecnologie finanziate a UniTo nel bando PoC 2020, o le domande di brevetto nazionale da Universita' ed Enti pubblici di ricerca : 594 nel 2025, +25% sul 2024.",
  },
  impatto : {
    title : "Impatto  :l'effetto reale",
    body : "La dimensione quasi mai misurata : posti di lavoro creati da uno spin-off, un trattamento medico migliorato, un problema pubblico risolto. Richiede anni per manifestarsi.",
    example : "I 31 spin-off accademici nati dal primo bando PoC nazionale (dato disponibile solo a distanza di anni, non al momento del finanziamento).",
  },
};

const RACCOMANDAZIONI = [
  { n : 1, testo : "Coprire tutti i canali di valorizzazione, non solo i brevetti.",
    esempio : "I bandi Proof of Value (PoV) di UniTo finanziano esplicitamente risultati non brevettuali nelle scienze umane e sociali. A livello europeo, il programma REVALORISE+ forma specificamente ricercatori SSH alla valorizzazione." },
  { n : 2, testo : "Istituzionalizzare la raccolta dati a tutti i livelli dell'Ateneo.",
    esempio : "La piattaforma nazionale DatiUTT ha ricevuto un'implementazione funzionale significativa nel 2024, proprio per rendere sistematica la raccolta degli indicatori di trasferimento tecnologico." },
  { n : 3, testo : "Riportare un set di indicatori core che copra input, output e impatto.",
    esempio : "La survey ASTP (481 uffici in 22 paesi) e' il tentativo piu' ampio oggi esistente di un set di indicatori core condiviso  :comunicazioni di invenzione, domande di brevetto, spin-off, ma anche budget e personale come input." },
  { n : 4, testo : "Fare studi pilota sull'impatto, oltre ai numeri economici.",
    esempio : "L'Oxford University Innovation Impact Report 2023 (\"Oxford's Impact Odyssey\") e' citato dal white paper ASTP come esempio di studio pilota che va oltre i ricavi, documentando impatto sociale e tecnologico in modo qualitativo." },
  { n : 5, testo : "Applicare definizioni armonizzate condivise a livello europeo.",
    esempio : "Il rapporto NAAC propone la prima mappatura strutturata delle definizioni di spin-off/start-up in 19 rilevazioni  :un passo dichiaratamente preliminare all'armonizzazione, non ancora completata." },
  { n : 6, testo : "Mantenere le vecchie definizioni durante la transizione, per non perdere le serie storiche.",
    esempio : "Principio metodologico piu' che un caso pubblico documentato : nessuna fonte di questo dossier riporta un esempio verificato. Resta comunque il criterio corretto ogni volta che un sistema di rilevazione cambia.", onesto : true },
];

export default function MetricsPage() {
  const [cubeFace, setCubeFace] = useState("output");
  const [trlHighlight, setTrlHighlight] = useState(null);

  return (
    <div className="max-w-[1180px]">
      <Block source="ASTP White Paper su KTT Metrics (2025), endorsed by NAAC; Rapporto NAAC completo (novembre 2025).">
        <p className="text-[13.5px] text-muted max-w-[65ch]">
          Il framework con cui l'Europa misura il trasferimento tecnologico. Risponde direttamente
          all'argomento 3 del programma d'esame : mappare e valutare il potenziale dei risultati della ricerca
          con un modello riconosciuto, non improvvisato.
        </p>
      </Block>

      <div className="p-4 mb-8 border-l-4 card" style={{ borderLeftColor : "#BBDC2F" }}>
        <div className="flex items-start gap-2.5">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold mb-1">Attenzione alla parola "PI"</p>
            <p className="text-[12.5px] text-ink/80 max-w-[68ch]">
              In italiano "PI" e' ambigua : puo' significare <b>proprieta' industriale</b> (il perimetro del
              Codice della Proprieta' Industriale  :brevetti, marchi, disegni) oppure <b>proprieta' intellettuale</b>,
              il termine piu' ampio che include anche il diritto d'autore (Legge 633/1941, legge distinta dal CPI).
              UniTo usa il termine piu' ampio nel nome della propria Sezione. In questo sito "PI" e' sempre disambiguata.
            </p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">Il cubo delle metriche KTT</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">Clicca una faccia per leggerne il dettaglio.</p>
        <div className="p-6 card">
          <KttMetricsCube active={cubeFace} onSelect={setCubeFace} />
          <div className="pt-5 mt-5 border-t border-line">
            <h4 className="text-[13.5px] font-semibold mb-1.5">{CUBE_DETAIL[cubeFace].title}</h4>
            <p className="text-[12.5px] text-ink/80 mb-2 max-w-[65ch]">{CUBE_DETAIL[cubeFace].body}</p>
            <p className="text-[12px] text-muted max-w-[65ch]"><b>Esempio :</b> {CUBE_DETAIL[cubeFace].example}</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">Le sei raccomandazioni ASTP</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">Con un esempio reale per ciascuna, dove disponibile.</p>
        <div className="space-y-3">
          {RACCOMANDAZIONI.map((r) => (
            <div key={r.n} className="card p-4 flex gap-3.5">
              <div className="w-7 h-7 rounded-full bg-ink text-bg flex items-center justify-center text-[13px] font-bold shrink-0">{r.n}</div>
              <div>
                <p className="text-[13.5px] font-medium mb-1.5">{r.testo}</p>
                <p className={`text-[12.5px] ${r.onesto ? "text-muted italic"  : "text-ink/75"}`}>{r.esempio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">PoC e PoV a confronto</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">Due strumenti, due logiche diverse.</p>
        <div className="mb-4 overflow-x-auto card">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left border-b bg-tint/40 border-line">
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted"> </th>
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">PoC  :Proof of Concept</th>
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">PoV  :Proof of Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Oggetto", "Tecnologia gia' brevettata (o in corso di brevettazione)", "Risultato di ricerca non necessariamente brevettabile"],
                ["Obiettivo", "Alzare il TRL avvicinando alla commercializzazione", "Sperimentare la valorizzazione dell'uso pubblico del sapere accademico"],
                ["Area tipica", "Fisica, chimica, ingegneria, scienze della vita", "Scienze umane, sociali, patrimonio culturale"],
                ["A UniTo", "Finanziato da Compagnia di San Paolo tramite ISPIC, con 2i3T e I3P", "Bando dedicato dell'Area Trasferimento Tecnologico"],
                ["TRL di partenza tipico", "2-3 (Linea Launchpad) o piu' avanzato (Linea Venture)", "Non misurato in TRL  :maturita' molto eterogenea"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-line last :border-0">
                  <td className="px-3.5 py-2.5 font-medium text-muted">{row[0]}</td>
                  <td className="px-3.5 py-2.5">{row[1]}</td>
                  <td className="px-3.5 py-2.5">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </section>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">Cosa rende efficace un programma PoC</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">Quattro elementi che, insieme, fanno funzionare lo strumento  :dall'analisi di impatto Netval/Invitalia.</p>
        <div className="grid grid-cols-1 gap-4 md :grid-cols-2">
          {[
            ["1. Meccanismi di selezione", "Come si scelgono le tecnologie da finanziare tra quelle in portafoglio."],
            ["2. Modelli di management", "Chi segue il programma internamente, con quale struttura di responsabilita'."],
            ["3. Processi di monitoraggio", "Come si verifica l'avanzamento  :il TRL e' la metrica principale."],
            ["4. Processi di valorizzazione", "Cosa succede dopo, verso il mercato : licenza, spin-off, contratto."],
          ].map(([t, d], i) => (
            <div key={i} className="p-4 card">
              <p className="text-[13px] font-semibold mb-1">{t}</p>
              <p className="text-[12.5px] text-muted">{d}</p>
            </div>
          ))}
        </div>

      </section>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">La scala TRL</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">
          Visualizzazione originale basata sul concetto NASA (di pubblico dominio). Immagine di riferimento su
          Wikimedia Commons : <a className="underline" href="https ://commons.wikimedia.org/wiki/File :NASA_TRL_Meter.svg" target="_blank" rel="noreferrer">NASA TRL Meter.svg, Hari Seldon, CC BY-SA 4.0</a>.
        </p>
        <div className="p-6 card">
          <TRLThermometer highlight={trlHighlight} />
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-line">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <button key={n} onClick={() => setTrlHighlight(trlHighlight === n ? null  : n)} className="chip" aria-pressed={trlHighlight === n}>TRL{n}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[17px] font-semibold mb-1">Opt-out : una strategia pronta all'uso</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">
          Un titolo unico e' anche un rischio unico : se il Tribunale Unificato dichiara nullo un brevetto
          unitario, l'efficacia si perde in tutti i Paesi aderenti contemporaneamente. L'opt-out esclude un
          brevetto europeo tradizionale dalla giurisdizione del Tribunale, per un periodo transitorio di sette
          anni prorogabile ad altri sette.
        </p>
        <div className="grid grid-cols-1 gap-4 mb-4 md :grid-cols-2">
          <div className="p-4 card">
            <h4 className="text-[13px] font-semibold mb-2">La procedura in breve</h4>
            <ul className="text-[12.5px] text-ink/80 space-y-1.5 list-disc list-inside">
              <li>Gratuita, richiesta online tramite lo strumento CMS del Tribunale Unificato.</li>
              <li>Solo dal titolare, o da tutti i co-titolari insieme  :mai da un licenziatario.</li>
              <li>Non reversibile in modo semplice : scaduto il periodo transitorio, non si torna indietro.</li>
              <li>Vale per tutta la vita del brevetto, non si estende alle domande divisionali.</li>
              <li>Finestra : un mese dalla pubblicazione della concessione per registrare l'effetto unitario.</li>
            </ul>
          </div>
          <div className="p-4 card">
            <h4 className="text-[13px] font-semibold mb-2">Quando conviene</h4>
            <table className="w-full text-[12px]">
              <tbody>
                {[
                  ["Brevetto gia' concesso in licenza", "Sì"],
                  ["Domanda di brevetto in licenza", "Sì"],
                  ["Rapporto di ricerca positivo, nessun emendamento rilevante", "No"],
                  ["Domande divisionali", "No"],
                  ["Vita residua sotto i 5 anni (salvo licenza)", "No"],
                ].map(([s, v], i) => (
                  <tr key={i} className="border-b border-line last :border-0">
                    <td className="py-1.5 pr-2">{s}</td>
                    <td className="py-1.5"><Badge tone={v === "Sì" ? "warn"  : "good"}>{v}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <OptOutDecisionTool />
      </section>

      <section className="mb-4">
        <h2 className="text-[17px] font-semibold mb-1">Piano di standardizzazione per l'Area TT</h2>
        <p className="text-[13px] text-muted mb-4 max-w-[65ch]">
          Basato sul Codice di condotta UE sulla standardizzazione (marzo 2023) e sulla scheda ASTP "Standardisation
           :a way to get IMPACT from research" (aprile 2025) : rendere gli uffici di trasferimento tecnologico
          pronti per la standardizzazione, un'azione concreta non solo un principio.
        </p>
        <div className="space-y-3">
          {[
            ["1. Chiarire la politica", "Verificare se UniTo ha gia' una politica di standardizzazione."],
            ["2. Collegarsi all'ente nazionale di standardizzazione", "Contattare UNI/CEI per ottenere l'elenco di chi in Ateneo gia' partecipa a comitati tecnici, e offrire formazione ai ricercatori su come proporsi."],
            ["3. Formare sul conflitto standardizzazione-brevetto", "Stessa logica del conflitto pubblicazione-vs-brevetto : partecipare troppo presto a uno standard puo' divulgare risultati prima del deposito. Serve la stessa disciplina della SOP sulla segretezza pre-deposito."],
            ["4. Inserire gli standard nella scouting", "Nel technology audit (Fase 2)chiedere se esistono standard rilevanti per questo risultato."],
            ["5. Segnalarlo nei progetti Horizon Europe", "Ogni progetto Horizon Europe puo' richiedere un collegamento con un comitato di standardizzazione pertinente: l'Area TT puo' segnalarlo proattivamente in fase di proposal."],
          ].map(([t, d], i) => (
            <div key={i} className="p-4 card">
              <p className="text-[13px] font-semibold mb-1">{t}</p>
              <p className="text-[12.5px] text-ink/80 max-w-[65ch]">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
