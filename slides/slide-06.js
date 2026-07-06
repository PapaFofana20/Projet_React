// Slide 06 - Architecture
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
    x: -2, y: 0, w: 4, h: 4,
    fill: { color: theme.accent, transparency: 95 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.2, w: 2.2, h: 0.7
  });
  
  // Section indicator
  slide.addText("03 //", {
    x: 3.0, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("ARCHITECTURE DU PROJET", {
    x: 0.5, y: 1.0, w: 9, h: 0.5,
    fontSize: 26, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 2
  });
  
  // Architecture diagram - Client layer
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.6, w: 2.2, h: 0.9,
    fill: { color: theme.accent }
  });
  
  slide.addText("CLIENT", {
    x: 0.5, y: 1.7, w: 2.2, h: 0.35,
    fontSize: 14, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    align: "center"
  });
  
  slide.addText("React 19 + Vite", {
    x: 0.5, y: 2.05, w: 2.2, h: 0.3,
    fontSize: 9, fontFace: "Consolas",
    color: "FFFFFF", bold: false,
    align: "center"
  });
  
  // Arrow 1
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 2.8, y: 2.0, w: 0.6, h: 0.03,
    fill: { color: theme.accent }
  });
  
  slide.addText("REST", {
    x: 2.8, y: 1.75, w: 0.6, h: 0.2,
    fontSize: 7, fontFace: "Consolas",
    color: theme.accent, bold: false,
    align: "center"
  });
  
  // Architecture diagram - API layer
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 1.6, w: 2.4, h: 0.9,
    fill: { color: "0F0F0F" },
    line: { color: theme.accent, width: 1 }
  });
  
  slide.addText("API SERVER", {
    x: 3.5, y: 1.7, w: 2.4, h: 0.35,
    fontSize: 14, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    align: "center"
  });
  
  slide.addText("NestJS + TypeORM", {
    x: 3.5, y: 2.05, w: 2.4, h: 0.3,
    fontSize: 9, fontFace: "Consolas",
    color: "888888", bold: false,
    align: "center"
  });
  
  // Arrow 2
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 2.0, w: 0.6, h: 0.03,
    fill: { color: theme.accent }
  });
  
  slide.addText("SQL", {
    x: 6.0, y: 1.75, w: 0.6, h: 0.2,
    fontSize: 7, fontFace: "Consolas",
    color: theme.accent, bold: false,
    align: "center"
  });
  
  // Architecture diagram - Database layer
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.7, y: 1.6, w: 2.8, h: 0.9,
    fill: { color: "0F0F0F" },
    line: { color: theme.accent, width: 1 }
  });
  
  slide.addText("DATABASE", {
    x: 6.7, y: 1.7, w: 2.8, h: 0.35,
    fontSize: 12, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    align: "center"
  });
  
  slide.addText("MySQL", {
    x: 6.7, y: 2.05, w: 2.8, h: 0.3,
    fontSize: 9, fontFace: "Consolas",
    color: "888888", bold: false,
    align: "center"
  });
  
  // Key Features section
  slide.addText("// FONCTIONNALITES PRINCIPALES", {
    x: 0.5, y: 2.7, w: 9, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.0, w: 9, h: 0.02,
    fill: { color: "222222" }
  });
  
  // Feature columns - 3 columns
  const features = [
    { 
      title: "AUTHENTIFICATION", 
      items: [
        "Inscription utilisateur",
        "Connexion securisee",
        "JWT Access Tokens",
        "Refresh Tokens"
      ] 
    },
    { 
      title: "CATALOGUE FILMS", 
      items: [
        "Liste films a l'affiche",
        "Details et synopsis",
        "Horaires des seances",
        "Filtres et recherche"
      ] 
    },
    { 
      title: "RESERVATION", 
      items: [
        "Selection places",
        "Panier d'achat",
        "Tickets PDF + QR",
        "Confirmation"
      ] 
    }
  ];
  
  let xPos = 0.5;
  features.forEach((feature) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.15, w: 3.0, h: 1.8,
      fill: { color: "0C0C0C" }
    });
    
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.15, w: 3.0, h: 0.05,
      fill: { color: theme.accent }
    });
    
    slide.addText(feature.title, {
      x: xPos + 0.15, y: 3.28, w: 2.7, h: 0.3,
      fontSize: 10, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    slide.addText(feature.items.map((item, i) => ({
      text: item,
      options: { bullet: true, breakLine: i < feature.items.length - 1 }
    })), {
      x: xPos + 0.15, y: 3.6, w: 2.7, h: 1.3,
      fontSize: 8, fontFace: "Consolas",
      color: "999999", bold: false,
      paraSpaceAfter: 3
    });
    
    xPos += 3.1;
  });
  
  // Page number
  slide.addText("06", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
