// Palette per i grafici e la codifica categoriale — MAI usata per il chrome dell'interfaccia.
export const DATAVIZ = {
  d1: "#C4E6A6", // Light Jade   — livello ateneo
  d2: "#66BDB0", // Tribal Turquoise — livello locale
  d3: "#5152A1", // Liberty      — livello nazionale
  d4: "#A36E90", // Warm Purple  — livello internazionale
  d5: "#FFB3AD", // Cornflower Bright — stato: lacuna / allerta
  d6: "#FFF0A6", // Silent Yellow — stato: ipotizzata / attenzione
};

export const LEVEL_COLOR = {
  ateneo: DATAVIZ.d1,
  locale: DATAVIZ.d2,
  nazionale: DATAVIZ.d3,
  internazionale: DATAVIZ.d4,
};

export const STATUS_COLOR = {
  esistente: "#61B136", // accent2 dalla palette UI: coerente col significato di "confermato"
  lacuna: DATAVIZ.d5,
  ipotizzata: DATAVIZ.d6,
};

export const SERIES = [DATAVIZ.d1, DATAVIZ.d2, DATAVIZ.d3, DATAVIZ.d4, DATAVIZ.d5, DATAVIZ.d6];
