//codigo con comentarios d bri y lu

let manchas = []; //donde guardamos las img
let puntosDibujados = []; //donde se guarda info de c/manchita (posicion, tamaño, etc)
let totalManchas = 13; //xq hay 13 fts

let fondoGuardado = null; //hacemos variable q actua como una foto  del fondo para no tener q hacerlo mil veces
let capaManchitas = null; //lo mismo con las manchitas, son otra capa en bloque
let capaPintura = null;   // NUEVA CAPA: para que lo que pintes con A y S quede guardado
let lloviendo = false; //no empiezan lloviendo
let velocidadLluvia = 15; //pix x frame q bajan las manchitas

let teclaA = false;
let teclaS = false;
//let fondoListo = false;
let iniciaPintura; // determinamos donde empiezan las primeras pinceladas
let cantElipses = 0;   // cantidad en linea
let elipsesMax = 40;  // cuántas elipses para pasar a la siguiente liena
let sentido = 1;        // 1 = baja, -1 = sube, cuando llega arriba o abajo cambia el sentido 
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
  noLoop();
  noStroke(); 
  
  capaManchitas = createGraphics(700, 900); //crea una nueva capa transparente con las manchitas
  capaManchitas.noStroke();
  
  capaPintura = createGraphics(700, 900); 
  capaPintura.noStroke();
  
  iniciaPintura = height * 0.40;  
  posA = height * 0.40;
  posS = height * 0.70;
  
  // Ejecutamos tu fondo original recuperado
  fondo(); // la variable de todas las capas unidas (degradado)
  capaBordo();
  capaRosa();
  capaCrema();
  textura();
  
  fondoGuardado = get();//guarda el fondo como esta hasta ahora como una CAPA 
  // fondoListo = true;
  dibujarManchas(); 
}

function dibujarManchas() {// arreglar el tamaño de las manchas para q se vean alargadas//
  puntosDibujados = [];
  let intentosTotales = 21000; // Volví al valor alto para que no falten manchas

  for (let i = 0; i < intentosTotales; i++) {
    let x = random(width);
    let y = random(height);
    let tamBase = 20;
    let tam = tamBase + random(-1, 1);
    let radioSeguridad = (tam / 2) + 0.3;

    if (esPosicionValida(x, y, radioSeguridad)) {
      let alfa = random(40, 130);
      let img = random(manchas);
      puntosDibujados.push({ x: x, y: y, r: radioSeguridad, tam: tam, alfa: alfa, img: img }); //guarda los datos de la img en el arreglo
    }
  }
  redibujarManchitas(); 
}

function redibujarManchitas() {// almacena cada cambio para poder visualizarlo en pantalla 
  capaManchitas.clear();
  for (let p of puntosDibujados) { //p=cada pos de manchas en el arreglo 
    capaManchitas.tint(255, p.alfa);
    capaManchitas.push();
    capaManchitas.translate(p.x, p.y);
    capaManchitas.image(p.img, 0, 0, p.tam, p.tam);
    capaManchitas.pop();
  }
  capaManchitas.noTint();
  
  image(fondoGuardado, 0, 0);
  image(capaPintura, 0, 0); 
  image(capaManchitas, 0, 0);
}

function esPosicionValida(nx, ny, nr) { 
  for (let p of puntosDibujados) {
    let d = dist(nx, ny, p.x, p.y);
    if (d < (nr + p.r)) return false;
  }
  return true;
}

function draw() {
  if (lloviendo) { // guarda el estado del fondo y de la pintura 
    image(fondoGuardado, 0, 0);
    image(capaPintura, 0, 0); 
    for (let p of puntosDibujados) { 
      p.y += velocidadLluvia; 
      if (p.y > height) p.y = -p.tam; 
      tint(255, p.alfa);
      push();
      translate(p.x, p.y);
      image(p.img, 0, 0, p.tam, p.tam);
      pop();
    }
    noTint();
    return;
  }

  if (teclaA) {
    for (let i = 0; i < 10; i++) {// ← velocidad de dibujo por frame
      let x = random(-100, width + 100); 
      let y = random(iniciaPintura, iniciaPintura + 40); //lugar random dentro de los 40px 
      let alpha = random(2, 10);
      capaPintura.fill(random(92, 128), random(10, 30), random(18, 48), alpha);
      capaPintura.ellipse(x, y, random(40, 180), random(20, 80));
    }
    actualizarPintura();
    redibujarManchitas();
  }

// si S está apretada, pinta crema+rosa en la franja
  if (teclaS) {
    for (let i = 0; i < 10; i++) {
      let x = random(-100, width + 100);
      let y = random(iniciaPintura, iniciaPintura + 10);
      capaPintura.fill(250, 237, 235, random(4, 10));  //rosa tenue
      capaPintura.ellipse(x, y, random(40, 180), random(20, 80));
    }
    for (let i = 0; i < 20; i++) {
      let x = random(-100, width + 100);
      let y = random(iniciaPintura, iniciaPintura + 10);
      capaPintura.fill(238, 225, 210, random(2, 10)); //crema
      capaPintura.ellipse(x, y, random(40, 180), random(20, 80));
    }
    actualizarPintura();
    redibujarManchitas();
  }
}

function actualizarPintura() {
  cantElipses += 20;
  if (cantElipses >= elipsesMax) {
    cantElipses = 0;
    iniciaPintura += 10 * sentido;
    if (iniciaPintura >= height) { sentido = -1; } 
    if (iniciaPintura <= 0)      { sentido = 1;  } 
  }
}

// ====================================================
// RESTAURACIÓN DEL ORIGINAL
// ====================================================

function fondo() {
  background(238, 225, 210);
}

function capaBordo() {
  for (let i = 0; i < 6000; i++) {
    let x = random(width);
    let y = random(-30, height * 0.60);
    let alpha = map(y, -30, height * 0.60, 62, 8); // en base de la posY varia la transparencia 
    fill(random(92, 128), random(10, 30), random(18, 48), alpha);
    ellipse(x, y, random(20, 90), random(12, 45));
  }
  for (let i = 0; i < 4000; i++) {
    let x = random(width);
    let y = random(0, height * 0.42);
    let alpha = map(y, 0, height * 0.42, 38, 2);
    fill(random(105, 150), random(18, 45), random(30, 68), alpha);
    ellipse(x, y, random(35, 160), random(18, 70));
  }
  for (let i = 0; i < 1800; i++) {
    let x = random(width);
    let y = random(height * 0.38, height * 0.82);
    let alpha = map(y, height * 0.38, height * 0.82, 9, 1);
    fill(random(130, 155), random(30, 55), random(45, 75), alpha);
    ellipse(x, y, random(45, 190), random(22, 85));
  }
}

function capaRosa() {
  for (let i = 0; i < 1200; i++) {
    let x = random(width);
    let y = random(height * 0.52, height * 0.92);
    let alpha = map(y, height * 0.52, height * 0.92, 16, 3);
    fill(183, 96, 90, alpha);
    ellipse(x, y, random(55, 220), random(28, 100));
  }
}

function capaCrema() {
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height * 0.62, height);
    let alpha = map(y, height * 0.62, height, 3, 18);
    fill(random(235, 248), random(220, 235), random(208, 225), alpha);
    ellipse(x, y, random(70, 270), random(35, 125));
  }
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.60, height);
    let alpha = map(y, height * 0.60, height, 12, 2);
    fill(205, 148, 158, alpha);
    ellipse(x, y, random(50, 190), random(6, 20));
  }
}
//textura

function textura() {
  noStroke();
  for (let i = 0; i < 20000; i++) {
    fill(255, random(2, 8)); // Puntos blancos
    rect(random(width), random(height), 1, 1);
    fill(0, random(1, 4));   // Puntos negros
    rect(random(width), random(height), 1, 1);
  }
}

// ====================================================
// INTERACCIONES
// ====================================================

function mousePressed() {
  dibujarManchas();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    iniciaPintura = height * 0.40;
    posA = height * 0.40;
    posS = height * 0.70;
    cantElipses = 0;
    sentido = 1;
    capaPintura.clear(); 
    fondo();
    capaBordo();
    capaRosa();
    capaCrema();
    textura();
    fondoGuardado = get(); 
    dibujarManchas();
  }  
 
  
  else if (key === 'g' || key === 'G') {
    lloviendo = !lloviendo;
    lloviendo ? loop() : noLoop();
  } 

  else if (key === 't' || key === 'T') {
    for (let p of puntosDibujados) {
      p.alfa = random(25, 130); 
    }
    redibujarManchitas(); 
  }

  else if (key === 'a' || key === 'A') {
    posS = iniciaPintura;
    direccionS = sentido;
    iniciaPintura = posA;
    sentido = direccionA;
    teclaA = true;
    loop();
  }

  else if (key === 's' || key === 'S') {
    posA = iniciaPintura;
    direccionA = sentido;
    iniciaPintura = posS;
    sentido = direccionS;
    teclaS = true;
    loop();
  }
}

function keyReleased() {
  if (key === 'a' || key === 'A') {
    posA = iniciaPintura;
    teclaA = false;
    if (!teclaS && !lloviendo) noLoop();
  }
  if (key === 's' || key === 'S') {
    posS = iniciaPintura;
    teclaS = false;
    if (!teclaA && !lloviendo) noLoop();
  }
}
