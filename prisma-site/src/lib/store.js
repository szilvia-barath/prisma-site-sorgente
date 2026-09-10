// Tutto quello che l'utente aggiunge dopo la consegna dei dati (autovalutazioni,
// log dei contatti, stato della checklist, nuove SOP o stakeholder proposti)
// vive qui: nel localStorage del browser. Niente lascia il dispositivo senza
// un'azione esplicita di esportazione. Vedi la sezione "Dati ed esportazione".

const KEY = "prisma-kb-v2";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeAll(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch { /* quota piena: ignorato */ }
}

export function getSlice(name, fallback) {
  const all = readAll();
  return all[name] ?? fallback;
}
export function setSlice(name, value) {
  const all = readAll();
  all[name] = value;
  writeAll(all);
}
export function exportAll() {
  return JSON.stringify(readAll(), null, 2);
}
export function importAll(json) {
  const parsed = JSON.parse(json);
  writeAll(parsed);
}
export function clearAll() {
  localStorage.removeItem(KEY);
}
