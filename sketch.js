function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  noLoop(); // El diseño es estático; elimina esto si vas a animar
}

function draw() {
  // Fondo degradado (ligero)
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(245, 245, 245), color(220, 220, 235), t);
    stroke(c);
    line(0, y, width, y);
  }

  // Sombra del círculo (sutil)
  noStroke();
  fill(0, 0, 0, 40);
  ellipse(width / 2 + 8, height / 2 + 12, 380, 380);

  // Círculo central
  fill(20, 20, 20);
  noStroke();
  ellipse(width / 2, height / 2, 360, 360);

  // Opcional: rectángulo semitransparente detrás del texto para mayor legibilidad
  push();
  rectMode(CENTER);
  fill(255, 15); // blanco muy translúcido
  noStroke();
  rect(width / 2, height / 2 + 15, 340, 220, 20);
  pop();

  // Texto con jerarquía
  // Nombre
  fill(255);
  stroke(0, 120); // trazo sutil para mejorar lectura sobre el círculo
  strokeWeight(1.2);
  textSize(48);
  textStyle(BOLD);
  text("ALINE", width / 2, height / 2 - 70);

  // Subtítulo
  textSize(18);
  textStyle(NORMAL);
  text("Audio · Arte sonoro", width / 2, height / 2 - 30);

  // Bloque de descripción (multilínea)
  textSize(14);
  textLeading(20);
  let descripcion1 = "El sentido rítmico del espacio y su relación\nen la escucha periférica";
  text(descripcion1, width / 2, height / 2 + 10);

  let descripcion2 = "Grabación de sonido, edición de sonido,\nproducción sonora";
  text(descripcion2, width / 2, height / 2 + 85);

  // Restaurar para futuros dibujados
  noStroke();
}

function windowResized() {
  // Mantener responsividad: recalcula el canvas al cambiar la ventana
  // Puedes ajustar el tamaño mínimo/máximo si lo deseas
  let s = min(windowWidth, windowHeight);
  // Mantener un tamaño razonable
  let newSize = constrain(s * 0.9, 320, 1200);
  resizeCanvas(newSize, newSize);
  redraw();
}