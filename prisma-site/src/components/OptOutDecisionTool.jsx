import { useState } from "react";
import { Badge } from "./Badge";

const QUESTIONS = [
  { id: "licenza_concessa", text: "Il brevetto e' gia' concesso in licenza (a uno spin-off, una startup o un'azienda)?" },
  { id: "domanda_licenza", text: "E' una domanda di brevetto (non ancora concessa) gia' in licenza?" },
  { id: "rapporto_positivo", text: "Il rapporto di ricerca EPO era positivo e il brevetto e' stato concesso senza emendamenti rilevanti?" },
  { id: "divisionale", text: "E' una domanda divisionale?" },
  { id: "vita_residua_breve", text: "La vita residua del titolo e' inferiore a 5 anni e non e' in licenza?" },
];

export default function OptOutDecisionTool() {
  const [answers, setAnswers] = useState({});

  function set(id, val) {
    setAnswers({ ...answers, [id]: val });
  }

  const answered = Object.keys(answers).length === QUESTIONS.length;
  let verdict = null;
  if (answered) {
    if (answers.licenza_concessa || answers.domanda_licenza) verdict = "si";
    else if (answers.rapporto_positivo || answers.divisionale || answers.vita_residua_breve) verdict = "no";
    else verdict = "valutare";
  }

  const VERDICT_COPY = {
    si: { tone: "warn", label: "Opt-out consigliato", text: "Un titolo gia' in licenza o in via di licenza espone l'Ateneo e il licenziatario al rischio di nullita' estesa a tutti i Paesi UPC in un'unica causa. Registrare l'opt-out entro il periodo transitorio." },
    no: { tone: "good", label: "Opt-out probabilmente non necessario", text: "Un rapporto di ricerca positivo, una domanda divisionale o una vita residua breve senza licenza in corso riducono il rischio da gestire con l'opt-out. Restare sotto la giurisdizione del Tribunale Unificato." },
    valutare: { tone: "info", label: "Serve una valutazione caso per caso", text: "Nessuna delle condizioni nette si applica. Considerare fattori aggiuntivi: obsolescenza tecnologica, ampiezza della tutela, tipo di rivendicazioni, e se possibile un'analisi di validita' e FTO." },
  };

  return (
    <div className="card p-5">
      <h3 className="text-[14px] font-semibold mb-1">Strumento decisionale: opt-out si o no?</h3>
      <p className="text-[12.5px] text-muted mb-4 max-w-[60ch]">
        Rispondi alle domande per un titolo specifico in portafoglio. Basato sulla griglia del Working Paper Netval n.1/2023.
      </p>
      <div className="space-y-3">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0">
            <span className="text-[13px] flex-1">{q.text}</span>
            <div className="flex gap-1.5 shrink-0">
              {["si", "no"].map((v) => (
                <button
                  key={v}
                  onClick={() => set(q.id, v === "si")}
                  className={`px-3 py-1 rounded-full text-[12px] border ${answers[q.id] === (v === "si") ? "bg-ink text-bg border-ink" : "border-line"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {verdict && (
        <div className="mt-4 p-3.5 rounded-xl2 bg-tint/50">
          <Badge tone={VERDICT_COPY[verdict].tone}>{VERDICT_COPY[verdict].label}</Badge>
          <p className="text-[12.5px] mt-2 text-ink/80">{VERDICT_COPY[verdict].text}</p>
        </div>
      )}
      {!answered && (
        <p className="text-[11.5px] text-muted mt-3">Rispondi a tutte le domande per vedere l'indicazione.</p>
      )}
    </div>
  );
}
