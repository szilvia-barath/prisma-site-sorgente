import { useState, useRef } from "react";
import { motion } from "motion/react";
import LineSidebar from "../components/reactbits/LineSidebar";
import AnimatedList from "../components/reactbits/AnimatedList";
import StarStepper from "../components/StarStepper";
import { CV_IT, CV_EN } from "../data/cvData";
import { STAR_IT, STAR_EN } from "../data/starData";
import "./CVPage.css";

const SECTIONS_IT = ["Profilo", "Competenze", "Esperienza", "Formazione", "Pubblicazioni", "Lingue", "Storie STAR"];
const SECTIONS_EN = ["Profile", "Competences", "Experience", "Education", "Publications", "Languages", "STAR stories"];

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CVPage() {
  const [lang, setLang] = useState("it");
  const cv = lang === "it" ? CV_IT : CV_EN;
  const starData = lang === "it" ? STAR_IT : STAR_EN;
  const sectionLabels = lang === "it" ? SECTIONS_IT : SECTIONS_EN;
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  function scrollTo(index) {
    setActive(index);
    refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const initials = cv.nome.split(" ").map((w) => w[0]).join("");

  return (
    <div className="cv-page">
      <div className="cv-page__inner">
        <div className="cv-page__nav">
          <LineSidebar
            items={sectionLabels}
            activeIndex={active}
            onItemClick={(i) => scrollTo(i)}
          />
          <div className="cv-page__langtoggle">
            <button className={lang === "it" ? "is-active" : ""} onClick={() => setLang("it")}>IT</button>
            <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>

        <div>
          <motion.div
            className="cv-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="cv-hero__avatar">{initials}</div>
            <div>
              <h1 className="cv-hero__name">{cv.nome}</h1>
              <p className="cv-hero__title">{cv.titolo}</p>
              <div className="cv-hero__meta">
                <span>{cv.luogo}</span>
                {cv.contatti.map((c) => (
                  <a key={c.label} href={c.href}>{c.label}</a>
                ))}
              </div>
            </div>
          </motion.div>

          <FadeIn>
            <div className="cv-stats">
              {cv.stat.map((s, i) => (
                <div key={i} className="cv-stats__item">
                  <span className="cv-stats__n">{s.n}</span>
                  <span className="cv-stats__l">{s.l}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <section ref={(el) => (refs.current[0] = el)} className="cv-section">
            <h2>{sectionLabels[0]}</h2>
            <FadeIn><p className="cv-profile-text">{cv.profilo}</p></FadeIn>
          </section>

          <section ref={(el) => (refs.current[1] = el)} className="cv-section">
            <h2>{sectionLabels[1]}</h2>
            <AnimatedList
              items={cv.competenze}
              className="cv-competence-grid"
              renderItem={(c) => (
                <div className="cv-card">
                  <h4>{c.t}</h4>
                  <p>{c.d}</p>
                </div>
              )}
            />
          </section>

          <section ref={(el) => (refs.current[2] = el)} className="cv-section">
            <h2>{sectionLabels[2]}</h2>
            {cv.esperienza.map((e, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="cv-exp-item">
                  <h4>{e.ruolo}</h4>
                  <div className="cv-exp-ente">{e.ente}</div>
                  <div className="cv-exp-periodo">{e.periodo}</div>
                  <ul>{e.punti.map((p, j) => <li key={j}>{p}</li>)}</ul>
                </div>
              </FadeIn>
            ))}
          </section>

          <section ref={(el) => (refs.current[3] = el)} className="cv-section">
            <h2>{sectionLabels[3]}</h2>
            {cv.formazione.map((f, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="cv-edu-item">
                  <div className="cv-edu-periodo">{f.periodo}</div>
                  <h4>{f.titolo}</h4>
                  <div className="cv-edu-ente">{f.ente}</div>
                  {f.note && <div className="cv-edu-note">{f.note}</div>}
                </div>
              </FadeIn>
            ))}
          </section>

          <section ref={(el) => (refs.current[4] = el)} className="cv-section">
            <h2>{sectionLabels[4]}</h2>
            <FadeIn>
              <ul className="cv-pub-list">
                {cv.pubblicazioni.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </FadeIn>
          </section>

          <section ref={(el) => (refs.current[5] = el)} className="cv-section">
            <h2>{sectionLabels[5]}</h2>
            <FadeIn>
              <div className="cv-lang-row">
                {cv.lingue.map((l, i) => (
                  <span key={i} className="cv-lang-chip">{l.l}<b>{l.v}</b></span>
                ))}
              </div>
            </FadeIn>
          </section>

          <section ref={(el) => (refs.current[6] = el)} className="cv-section">
            <h2>{sectionLabels[6]}</h2>
            <StarStepper data={starData} lang={lang} />
          </section>
        </div>
      </div>
    </div>
  );
}
