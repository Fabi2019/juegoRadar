const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');
const targetCoordsEl = document.getElementById('target-coords');
const targetRadiusEl = document.getElementById('target-radius');
const logEl = document.getElementById('impact-log');

let score = 0;
const scale = 22; 
const offset = 250; 
let target = { x: 0, y: 0, r: 0 };
let visible = false;

function initLevel() {
    target.r = Math.floor(Math.random() * 2) + 1; 
    let limite = 10 - target.r;
    target.x = Math.floor(Math.random() * (limite * 2 + 1)) - limite;
    target.y = Math.floor(Math.random() * (limite * 2 + 1)) - limite;

    targetCoordsEl.innerText = `(${target.x}, ${target.y})`;
    targetRadiusEl.innerText = target.r;
    
    visible = true;
    dibujarEscena();
    feedbackEl.innerText = "MEMORIZA...";
    
    setTimeout(() => {
        visible = false;
        dibujarEscena();
        feedbackEl.innerText = "¡DISPARA!";
    }, 2000);
}

function dibujarEscena() {
    ctx.clearRect(0, 0, 500, 500);
    
    // Configuración de texto
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Rejilla y Números
    for(let i = -10; i <= 10; i++) {
        let p = offset + (i * scale);
        
        // Dibujar líneas
        ctx.lineWidth = 1;
        ctx.strokeStyle = (i === 0) ? "#00ff41" : "#002200";
        ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 500); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(500, p); ctx.stroke();

        // Dibujar números de la escala (solo si no es el centro 0)
        if(i !== 0) {
            ctx.fillStyle = "#008800";
            // Números en el eje X (le sumamos 5 para que no se corte en el borde izquierdo)
            let posX = (p < 20) ? p + 12 : p; 
            ctx.fillText(i, posX, offset + 12); 
            
            // Números en el eje Y
            ctx.fillText(-i, offset - 12, p); 
        }
    }

    // Objetivo (Círculo)
    if (visible) {
        ctx.beginPath();
        ctx.arc(offset + (target.x * scale), offset - (target.y * scale), target.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 65, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "#00ff41";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}


canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (500 / rect.width);
    const y = (e.clientY - rect.top) * (500 / rect.height);
    const cartX = (x - offset) / scale;
    const cartY = (offset - y) / scale;

    const dist = Math.sqrt(Math.pow(cartX - target.x, 2) + Math.pow(cartY - target.y, 2));

    if (dist <= target.r) {
        score += 20;
        scoreEl.innerText = score;
        logEl.innerHTML += `<div class="log-entry">OK: (${target.x}, ${target.y})</div>`;
        initLevel();
    } else {
        logEl.innerHTML += `<div class="log-entry" style="color:red">FALLO: (${cartX.toFixed(1)}, ${cartY.toFixed(1)})</div>`;
        visible = true;
        dibujarEscena();
    }
});

initLevel();
