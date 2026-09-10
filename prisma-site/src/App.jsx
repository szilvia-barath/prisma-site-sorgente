import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./sections/Home";
import KnowledgeBase from "./sections/KnowledgeBase";
import MetricsPage from "./sections/MetricsPage";
import Ecosystem from "./sections/Ecosystem";
import ProposalPhases from "./sections/ProposalPhases";
import SopLibrary from "./sections/SopLibrary";
import FontiPage from "./sections/FontiPage";
import ExamPrep from "./sections/ExamPrep";
import CVPage from "./sections/CVPage";
import DataExport from "./sections/DataExport";

const TITLES = {
  home: ["Dashboard", "Il progetto, i numeri, l'accesso rapido a tutto il resto"],
  kb: ["Base di conoscenza", "Teoria, contesto e fonti normative con testo integrale"],
  metrics: ["Metriche KTT", "Il framework europeo per misurare il trasferimento tecnologico"],
  ecosystem: ["Ecosistema", "Grafo, mappa, elenco e opportunita' di connessione"],
  proposal: ["Proposta operativa", "Le quattro fasi del progetto con metodo, rischio e valutazione"],
  sop: ["Libreria SOP", "Ecosistema vivente di procedure operative"],
  fonti: ["Fonti", "Bibliografia annotata di tutte le fonti del sito"],
  exam: ["Preparazione esame", "Programma d'esame, numeri chiave, matrice ed evidenze"],
  cv: ["CV & STAR", "Il mio profilo e le storie STAR dietro ogni competenza"],
  data: ["Dati ed esportazione", "Ogni tabella e' tua, sempre"],
};

export default function App() {
  const [view, setView] = useState("home");
  const [density, setDensity] = useState("ariosa");
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => { document.body.dataset.density = density; }, [density]);
  useEffect(() => { document.body.classList.toggle("focus-mode", focus); }, [focus]);

  const [title, subtitle] = TITLES[view];

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar view={view} setView={setView} density={density} setDensity={setDensity} focus={focus} setFocus={setFocus} />
      <div className="app-main ml-[236px]">
        <Topbar query={query} setQuery={setQuery} title={title} subtitle={subtitle} />
        <main className="px-8 py-7">
          {view === "home" && <Home setView={setView} />}
          {view === "kb" && <KnowledgeBase query={query} />}
          {view === "metrics" && <MetricsPage query={query} />}
          {view === "ecosystem" && <Ecosystem query={query} />}
          {view === "proposal" && <ProposalPhases query={query} />}
          {view === "sop" && <SopLibrary query={query} />}
          {view === "fonti" && <FontiPage query={query} />}
          {view === "exam" && <ExamPrep query={query} />}
          {view === "cv" && <CVPage />}
          {view === "data" && <DataExport />}
        </main>
      </div>
    </div>
  );
}
