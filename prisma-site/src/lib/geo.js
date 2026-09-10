// Coordinate approssimate dei centri citta' noti in Piemonte, usate solo per
// posizionare sulla mappa gli attori di livello locale. Dove la citta' non e'
// nota si usa il centro di Torino con un piccolo scarto deterministico basato
// sull'id, dichiarato in interfaccia come approssimazione.
export const CITY_COORDS = {
  "Torino": [45.0703, 7.6869],
  "Colleretto Giacosa TO": [45.4383, 7.7256],
  "Piemonte": [45.0703, 7.6869],
  "Piemonte-Lombardia-VdA": [45.15, 7.9],
};

export function coordsFor(stakeholder) {
  const base = CITY_COORDS[stakeholder.citta_regione] || CITY_COORDS["Torino"];
  // scarto deterministico per evitare marker perfettamente sovrapposti;
  // divisore piu' piccolo di quanto sembri necessario perche' molti attori
  // condividono la stessa citta' e vanno comunque distinguibili allo zoom di default
  let h = 0;
  for (let i = 0; i < stakeholder.id.length; i++) h = (h * 31 + stakeholder.id.charCodeAt(i)) % 1000;
  const dx = ((h % 100) - 50) / 800;
  const dy = ((Math.floor(h / 100) % 100) - 50) / 800;
  return [base[0] + dy, base[1] + dx];
}
