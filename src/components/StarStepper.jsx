import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATO_LABEL = { lacuna: "da costruire", parziale: "parziale", solida: "solida" };
const STATO_LABEL_EN = { lacuna: "to build", parziale: "partial", solida: "solid" };

export default function StarStepper({ data, lang = "it" }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const item = data[i];
  const labels = lang === "it" ? { s: "Situazione", t: "Compito", a: "Azione", r: "Risultato" } : { s: "Situation", t: "Task", a: "Action", r: "Result" };
  const statoLabel = lang === "it" ? STATO_LABEL : STATO_LABEL_EN;

  function go(next) {
    setDir(next > i ? 1 : -1);
    setI(Math.max(0, Math.min(data.length - 1, next)));
  }

  return (
    <div className="star-stepper">
      <div className="star-stepper__track">
        {data.map((d, idx) => (
          <button
            key={d.n}
            className={`star-stepper__dot${idx === i ? " is-active" : ""}${idx < i ? " is-done" : ""}`}
            onClick={() => go(idx)}
            aria-label={`${d.titolo}`}
          >
            <span className="star-stepper__dot-n">{String(idx + 1).padStart(2, "0")}</span>
          </button>
        ))}
        <div className="star-stepper__line">
          <div className="star-stepper__line-fill" style={{ width: `${(i / (data.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="star-stepper__stage">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={item.n}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="star-stepper__panel"
          >
            <div className="star-stepper__head">
              <span className={`star-stepper__badge star-stepper__badge--${item.stato}`}>{statoLabel[item.stato]}</span>
              <h3>{item.titolo}</h3>
            </div>
            <div className="star-stepper__grid">
              <div className="star-block">
                <span className="star-block__tag">{labels.s}</span>
                <p>{item.s}</p>
              </div>
              <div className="star-block">
                <span className="star-block__tag">{labels.t}</span>
                <p>{item.t}</p>
              </div>
              <div className="star-block">
                <span className="star-block__tag">{labels.a}</span>
                <p>{item.a}</p>
              </div>
              <div className="star-block star-block--result">
                <span className="star-block__tag">{labels.r}</span>
                <p>{item.r}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="star-stepper__nav">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="star-stepper__navbtn">
          <ChevronLeft size={16} /> {lang === "it" ? "precedente" : "previous"}
        </button>
        <span className="star-stepper__count">{i + 1} / {data.length}</span>
        <button onClick={() => go(i + 1)} disabled={i === data.length - 1} className="star-stepper__navbtn">
          {lang === "it" ? "successivo" : "next"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
