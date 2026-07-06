// Slide 05 - Backend Technologies
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  
  // Dark background
  slide.background = { color: "060606" };
  
  // Futuristic grid
  for (let i = 0; i < 6; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: 0, y: i * 1.1, w: 10, h: 0,
      line: { color: "121212", width: 0.5 }
    });
  }
  
  // Top red bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.1,
    fill: { color: theme.accent }
  });
  
  // Neon glow
  slide.addShape(pres.shapes.OVAL, {
    x: 7, y: -1, w: 5, h: 5,
    fill: { color: theme.accent, transparency: 94 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.2, w: 2.2, h: 0.7
  });
  
  // Section indicator
  slide.addText("02 //", {
    x: 3.0, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("TECHNOLOGIES BACKEND", {
    x: 0.5, y: 1.0, w: 9, h: 0.55,
    fontSize: 30, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 2
  });
  
  // Description
  slide.addText("Le backend de SENEFLIX repose sur une architecture server-side robuste construite avec NestJS et TypeORM.", {
    x: 0.5, y: 1.5, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: "888888", bold: false
  });
  
  // NestJS Main Card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.0, w: 9, h: 1.3,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.0, w: 0.1, h: 1.3,
    fill: { color: theme.accent }
  });
  
  slide.addText("NESTJS", {
    x: 0.8, y: 2.15, w: 3, h: 0.35,
    fontSize: 20, fontFace: "Arial Black",
    color: "FFFFFF", bold: true
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 2.22, w: 0.8, h: 0.22,
    fill: { color: theme.accent, transparency: 70 }
  });
  
  slide.addText("v10+", {
    x: 2.5, y: 2.22, w: 0.8, h: 0.22,
    fontSize: 9, fontFace: "Consolas",
    color: "FFFFFF", bold: false,
    align: "center", valign: "middle"
  });
  
  slide.addText("Framework Node.js progressif permettant de construire des applications server-side escalables et maintenables. NestJS utilise TypeScript natif et propose une architecture modulaire inspiree d'Angular avec l'injection de dependances.", {
    x: 0.8, y: 2.55, w: 8.5, h: 0.7,
    fontSize: 10, fontFace: "Consolas",
    color: "AAAAAA", bold: false
  });
  
  // Two column cards - Database and ORM
  // MySQL Card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.5, w: 4.3, h: 1.6,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.5, w: 0.08, h: 1.6,
    fill: { color: theme.accent }
  });
  
  slide.addText("MYSQL", {
    x: 0.75, y: 3.65, w: 2.5, h: 0.35,
    fontSize: 16, fontFace: "Arial Black",
    color: "FFFFFF", bold: true
  });
  
  slide.addText("Base de donnees relationnelle performante pour stocker et gerer les donnees utilisateur, films, seances et reservations avec integrite referentielle et transactions ACID.", {
    x: 0.75, y: 4.05, w: 3.9, h: 0.95,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false
  });
  
  // TypeORM Card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.5, w: 4.3, h: 1.6,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.5, w: 0.08, h: 1.6,
    fill: { color: theme.accent }
  });
  
  slide.addText("TYPEORM", {
    x: 5.45, y: 3.65, w: 2.5, h: 0.35,
    fontSize: 16, fontFace: "Arial Black",
    color: "FFFFFF", bold: true
  });
  
  slide.addText("ORM moderne permettant d'interagir avec la base de donnees MySQL de maniere typee et maintenable. Supporte les migrations, les relations et les validations de donnees.", {
    x: 5.45, y: 4.05, w: 3.9, h: 0.95,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false
  });
  
  // Page number
  slide.addText("05", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
