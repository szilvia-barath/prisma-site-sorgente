import { useMemo, useState } from "react";
import { useCsv } from "../lib/useCsv";
import { Badge, Block, SourceNote } from "../components/Badge";

const THEORY = [
  {
    id: "reg-brevetti",
    title: "Regolamento dei Brevetti e della Proprieta' Intellettuale (D.R. 1997/2024)",
    area: "UniTo",
    body: "Nasce per adeguare l'Ateneo alla Legge 102/2023. I diritti morali restano all'inventore, quelli patrimoniali vanno all'Ateneo. L'inventore deve comunicare prontamente l'invenzione ed e' tenuto alla riservatezza almeno fino al deposito. L'Ateneo ha sei mesi per depositare, prorogabili di tre; oltre quel termine l'inventore puo' depositare a proprio nome. I proventi netti si dividono 50% inventore, 25% Fondo brevetti, 15% Dipartimento, 10% Fondo per iniziative a beneficio degli inventori. Copre anche banche dati e software, non solo invenzioni tecniche in senso stretto.",
    source: "src-reg-brevetti-2024",
  },
  {
    id: "reg-spinoff",
    title: "Regolamento sull'approvazione degli Spin off (D.R. 2111/2022)",
    area: "UniTo",
    body: "Distingue lo spin off dell'Universita', dove l'Ateneo e' socio tra il 5% e il 49% del capitale, dallo spin off accademico, dove l'Ateneo non ha quote ma approva comunque il progetto. Il dipendente non puo' avere un rapporto di lavoro subordinato con lo spin off; se assume cariche con deleghe e compensi superiori al proprio stipendio va in aspettativa senza assegni. Rettore, componenti di CdA e Senato, direttori di Dipartimento e membri delle Commissioni Brevetti e Spin off non possono assumere cariche direttive negli spin off.",
    source: "src-reg-spinoff-2022",
  },
  {
    id: "statuto",
    title: "Statuto di Ateneo (D.R. 1730/2012)",
    area: "UniTo",
    body: "L'art. 5 fonda la terza missione: l'Universita' promuove il trasferimento della conoscenza al sistema economico e sociale, non solo tramite brevetti ma anche tramite nuove imprese. Il Senato Accademico propone e nomina le Commissioni; il Consiglio di Amministrazione delibera e impegna il patrimonio. L'art. 38 lega esplicitamente l'accesso aperto al rispetto della proprieta' intellettuale.",
    source: "src-statuto-2012",
  },
  {
    id: "l102",
    title: "Legge 102/2023 e la riforma della titolarita'",
    area: "Normativa nazionale",
    body: "Riscrive l'art. 65 del Codice della Proprieta' Industriale: la titolarita' delle invenzioni dei ricercatori spetta in prima battuta all'ente, e solo in caso di inerzia dell'ente torna al ricercatore. Fino ad allora l'Italia era, con la Svezia, un'eccezione in Europa nel lasciare la titolarita' al singolo ricercatore.",
    source: "src-l102-2023",
  },
  {
    id: "bando-mimit",
    title: "Bando MIMIT per il potenziamento degli UTT 2025-2027",
    area: "Policy nazionale",
    body: "Finanzia il potenziamento degli uffici di trasferimento tecnologico di universita', enti pubblici di ricerca e IRCCS, per aumentare l'intensita' dei flussi verso le imprese, in particolare le PMI. E' la fonte di finanziamento del progetto PR.I.S.MA. e di questo stesso ruolo.",
    source: "src-bando-mimit-utt",
  },
  {
    id: "netval-ks",
    title: "Netval e Knowledge Share",
    area: "Ecosistema nazionale",
    body: "Netval coordina la rete nazionale degli uffici di trasferimento tecnologico e la survey annuale che alimenta gli indicatori DatiUTT. Knowledge Share, nata dalla collaborazione di MIMIT-UIBM, Netval e Politecnico di Torino, e' la vetrina nazionale dei brevetti accademici: UniTo vi pubblica gia' le proprie schede.",
    source: "src-brevetti-unito-sito",
  },
  {
    id: "poc-pov",
    title: "PoC Instrument e Proof of Value a UniTo",
    area: "Finanziamento locale",
    body: "I bandi PoC e PoV di UniTo sono finanziati dalla Fondazione Compagnia di San Paolo nell'ambito dell'Accordo 2025-2026 con l'Ateneo, ed eseguiti da Intesa Sanpaolo Innovation Center (ISPIC) con il supporto degli incubatori 2i3T e I3P. Il PoC alza il TRL di un brevetto gia' depositato; il PoV si rivolge a risultati non brevettuali, incluse le scienze umane e sociali.",
    source: "src-poc-instrument-2026",
  },
  {
    id: "s3-piemonte",
    title: "S3 Regione Piemonte 2021-2027",
    area: "Policy regionale",
    body: "La strategia di specializzazione intelligente e' condizione abilitante per l'uso dei fondi europei FESR e FSE+. Il bando chiede esplicitamente di allineare le attivita' dell'ufficio a questa strategia regionale.",
    source: "src-bando-2026-12",
  },
  {
    id: "valorizzazione-ue",
    title: "Valorizzazione della conoscenza nella policy europea",
    area: "Policy europea",
    body: "La Raccomandazione del Consiglio UE 2022/2415 estende il concetto di valorizzazione a tutti i risultati della ricerca, non solo ai brevetti: rilevante in modo diretto per lo scouting nelle scienze umane e sociali richiesto dal bando. Horizon Europe stabilisce le proprie regole su titolarita' dei risultati e obblighi di disseminazione.",
    source: "src-racc-2022",
  },
  {
    id: "ktt-metrics-teoria",
    title: "Il cubo delle metriche KTT",
    area: "Metriche europee",
    body: "Il White Paper ASTP endorsed by NAAC (2025) propone di pensare alle metriche del trasferimento tecnologico come un cubo a tre dimensioni: input/output/impatto, interno/esterno, e i canali di trasferimento (brevetti, licenze, spin-off, formazione, consulenza). I sistemi europei oggi misurano quasi solo l'output; input esterni e impatto restano in gran parte scoperti. Approfondimento con visualizzazione interattiva nella sezione Metriche KTT.",
    source: "src-astp-whitepaper-ktt",
  },
  {
    id: "storia-utt",
    title: "La storia dei bandi UTT: da dove viene questo ruolo",
    area: "Genealogia del progetto",
    body: "Il ruolo Knowledge Transfer Manager nasce con il primo bando UTT (2016-2017): Linea 1 finanzia posizioni KTM orientate allo scouting, Linea 2 posizioni Innovation Promoter orientate alla negoziazione commerciale. UniTo ha partecipato solo alla Linea 1 in entrambe le prime due edizioni. Nell'edizione piu' recente (Bando UTT 2025, GU n.80/2025) sono stati ammessi a finanziamento 90 progetti su 101 proposte, presentati da 68 soggetti (48 Universita', 5 EPR, 15 IRCCS), per 7,65 milioni di euro e 140 figure professionali: 110 Knowledge Transfer Manager e 30 Innovation Promoter. In parallelo e' proseguito il monitoraggio del Bando UTT PNRR 2023-2025 (91 progetti, 66 soggetti). La piattaforma DatiUTT ha ricevuto un'implementazione funzionale significativa nel 2024.",
    source: "src-bando-utt-gov-2025-26",
  },
  {
    id: "vuoto-ssh-teoria",
    title: "Il vuoto nelle scienze umane e sociali: conferma europea",
    area: "Valorizzazione SSH",
    body: "Il deliverable D2.1 del progetto Horizon Europe IAM4RE.eu (luglio 2025, con ASTP tra gli autori) conferma che la valorizzazione interdisciplinare, in particolare nelle scienze sociali e umane, resta sottoservita e viene spesso ridotta a nozioni base di proprieta' intellettuale o a consigli generici sulla disseminazione. Lo studio segnala anche formazione quasi assente sulla standardizzazione, percorsi frammentati senza progressione tra livelli, e mancanza di una strategia istituzionale che integri PI, scienza aperta e standardizzazione. Cita REVALORISE+ come programma europeo di riferimento per la formazione alla valorizzazione nelle SSH.",
    source: "src-iam4re-d21-2025",
  },
  {
    id: "standardizzazione-teoria",
    title: "La standardizzazione come canale di valorizzazione dimenticato",
    area: "Canali di valorizzazione",
    body: "Il Codice di condotta della Commissione Europea sulla standardizzazione nello Spazio Europeo della Ricerca (marzo 2023) raccomanda esplicitamente di rendere gli uffici di trasferimento tecnologico pronti per la standardizzazione. Gli standard tecnici sono un canale di valorizzazione distinto dal brevetto, con lo stesso punto di tensione del conflitto pubblicazione-vs-brevetto: partecipare troppo presto a uno standard puo' compromettere la novita' di un'invenzione. Piano operativo dettagliato nella sezione Metriche KTT.",
    source: "src-astp-standardisation-2025",
  },
  {
    id: "rm-comp-teoria",
    title: "RM COMP: la professionalizzazione del research management",
    area: "Contesto europeo del mestiere",
    body: "Il 27 gennaio 2025 la Commissione Europea ha lanciato RM Comp, il framework europeo di competenze per i research manager, sviluppato dai progetti Horizon Europe CARDEA e RM Roadmap (con ASTP tra gli otto partner di quest'ultimo). Il framework ha tre dimensioni: 7 aree di competenza (capacita' cognitive/attributi personali, competenza tecnica, supervisione dei progetti di ricerca, coinvolgimento degli stakeholder, gestione del personale e sviluppo dei talenti, comunicazione, competenza specialistica di dominio), 50 competenze, 800 risultati di apprendimento su 4 livelli di padronanza (foundational, intermediate, advanced, expert). Il ruolo KTM e' una delle figure specialistiche di questa professione piu' ampia.",
    source: "src-rmcomp-ec-2025",
  },
  {
    id: "opt-out-teoria",
    title: "Il brevetto unitario e la procedura di opt-out",
    area: "Strumenti tecnici",
    body: "Un brevetto unitario e' un titolo unico e indivisibile: se il Tribunale Unificato dei Brevetti lo dichiara nullo, perde efficacia in tutti gli Stati aderenti contemporaneamente. Per un periodo transitorio di sette anni (prorogabile ad altri sette), il titolare di un brevetto europeo tradizionale puo' escluderlo dalla giurisdizione del Tribunale tramite la procedura di opt-out, gratuita ma non reversibile una volta scaduto il periodo. Griglia decisionale e strumento interattivo nella sezione Metriche KTT.",
    source: "src-netval-wp1-2023-unitario",
  },
  {
    id: "netval-legittimita-teoria",
    title: "Perche' le reti come Netval contano davvero",
    area: "Teoria organizzativa",
    body: "Uno studio pubblicato su Technovation (Grimaldi, Meoli, Piccaluga, Tolin) analizza Netval come caso longitudinale di 'associazione di scambio di conoscenza' (KEA): gli uffici di trasferimento tecnologico vi aderiscono per due motivi distinti: costruire legittimita' (interna verso il proprio Ateneo, esterna verso policymaker e finanziatori) e cercare apprendimento tra pari. Netval ha attraversato tre fasi evolutive: aggregazione (2001-2007), consolidamento (2008-2015), impatto (fase piu' recente). E' lo stesso bisogno: formazione e affiancamento: che la Fase 1 del progetto persegue a livello individuale.",
    source: "src-technovation-netval-2026",
  },
  {
    id: "spinout-benchmark-teoria",
    title: "Il quadro internazionale: dove sta l'Europa, e Torino",
    area: "Benchmark internazionale",
    body: "Il Dealroom European Spinouts Report 2025 conta 17.000 spin-off europei dal 1990, di cui 7.300 in deep tech e scienze della vita, con un valore d'impresa combinato di 398 miliardi di dollari (39% creato da spin-off nati dal 2015). Torino compare esplicitamente nella mappa dei poli europei di spinout universitari, insieme a Grenoble, Lione, Monaco e Vienna. Va detto con onesta': un report distinto del 2026 su due super-cluster europei (New Palo Alto e Alpine Tech Cluster, che include Grenoble Monaco e Vienna) non nomina Torino tra questi due raggruppamenti: il riconoscimento sembra derivare piu' dall'ecosistema cittadino nel suo insieme che da una singola istituzione.",
    source: "src-european-spinouts-2025",
  },
];

export default function KnowledgeBase({ query }) {
  const glossario = useCsv("03_glossario_concetti.csv");
  const fonti = useCsv("04_fonti.csv");
  const [tab, setTab] = useState("teoria");
  const [area, setArea] = useState("tutte");

  const aree = useMemo(() => ["tutte", ...new Set((glossario.rows || []).map((c) => c.area))], [glossario.rows]);

  const filteredGloss = useMemo(() => {
    let r = glossario.rows || [];
    if (area !== "tutte") r = r.filter((c) => c.area === area);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((c) => (c.termine + c.definizione_breve).toLowerCase().includes(q));
    }
    return r;
  }, [glossario.rows, area, query]);

  const filteredTheory = useMemo(() => {
    if (!query) return THEORY;
    const q = query.toLowerCase();
    return THEORY.filter((t) => (t.title + t.body).toLowerCase().includes(q));
  }, [query]);

  const fonteById = (id) => (fonti.rows || []).find((f) => f.id === id);

  return (
    <div className="max-w-[1180px]">
      <div className="flex gap-1 p-1 mb-6 rounded-full bg-tint/50 w-fit">
        {[["teoria", "Contesto e teoria"], ["glossario", "Glossario"], ["fonti", "Fonti normative"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${tab === id ? "bg-ink text-bg": "text-ink/70"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "teoria" && (
        <div className="space-y-6">
          {filteredTheory.map((t) => {
            const f = fonteById(t.source);
            return (
              <Block key={t.id} source={f ? `${f.titolo}: ${f.editore}. ${f.note_locator || ""}`: t.source}>
                <Badge>{t.area}</Badge>
                <h3 className="text-[15px] font-semibold mt-2 mb-2">{t.title}</h3>
                <p className="text-[13.5px] text-ink/80 max-w-[68ch]">{t.body}</p>
              </Block>
            );
          })}
        </div>
      )}

      {tab === "glossario" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {aree.map((a) => (
              <button key={a} className="chip" aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredGloss.map((c) => (
              <details key={c.id} className="p-4 card">
                <summary className="flex items-center justify-between gap-2 list-none cursor-pointer">
                  <span>
                    <span className="text-[13.5px] font-semibold">{c.termine}</span>
                    {c.termine_en && <span className="text-[12px] text-muted italic ml-2">{c.termine_en}</span>}
                  </span>
                  <Badge>{c.area}</Badge>
                </summary>
                {c.acronimo_esteso && <p className="text-[11.5px] text-muted mt-1.5 font-mono">{c.acronimo_esteso}</p>}
                <p className="text-[13px] text-ink/80 mt-2">{c.definizione_breve}</p>
                {c.esempio_applicato && <p className="text-[12.5px] text-muted mt-1.5"><b>Esempio:</b> {c.esempio_applicato}</p>}
              </details>
            ))}
          </div>
        </div>
      )}

      {tab === "fonti" && (
        <div className="overflow-hidden card">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left border-b bg-tint/40 border-line">
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Titolo</th>
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Tipo</th>
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Affidabilita'</th>
                <th className="px-3.5 py-2.5 font-semibold text-[12px] uppercase text-muted">Locatore</th>
              </tr>
            </thead>
            <tbody>
              {(fonti.rows || []).map((f) => (
                <tr key={f.id} className="border-b border-line last:border-0">
                  <td className="px-3.5 py-2.5 font-medium">{f.url ? <a href={f.url} target="_blank" rel="noreferrer" className="underline">{f.titolo}</a>: f.titolo}</td>
                  <td className="px-3.5 py-2.5"><Badge>{f.tipo}</Badge></td>
                  <td className="px-3.5 py-2.5"><Badge tone={f.livello_affidabilita === "A_primaria" ? "good": "info"}>{f.livello_affidabilita}</Badge></td>
                  <td className="px-3.5 py-2.5 text-muted">{f.note_locator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
