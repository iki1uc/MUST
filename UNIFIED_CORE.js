// UNIFIED_CORE.js
// Komprimierte Gesamtlogik: MUST + AUTO + LOAD + PIPE + VECTOR

// -------------------------------------------------------------
// 1) MUST – Pflichtmatrix
// -------------------------------------------------------------
const MUST = {
  "ANKER": true,
  "EDIT": true,
  "LIST": true,
  "RUN": true,
  "j": true,
  "c": true,
  "+OIN=": true
};

// -------------------------------------------------------------
// 2) LOAD_MAP – automatisch aus MUST erzeugt
// -------------------------------------------------------------
const LOAD_MAP = Object.fromEntries(
  Object.keys(MUST).map(key => [key, `./LOAD/${key}.room`])
);

// ANKER.raw Sonderfall
LOAD_MAP["ANKER"] = "./LOAD/ANKER.raw";

// -------------------------------------------------------------
// 3) VECTOR – Prüfen ob Raum vektorisiert werden kann
// -------------------------------------------------------------
function VECTOR_CHECK(room){
  return ["j","c","+OIN="].includes(room);
}

// -------------------------------------------------------------
// 4) AUTO – RESPO erzeugen + MUST prüfen + LOAD synchronisieren
// -------------------------------------------------------------
async function AUTO(respo){

  // Pflichtprüfung
  if(!MUST[respo.room]){
    return { error: "ROOM_NOT_ALLOWED", room: respo.room };
  }

  // LOAD
  const loadPath = LOAD_MAP[respo.room];
  const loadData = await fetch(loadPath).then(r => r.text());

  // VECTOR
  const vector = VECTOR_CHECK(respo.room);

  // AUTO RESPO erweitert
  return {
    room: respo.room,
    axis: respo.axis,
    orbit: respo.orbit,
    pulse: respo.pulse,
    tick: respo.tick,

    load: loadData,
    vector: vector,
    stamp: Date.now()
  };
}

// -------------------------------------------------------------
// 5) PIPE – 3 Optionen
// -------------------------------------------------------------
function PIPE(data, option = 1){

  switch(option){

    // OPTION 1: RAW → RESPO
    case 1:
      return {
        raw: data.load,
        respo: {
          axis: data.axis,
          orbit: data.orbit,
          pulse: data.pulse
        }
      };

    // OPTION 2: RESPO → FORM
    case 2:
      return {
        form: {
          valid: data.pulse === "good",
          vector: data.vector,
          stamp: data.stamp
        }
      };

    // OPTION 3: FORM → EVO
    case 3:
      return {
        evo: {
          gen: (data.axis + data.orbit) % 99,
          rev: Math.abs(data.axis - data.orbit),
          adapt: (data.pulse === "good" ? 1 : 0) + data.orbit
        }
      };
  }
}

// -------------------------------------------------------------
// EXPORT
// -------------------------------------------------------------
export { MUST, LOAD_MAP, VECTOR_CHECK, AUTO, PIPE };
