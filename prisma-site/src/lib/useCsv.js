import { useEffect, useState } from "react";
import Papa from "papaparse";

const cache = {};

export function useCsv(filename) {
  const [rows, setRows] = useState(cache[filename] || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache[filename]) { setRows(cache[filename]); return; }
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Impossibile leggere ${filename}`);
        return r.text();
      })
      .then((text) => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        if (!cancelled) {
          cache[filename] = parsed.data;
          setRows(parsed.data);
        }
      })
      .catch((e) => !cancelled && setError(e));
    return () => { cancelled = true; };
  }, [filename]);

  return { rows, error, loading: rows === null && !error };
}

export function toCSV(rows) {
  if (!rows || !rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
}

export function download(filename, text, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
