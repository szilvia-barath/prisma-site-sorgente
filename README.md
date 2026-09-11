# PR.I.S.MA. KB — sito React

Base di conoscenza, mappa dell'ecosistema, proposta operativa e libreria SOP
per la selezione UNITO 2026_12 TD — Knowledge Transfer Manager.

## Avvio rapido

```bash
npm install
npm run dev       # sviluppo, http://localhost:5173
npm run build     # produzione, genera dist/
npm run preview   # serve dist/ in locale per controllarlo prima di pubblicare
```

Richiede Node 18 o superiore.

## Struttura

```
public/data/        i 15 CSV sorgente, caricati a runtime con PapaParse
src/
  lib/
    colors.js        palette dati (separata dalla palette UI)
    useCsv.js         hook di caricamento CSV + export CSV/JSON
    store.js           localStorage per le tue aggiunte (autovalutazioni,
                         log contatti, checklist, stakeholder/SOP proposti)
    geo.js              coordinate approssimate per la mappa
  components/         Sidebar, Topbar, StatCard, DataTable, EcosystemGraph...
  sections/            le sette sezioni del sito, una per file
  App.jsx              instrada tra le sezioni, gestisce densita' e focus
tailwind.config.js    i token della palette UI (Dull Black / Bold White / Juicy Lime...)
```

## Aggiornare i dati

I CSV in `public/data/` sono la fonte di verita'. Per aggiungere o correggere
una riga: modifica il CSV, salva, `npm run build`. Non serve toccare il codice
per contenuto nuovo — solo per una nuova sezione o un nuovo tipo di grafico.

Le aggiunte fatte **dall'interno del sito** (nuovo stakeholder, nuova SOP,
log dei contatti, autovalutazioni) restano nel `localStorage` del browser di
chi le inserisce: non modificano questi file. Per farle confluire nei CSV
sorgente, esportale dalla sezione *Dati ed esportazione* e incollale a mano.

## Pubblicarlo con una password (Cloudflare Pages + Access)

1. Carica questo progetto (compreso `public/data/`, escluso `node_modules`)
   su un repository GitHub, privato se preferisci.
2. Su Cloudflare Pages: *Connect to Git* → seleziona il repository.
   Build command: `npm run build`. Output directory: `dist`.
3. In Cloudflare Zero Trust → Access → Applications → Add an application →
   Self-hosted: inserisci il dominio assegnato da Pages.
4. Crea una policy: Action: Allow, Include: Emails → la tua email.
5. Fatto. Login con codice usa-e-getta via email; nessun altro vede nulla.

Gratuito fino a 50 utenti.

## Note tecniche

- React 19 + Vite, nessuna dipendenza da un backend: tutto statico.
- Tailwind per lo stile, con i colori del brief come token nominati
  (ink, bg, accent, accent2, tint) — mai i colori dei grafici nel chrome
  dell'interfaccia, per tenerli percettivamente separati.
- d3-force, non una libreria di grafi preconfezionata: il grafo
  dell'ecosistema e' costruito su misura per poter colorare diversamente
  gli archi in base allo stato (esistente/lacuna/ipotizzata).
- react-leaflet per la mappa, tile OpenStreetMap pubbliche, nessuna chiave API.
- Le posizioni sulla mappa sono approssimate sul centro della citta'
  dichiarata, con uno scarto deterministico per evitare marker
  perfettamente sovrapposti: non sono indirizzi reali.
- Un'unica build (~270 KB compressi): per un sito di uso personale non
  serve altro, ma se in futuro cresce vale la pena introdurre il code
  splitting per sezione (indicato dall'avviso di build).

## Verifiche svolte prima della consegna

Il sito e' stato compilato, servito e testato con Chromium headless
(Playwright): tutte le sette sezioni sono state visitate, il grafo e la
mappa sono stati cliccati, la ricerca e i filtri sono stati esercitati,
la modalita' focus e' stata attivata — zero errori in console. Due difetti
reali sono stati trovati e corretti in questo stesso passaggio: una
regola CSS che rendeva illeggibile la card scura del cruscotto, e due
righe del CSV con "organo" scritto per errore nella colonna livello.
