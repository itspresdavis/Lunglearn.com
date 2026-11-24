export function AlveolusSchematic() {
  return (
    <figure className="schema">
      <svg viewBox="0 0 320 180" role="img" aria-labelledby="alveolus-title alveolus-desc">
        <title id="alveolus-title">Schematic alveoli</title>
        <desc id="alveolus-desc">Circles representing adjacent alveoli with a thin shared wall and a capillary band. Not a micrograph and not to scale.</desc>
        <rect width="320" height="180" fill="#f4f8f8" />
        <circle cx="110" cy="90" r="58" fill="#f7e7df" stroke="#8a5a4a" />
        <circle cx="200" cy="90" r="58" fill="#f7e7df" stroke="#8a5a4a" />
        <path d="M154 40 v100" stroke="#1d4e89" strokeWidth="6" />
        <text x="16" y="24" fill="#142226" fontSize="13">air space</text>
        <text x="214" y="24" fill="#142226" fontSize="13">shared wall</text>
      </svg>
      <figcaption>A schematic of two alveoli and a shared wall. It is not a micrograph, and it is not the scale of the thoracic model.</figcaption>
    </figure>
  );
}

export function BreathSchematic() {
  return (
    <figure className="schema">
      <svg viewBox="0 0 360 200" role="img" aria-labelledby="breath-title breath-desc">
        <title id="breath-title">Schematic quiet breath</title>
        <desc id="breath-desc">A diaphragm line moves down and a lung outline grows slightly. The motion is a teaching animation, not a measured volume.</desc>
        <style>{`#lung{transform-origin:180px 90px;animation:grow 4s ease-in-out infinite}#diaphragm{animation:drop 4s ease-in-out infinite}@keyframes grow{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes drop{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}`}</style>
        <rect width="360" height="200" fill="#f4f8f8" />
        <path id="lung" d="M180 30 C230 30 270 70 270 120 C270 160 230 170 180 170 C130 170 90 160 90 120 C90 70 130 30 180 30 Z" fill="#f3ddd4" stroke="#8a5a4a" />
        <path id="diaphragm" d="M70 168 Q180 188 290 168" fill="none" stroke="#0e5c66" strokeWidth="4" />
        <text x="16" y="22" fill="#142226" fontSize="13">schematic inspiration</text>
      </svg>
      <figcaption>The outline enlarges and the diaphragm line descends. Real inspiration is three-dimensional, and this drawing does not show pleural pressure or volume.</figcaption>
    </figure>
  );
}

export function GasExchangeSchematic() {
  return (
    <figure className="schema">
      <svg viewBox="0 0 360 160" role="img" aria-labelledby="gas-title gas-desc">
        <title id="gas-title">Schematic gas exchange</title>
        <desc id="gas-desc">Arrows labeled oxygen and carbon dioxide cross a line between an air label and a blood label. Direction is simplified.</desc>
        <rect width="360" height="160" fill="#f4f8f8" />
        <rect x="30" y="40" width="120" height="80" fill="#f7e7df" stroke="#8a5a4a" />
        <rect x="210" y="40" width="120" height="80" fill="#e7eef6" stroke="#1d4e89" />
        <path d="M150 70 h60" stroke="#0e5c66" strokeWidth="3" markerEnd="url(#arrow)" />
        <path d="M210 100 h-60" stroke="#8a3b12" strokeWidth="3" />
        <text x="48" y="86" fill="#142226">alveolar air</text>
        <text x="236" y="86" fill="#142226">capillary</text>
        <text x="156" y="64" fill="#0e5c66" fontSize="12">O2</text>
        <text x="168" y="118" fill="#8a3b12" fontSize="12">CO2</text>
      </svg>
      <figcaption>Oxygen and carbon dioxide move by partial-pressure differences. The arrows omit hemoglobin, shunt, and diffusion limitation.</figcaption>
    </figure>
  );
}
