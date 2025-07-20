const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.querySelector(".spin");
const input = document.getElementById("opzione");
const resultDiv = document.getElementById("result");

let entries = [];     // testi
let colors = [];      // colori casuali
let angleOffset = 0;
let isSpinning = false;
let spinVelocity = 0;

// funzione per generare un colore esadecimale casuale
function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// Aggiunge un'opzione con colore
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = input.value.trim();
    if (!val) return;
    entries.push(val);
    colors.push(randomColor());
    input.value = "";
    drawWheel();
  }
});

// Avvia la rotazione
spinBtn.addEventListener("click", () => {
  if (!isSpinning && entries.length > 1) {
    spinVelocity = Math.random() * 0.3 + 0.4;
    isSpinning = true;
    resultDiv.textContent = ""; // pulisco il risultato
    requestAnimationFrame(animate);
  }
});

// Disegna la ruota con i colori
function drawWheel() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 140;
  const n = entries.length;
  const sliceAngle = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < n; i++) {
    const start = angleOffset + i * sliceAngle;
    const end = start + sliceAngle;

    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fill();

    // testo
   ctx.save();
ctx.translate(cx, cy);
ctx.rotate(start + sliceAngle / 2);
ctx.textAlign = "right";
// testo più grande e più scuro
ctx.fillStyle = "#222";
ctx.font = "bold 18px sans-serif";
ctx.fillText(entries[i], radius - 10, 8);
ctx.restore();
  }
}

// Animazione + calcolo vincitore
function animate() {
  angleOffset += spinVelocity;
  spinVelocity *= 0.97;
  drawWheel();

  if (spinVelocity < 0.002) {
    isSpinning = false;
    // calcolo indice vincente
    const n = entries.length;
    // normalizzo l'offset in [0, 2π)
    const norm = (angleOffset % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    // lo spicchio che finisce sotto la freccia (che punta a 90° in alto)
    // l'angolo di start di uno spicchio i è start = i*sliceAngle + offset
    // risolvo i = floor((n*0.25π - norm) / sliceAngle) mod n
    const sliceAngle = (2 * Math.PI) / n;
    // angolo della freccia è -π/2 rispetto al sistema di canvas
    const arrowAngle = -Math.PI / 2;
    // delta angolo tra freccia e offset
    let delta = (arrowAngle - norm + 2 * Math.PI) % (2 * Math.PI);
    let winnerIndex = Math.floor(delta / sliceAngle) % n;

    // mostro il risultato
    resultDiv.textContent = `Risultato: ${entries[winnerIndex]}`;
  } else {
    requestAnimationFrame(animate);
  }
}

// disegno iniziale vuoto
drawWheel();
