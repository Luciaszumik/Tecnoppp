let manchas = [];
let puntosDibujados = [];
let totalManchas = 13;
let vibrando = false; // true mientras el mouse está apretado

let teclaA = false;
let teclaS = false;
let fondoListo = false;
let iniciaPintura; // 
let cantElipses = 0;   // cantidad en linea
let elipsesMax = 40;  // cuántas elipses para pasar a la siguiente liena
let sentido = 1;        // 1 = baja, -1 = sube 
let posA = 0;          // posición guardada de A
let direccionA = 1;       // dirección guardada de A
let posS = 0;          // posición guardada de S
let direccionS = -1;      // dirección guardada de S

function preload() {
  for (let i = 0; i < totalManchas; i++) {
    manchas.push(loadImage(`Assets/mancha${i}.png`));
  }
}

function setup() {
  createCanvas(700, 900);
  noStroke();
  iniciaPintura = height * 0.40;  //para q continuen segun el fondo 
  posA = height * 0.40;
  posS = height * 0.70;

  // dibuja el fondo una sola vez
  fondo();
  capaBordo();
  capaRosa();
  capaCrema();
  grano();
  fondoListo = true;
  dibujarManchas(); // dibuja las manchas una sola vez sobre el fondo
  
}
function dibujarManchas() {
  puntosDibujados = [];
  let intentosTotales = 1500;

  for (let i = 0; i < intentosTotales; i++) {
    let x = random(width);
    let y = random(height);
    let tamBase = 16;
    let tam = tamBase + random(-1, 1);
    let radioSeguridad = (tam / 2) + 0.3;

    if (esPosicionValida(x, y, radioSeguridad)) {
      let alfa = random(25, 130);
      tint(255, alfa);
      push();
      translate(x, y);
      image(random(manchas), 0, 0, tam, tam); // !!! DIBUJO SIN ROTACIÓN
      pop();
      puntosDibujados.push({ x: x, y: y, r: radioSeguridad }); //para no dibujar en el mismo lugar
    }
  }
}

function esPosicionValida(nx, ny, nr) {
  for (let p of puntosDibujados) {
    let d = dist(nx, ny, p.x, p.y);
    if (d < (nr + p.r)) {
      return false;
    }
  }
  return true;
}

function draw() {
  // si A está apretada, pinta bordó en la franja actual
  if (teclaA) {
    for (let i = 0; i < 10; i++) { // ← velocidad de dibujo por frame
      let x = random(-100, width + 100);
      let y = random(iniciaPintura, iniciaPintura + 40); //lugar random dentro de los 40px 
      let alpha = random(2, 10);
      fill(random(92, 128), random(10, 30), random(18, 48), alpha);
      noStroke();
      ellipse(x, y, random(40, 180), random(20, 80));
    }


    cantElipses += 10;

    if (cantElipses >= elipsesMax) {
      cantElipses = 0;
      iniciaPintura += 10 * sentido;

      if (iniciaPintura >= height) { sentido = -1; } // llegó abajo
      if (iniciaPintura <= 0)      { sentido = 1;  } // llegó arriba
    }
  }

  // si S está apretada, pinta crema+rosa en la franja
  if (teclaS) {
    // capa rosa tenue
    for (let i = 0; i < 10; i++) {
      let x = random(-100, width + 100);
      let y = random(iniciaPintura, iniciaPintura + 10);
      fill(250, 237, 235, random(4, 10)); // ← color rosa
      noStroke();
      ellipse(x, y, random(40, 180), random(20, 80));
    }

    // capa crema
    for (let i = 0; i < 20; i++) {
      let x = random(-100, width + 100);
      let y = random(iniciaPintura, iniciaPintura + 10);
      fill(238, 225, 210, random(2, 10)); // ← color crema
      noStroke();
      ellipse(x, y, random(40, 180), random(20, 80));
    }

    cantElipses += 20;

    if (cantElipses >= elipsesMax) {
      cantElipses = 0;
      iniciaPintura += 10 * sentido;

      if (iniciaPintura <= 0)      { sentido = 1;  } // llegó arriba
      if (iniciaPintura >= height) { sentido = -1; } // llegó abajo
    }
  }
  if (vibrando) {
  for (let p of puntosDibujados) {
    let offsetX = random(-3, 3); // cuánto se mueve en X
    let offsetY = random(-3, 3); // cuánto se mueve en Y
    let alfa = random(25, 130);
    tint(255, alfa);
    push();
    translate(p.x + offsetX, p.y + offsetY);
    image(random(manchas), 0, 0, p.r * 2, p.r * 2);
    pop();
  }
}
}

// ====================================================
// 1. FONDO
// ====================================================

function fondo() {
  background(238, 225, 210); // crema cálida
}

// ====================================================
// 2. BORDÓ — sólido arriba, llega al 60%
// ====================================================

function capaBordo() {

  // bloque sólido tope — llega hasta el 60%
  for (let i = 0; i < 6000; i++) {
    let x = random(-100, width + 100);
    let y = random(-30, height * 0.60);
    let alpha = map(y, -30, height * 0.60, 62, 8); // cuanto más abajo más transparente
    fill(random(92, 128), random(10, 30), random(18, 48), alpha);
    ellipse(x, y, random(20, 90), random(12, 45));
  }

  // bordó más difuso, refuerza el tope hasta el 42%
  for (let i = 0; i < 4000; i++) {
    let x = random(-100, width + 100);
    let y = random(0, height * 0.42);
    let alpha = map(y, 0, height * 0.42, 38, 2);
    fill(random(105, 150), random(18, 45), random(30, 68), alpha);
    ellipse(x, y, random(35, 160), random(18, 70));
  }

  // bordó oscuro para generar la transición hacia la zona baja
  for (let i = 0; i < 1800; i++) {
    let x = random(-100, width + 100);
    let y = random(height * 0.38, height * 0.82);
    let alpha = map(y, height * 0.38, height * 0.82, 9, 1);
    fill(random(130, 155), random(30, 55), random(45, 75), alpha);
    ellipse(x, y, random(45, 190), random(22, 85));
  }
}

// ====================================================
// 3. ROSA — zona media-baja, producto de la fusión
//    bordó + crema, no una capa encima del bordó
// ====================================================

function capaRosa() {

  // arranca en 0.52, donde el bordó ya se disolvió bastante
  // el resultado se lee como crema teñida por el bordó
  for (let i = 0; i < 1200; i++) {
    let x = random(-100, width + 100);
    let y = random(height * 0.52, height * 0.92);
    let alpha = map(y, height * 0.52, height * 0.92, 16, 3);
    fill(183, 96, 90, alpha); // #b7605a
    ellipse(x, y, random(55, 220), random(28, 100));
  }
}

// ====================================================
// 4. CREMA — aclara abajo
// ====================================================

function capaCrema() {

  for (let i = 0; i < 2000; i++) {
    let x = random(-100, width + 100);
    let y = random(height * 0.62, height);
    let alpha = map(y, height * 0.62, height, 3, 18);
    fill(random(235, 248), random(220, 235), random(208, 225), alpha);
    ellipse(x, y, random(70, 270), random(35, 125));
  }

  for (let i = 0; i < 500; i++) {
    let x = random(-100, width + 100);
    let y = random(height * 0.60, height);
    let alpha = map(y, height * 0.60, height, 12, 2);
    fill(205, 148, 158, alpha);
    ellipse(x, y, random(50, 190), random(6, 20));
  }
}

// ====================================================
// 5. GRANO de tela
// ====================================================

function grano() { // genra un estilo "ruido" para q no se vea tan digitañ 
  noStroke();
  for (let i = 0; i < 20000; i++) {
    fill(255, random(2, 8));
    rect(random(width), random(height), 1, 1);
    fill(0, random(1, 4));
    rect(random(width), random(height), 1, 1);
  }
}

// ====================================================
// REGENERAR
// ====================================================

function mousePressed() {
  vibrando = true;
  loop(); // arranca draw para que se vea la vibración
}

function mouseReleased() {
  vibrando = false;
  noLoop(); // congela todo cuando soltás
}

function keyPressed() {
  if (key === 'a' || key === 'A') {
    posS = iniciaPintura;   // guarda posición de S
    direccionS = sentido;
    iniciaPintura = posA;   // restaura posición de A
    sentido = direccionA;
    teclaA = true;
    loop();
  }

  if (key === 's' || key === 'S') {
    posA = iniciaPintura;   // guarda posición de A
    direccionA = sentido;
    iniciaPintura = posS;   // restaura posición de S
    sentido = direccionS;
    teclaS = true;
    loop();
  }

  if (key === 'r' || key === 'R') {
    iniciaPintura = height * 0.40;
    posA = height * 0.40;
    posS = height * 0.70;
    cantElipses = 0;
    sentido = 1;
    direccionA = 1;
    direccionS = -1;
    fondo();
    capaBordo();
    capaRosa();
    capaCrema();
    grano();
  }
}

function keyReleased() {
  if (key === 'a' || key === 'A') {
    posA = iniciaPintura;   // guarda donde quedó A
    direccionA = sentido;
    teclaA = false;
    noLoop();
  }

  if (key === 's' || key === 'S') {
    posS = iniciaPintura;   // guarda donde quedó S
    direccionS = sentido;
    teclaS = false;
    noLoop();
  }
}
