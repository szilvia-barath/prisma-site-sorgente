import { useMemo, useRef, useState } from "react";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceRadial } from "d3-force";
import { LEVEL_COLOR, STATUS_COLOR } from "../lib/colors";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const RING = { ateneo: 70, locale: 150, nazionale: 230, internazionale: 300 };

export default function EcosystemGraph({ nodes, links, onSelect, selectedId, width = 860, height = 540 }) {
  const [tick, setTick] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panning = useRef(null);
  const simRef = useRef(null);
  const nodesRef = useRef([]);
  const dragging = useRef(null);

  const laidOut = useMemo(() => {
    const n = nodes.map((d) => ({ ...d }));
    const idIndex = new Map(n.map((d, i) => [d.id, i]));
    const l = links
      .filter((e) => idIndex.has(e.origine_id) && idIndex.has(e.destinazione_id))
      .map((e) => ({ ...e, source: e.origine_id, target: e.destinazione_id }));

    const sim = forceSimulation(n)
      .force("charge", forceManyBody().strength(-90))
      .force("link", forceLink(l).id((d) => d.id).distance(58).strength(0.5))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(16))
      .force("radial", forceRadial((d) => RING[d.livello] || 260, width / 2, height / 2).strength(0.35))
      .stop();

    for (let i = 0; i < 260; i++) sim.tick();

    nodesRef.current = n;
    simRef.current = sim;
    return { n, l, idIndex };
  }, [nodes, links, width, height]);

  // forza un re-render dopo il drag manuale
  const nodeById = new Map(laidOut.n.map((d) => [d.id, d]));

  function onPointerDown(e, d) {
    dragging.current = d;
  }
  function onBgPointerDown(e) {
    if (dragging.current) return;
    panning.current = { startX: e.clientX, startY: e.clientY, origPan: { ...pan } };
  }
  function onPointerMove(e) {
    if (dragging.current) {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = width / rect.width, scaleY = height / rect.height;
      dragging.current.x = (e.clientX - rect.left) * scaleX / zoom - pan.x / zoom;
      dragging.current.y = (e.clientY - rect.top) * scaleY / zoom - pan.y / zoom;
      setTick((t) => t + 1);
      return;
    }
    if (panning.current) {
      const dx = e.clientX - panning.current.startX;
      const dy = e.clientY - panning.current.startY;
      setPan({ x: panning.current.origPan.x + dx, y: panning.current.origPan.y + dy });
    }
  }
  function onPointerUp() { dragging.current = null; panning.current = null; }
  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(3, Math.max(0.5, +(z + delta).toFixed(2))));
  }
  function resetView() { setZoom(1); setPan({ x: 0, y: 0 }); }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 bg-white/90 rounded-lg border border-line p-1">
        <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))} className="p-1.5 hover:bg-tint rounded" title="Ingrandisci"><ZoomIn size={14} /></button>
        <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.2).toFixed(2)))} className="p-1.5 hover:bg-tint rounded" title="Rimpicciolisci"><ZoomOut size={14} /></button>
        <button onClick={resetView} className="p-1.5 hover:bg-tint rounded" title="Adatta alla vista"><Maximize2 size={14} /></button>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerDown={onBgPointerDown}
        onWheel={onWheel}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
        {laidOut.l.map((e, i) => {
        const s = nodeById.get(e.source.id ?? e.source);
        const t = nodeById.get(e.target.id ?? e.target);
        if (!s || !t) return null;
        const dash = e.stato === "lacuna" ? "6 4" : e.stato === "ipotizzata" ? "1.5 4" : "0";
        return (
          <line
            key={i}
            x1={s.x} y1={s.y} x2={t.x} y2={t.y}
            stroke={STATUS_COLOR[e.stato] || "#D8D8D5"}
            strokeWidth={e.stato === "esistente" ? 1.4 : 1.1}
            strokeDasharray={dash}
            opacity={0.75}
          />
        );
      })}
      {laidOut.n.map((d) => {
        const active = selectedId === d.id;
        return (
          <g
            key={d.id}
            transform={`translate(${d.x},${d.y})`}
            onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, d); }}
            onClick={(e) => { e.stopPropagation(); onSelect(d.id); }}
            className="cursor-pointer"
          >
            <circle
              r={active ? 10 : 6.5}
              fill={LEVEL_COLOR[d.livello] || "#999"}
              stroke={active ? "#161616" : "#fff"}
              strokeWidth={active ? 2 : 1.2}
            />
            {active && (
              <text y={-14} textAnchor="middle" fontSize="11" fontWeight={600} fill="#161616">
                {d.nome.length > 30 ? d.nome.slice(0, 28) + "…" : d.nome}
              </text>
            )}
          </g>
        );
      })}
        </g>
      </svg>
    </div>
  );
}
