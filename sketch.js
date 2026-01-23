function setup() {
  createCanvas(1510, 720);
  textAlign(CENTER, CENTER);

  // Estado del círculo (posición, tamaño)
  circleSize = 360;
  circleX = width / 2;
  circleY = height / 2;

  // Estado de arrastre
  dragging = false;
  offsetX = 0;
  offsetY = 0;
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

  // Círculo central
  fill(20, 20, 20);
  noStroke();
  ellipse(circleX, circleY, circleSize, circleSize);

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
  text("ALINE", circleX, circleY - 70);

  // Subtítulo
  textSize(18);
  textStyle(NORMAL);
  text("Audio · Arte sonoro", circleX, circleY - 30);

  // Bloque de descripción (multilínea)
  textSize(14);
  textLeading(20);
  let descripcion1 = "El sentido rítmico del espacio y su relación\nen la escucha periférica";
  text(descripcion1, circleX, circleY + 10);

  let descripcion2 = "Grabación de sonido, edición de sonido,\nproducción sonora";
  text(descripcion2, circleX, circleY + 85);

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
}