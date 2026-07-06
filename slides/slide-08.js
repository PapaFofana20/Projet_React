// Slide 08 - Conclusion
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  
  // Deep black background
  slide.background = { color: "050505" };
  
  // Futuristic grid
  for (let i = 0; i < 6; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: 0, y: i * 1.1, w: 10, h: 0,
      line: { color: "151515", width: 0.5 }
    });
  }
  
  // Large neon glow left
  slide.addShape(pres.shapes.OVAL, {
    x: -3, y: -1, w: 8, h: 8,
    fill: { color: theme.accent, transparency: 93 }
  });
  
  // Red accent bars
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: theme.accent }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.1,
    fill: { color: theme.accent }
  });
  
  // Geometric accents
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8, y: 0, w: 2, h: 0.08,
    fill: { color: theme.accent }
  });
  
  // Section indicator
  slide.addText("05 //", {
    x: 0.5, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("CONCLUSION", {
    x: 0.5, y: 0.65, w: 9, h: 0.6,
    fontSize: 36, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 6
  });
  
  // Red underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.25, w: 2.5, h: 0.05,
    fill: { color: theme.accent }
  });
  
  // Key takeaways
  const takeaways = [
    { 
      num: "01", 
      title: "Stack Technologique Moderne", 
      text: "React 19 et NestJS forment une pile complete et performante avec typage TypeScript." 
    },
    { 
      num: "02", 
      title: "Architecture Scalable", 
      text: "Separation nette entre client et serveur. API REST bien structuree." 
    },
    { 
      num: "03", 
      title: "Experience Utilisateur Optimale", 
      text: "Interface futuriste et intuitive avec animations fluides via Framer Motion." 
    },
    { 
      num: "04", 
      title: "Fonctionnalites Avancees", 
      text: "Generation PDF et codes QR pour les tickets. Authentification securisee." 
    }
  ];
  
  let yPos = 1.5;
  takeaways.forEach((item) => {
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: yPos, w: 9, h: 0.78,
      fill: { color: "0A0A0A" }
    });
    
    // Red left accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: yPos, w: 0.08, h: 0.78,
      fill: { color: theme.accent }
    });
    
    // Number
    slide.addText(item.num, {
      x: 0.75, y: yPos + 0.1, w: 0.6, h: 0.3,
      fontSize: 16, fontFace: "Arial Black",
      color: theme.accent, bold: true
    });
    
    // Title
    slide.addText(item.title, {
      x: 1.5, y: yPos + 0.08, w: 7.8, h: 0.3,
      fontSize: 13, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    // Text
    slide.addText(item.text, {
      x: 1.5, y: yPos + 0.4, w: 7.8, h: 0.32,
      fontSize: 9, fontFace: "Consolas",
      color: "888888", bold: false
    });
    
    yPos += 0.88;
  });
  
  // Thank you section
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.05, w: 10, h: 0.575,
    fill: { color: theme.accent }
  });
  
  // Logo in thank you section
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 5.1, w: 2.0, h: 0.45
  });
  
  slide.addText("L'EXPERIENCE CINEMA DE DEMAIN // 2026", {
    x: 3.0, y: 5.15, w: 6.5, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "right"
  });
  
  // Page number
  slide.addText("08", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true
  });
}

module.exports = { createSlide };
