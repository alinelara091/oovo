function setup() {
  createCanvas(1510, 720);
  textAlign(CENTER, CENTER);

  // Estado del círculo negro (posición, tamaño)
  circleSize = 360;
  circleX = width / 2;
  circleY = height / 2;

  // Estado de arrastre
  dragging = false;
  offsetX = 0;
  offsetY = 0;

  // Círculo rojo (random en el canvas)
  redSize = 80;
  let r = redSize / 2;
  redX = random(r, width - r);
  redY = random(r, height - r);

  // Audio (Web Audio API) - inicializamos al primer gesto del usuario
  audioCtx = null;
  oscillator = null;
  gainNode = null;
  soundPlaying = false;
}

function draw() {
  background(255);

  // Fondo degradado (ligero)
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(245, 245, 245), color(220, 220, 235), t);
    stroke(c);
    line(0, y, width, y);
  }

  // Cursor: cambiar cuando estamos sobre el círculo
  if (isMouseOverCircle()) {
    cursor('grab'); // cuando está sobre el círculo
  } else {
    cursor(ARROW);
  }

  // Sombra del círculo (sutil)
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(circleX + 8, circleY + 12, circleSize + 20, circleSize + 20);

  // Círculo central (negro)
  fill(20, 20, 20);
  noStroke();
  ellipse(circleX, circleY, circleSize, circleSize);

  // Círculo rojo (objetivo) — se dibuja sobre el fondo y puede resaltarse si colisiona
  push();
  let overlap = circlesOverlap(circleX, circleY, circleSize / 2, redX, redY, redSize / 2);
  if (overlap) {
    // pequeño efecto cuando hay colisión
    stroke(255, 200, 0);
    strokeWeight(4);
    fill(255, 80, 80);
  } else {
    noStroke();
    fill(200, 40, 40);
  }
  ellipse(redX, redY, redSize, redSize);
  pop();

  // Opcional: rectángulo semitransparente detrás del texto para mayor legibilidad
  push();
  rectMode(CENTER);
  fill(255, 15); // blanco muy translúcido
  noStroke();
  rect(circleX, circleY + 15, 340, 220, 20);
  pop();

  // Texto con jerarquía (centrado en el círculo)
  // Nombre
  fill(255);
  stroke(0, 120); // trazo sutil para mejorar lectura sobre el círculo
  strokeWeight(1.2);
  textSize(48);
  textStyle(BOLD);
  text("Aline Lara", circleX, circleY - 70);

  // Subtítulo
  textSize(18);
  textStyle(NORMAL);
  text(" · Arte sonoro · Paisaje Sonoro · Livecoding · Sintetización de Audio experimental ·", circleX, circleY - 30);

  // Bloque de descripción (multilínea)
  textSize(14);
  textLeading(20);
  let descripcion1 = "El sentido rítmico del espacio y su relación\nen la escucha periférica";
  text(descripcion1, circleX, circleY + 10);

  let descripcion2 = "Producción y posproducción sonora";
  text(descripcion2, circleX, circleY + 85);

  // Si estamos arrastrando y tocamos el rojo, activar sonido.
  // Si dejamos de tocar, detener sonido.
  if (dragging && overlap) {
    if (!soundPlaying) {
      playTone();
    }
  } else {
    if (soundPlaying) {
      stopTone();
    }
  }

  // Restaurar para futuros dibujados
  noStroke();
}

function isMouseOverCircle() {
  let r = circleSize / 2;
  return dist(mouseX, mouseY, circleX, circleY) <= r;
}

function mousePressed() {
  // Soportar sólo botón izquierdo (opcional)
  if (mouseButton === LEFT && isMouseOverCircle()) {
    dragging = true;
    offsetX = circleX - mouseX;
    offsetY = circleY - mouseY;
    cursor('grabbing');

    // A causa de políticas de autoplay en navegadores, necesitamos un gesto del usuario
    // para crear/resumir el AudioContext. Hacemos eso aquí.
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // No iniciamos el oscilador aún; se hará cuando colisionemos.
      } catch (e) {
        console.warn("Web Audio API no disponible:", e);
        audioCtx = null;
      }
    } else if (audioCtx.state === 'suspended') {
      // Intentar reanudar si está suspendido
      audioCtx.resume().catch(() => {});
    }
  }
}

function mouseDragged() {
  if (dragging) {
    // Actualizar posición con offset para que no salte
    circleX = mouseX + offsetX;
    circleY = mouseY + offsetY;

    // Mantener dentro del canvas
    let r = circleSize / 2;
    circleX = constrain(circleX, r, width - r);
    circleY = constrain(circleY, r, height - r);
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    cursor(ARROW);

    // Si soltamos mientras suena, detenemos el sonido
    if (soundPlaying) {
      stopTone();
    }
  }
}

function windowResized() {
  // Mantener responsividad: recalcula el canvas al cambiar la ventana
  let s = min(windowWidth, windowHeight);
  let newSize = constrain(s * 0.9, 320, 1200);
  resizeCanvas(newSize, newSize);

  // Recalcular posición del círculo en la nueva ventana: aquí lo centramos
  // Si prefieres conservar la posición relativa, se puede adaptar.
  circleX = width / 2;
  circleY = height / 2;

  // Reposicionar el círculo rojo para que siga dentro del nuevo canvas
  let r = redSize / 2;
  redX = constrain(redX, r, width - r);
  redY = constrain(redY, r, height - r);
}

// Comprueba si dos círculos se solapan
function circlesOverlap(x1, y1, r1, x2, y2, r2) {
  let d = dist(x1, y1, x2, y2);
  return d <= (r1 + r2);
}

// Reproducir un tono simple usando Web Audio API
function playTone() {
  if (!audioCtx) return;
  // Si ya hay oscilador sonando, no crear otro
  if (soundPlaying) return;

  // Crear nodos
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  // Ajustes del sonido
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La4 - 440Hz (puedes cambiar)
  gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

  // Conectar
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Arrancar y hacer un pequeño fade-in
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);

  soundPlaying = true;
}

// Detener el tono con un pequeño fade-out y limpiar
function stopTone() {
  if (!audioCtx || !oscillator || !gainNode) return;
  // Fade out
  let now = audioCtx.currentTime;
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  // Parar y desconectar después del fade
  setTimeout(() => {
    try {
      oscillator.stop();
    } catch (e) {}
    try {
      oscillator.disconnect();
      gainNode.disconnect();
    } catch (e) {}
    oscillator = null;
    gainNode = null;
    soundPlaying = false;
  }, 80);
}