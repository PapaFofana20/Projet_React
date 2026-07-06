// Slide 03 - Frontend Technologies Overview
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
  
  // Neon glow left
  slide.addShape(pres.shapes.OVAL, {
    x: -2, y: 0.5, w: 5, h: 5,
    fill: { color: theme.accent, transparency: 94 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.2, w: 2.2, h: 0.7
  });
  
  // Section number
  slide.addText("01 //", {
    x: 3.0, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("TECHNOLOGIES FRONTEND", {
    x: 0.5, y: 0.95, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 2
  });
  
  // Description
  slide.addText("Le frontend de SENEFLIX est construit avec les technologies les plus modernes du marche pour offrir une experience utilisateur exceptionnelle.", {
    x: 0.5, y: 1.5, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: "888888", bold: false
  });
  
  // Technology cards - Row 1
  const techRow1 = [
    { name: "React 19", desc: "Framework UI reactif\nDerniere version avec\nconcurrency native", stats: "v19.2.4" },
    { name: "TypeScript", desc: "Typage statique avance\nCode plus fiable\nMeilleure DX", stats: "v5.9.3" },
    { name: "Vite", desc: "Build tool ultra-rapide\nHMR instantane\nDev experience", stats: "v8.0.1" }
  ];
  
  let xPos = 0.5;
  techRow1.forEach((tech) => {
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 2.0, w: 2.9, h: 1.4,
      fill: { color: "0F0F0F" },
      line: { color: "222222", width: 1 }
    });
    
    // Red top accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 2.0, w: 2.9, h: 0.06,
      fill: { color: theme.accent }
    });
    
    // Tech name
    slide.addText(tech.name, {
      x: xPos + 0.15, y: 2.15, w: 2.6, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    // Version badge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos + 2.2, y: 2.2, w: 0.55, h: 0.22,
      fill: { color: theme.accent, transparency: 80 }
    });
    
    slide.addText(tech.stats, {
      x: xPos + 2.2, y: 2.2, w: 0.55, h: 0.22,
      fontSize: 7, fontFace: "Consolas",
      color: theme.accent, bold: false,
      align: "center", valign: "middle"
    });
    
    // Description
    slide.addText(tech.desc, {
      x: xPos + 0.15, y: 2.55, w: 2.6, h: 0.8,
      fontSize: 9, fontFace: "Consolas",
      color: "777777", bold: false
    });
    
    xPos += 3.1;
  });
  
  // Technology cards - Row 2
  const techRow2 = [
    { name: "TailwindCSS", desc: "CSS utility-first\nDesign system complet\nResponsive design", stats: "v4.2.2" },
    { name: "Framer Motion", desc: "Animations declaratives\nGestures complexes\nTransitions fluides", stats: "v12.38" },
    { name: "Recharts", desc: "Bibliotheque graphiques\nSVG optimises\nData viz moderne", stats: "v3.8.1" }
  ];
  
  xPos = 0.5;
  techRow2.forEach((tech) => {
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.55, w: 2.9, h: 1.4,
      fill: { color: "0F0F0F" },
      line: { color: "222222", width: 1 }
    });
    
    // Red top accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 3.55, w: 2.9, h: 0.06,
      fill: { color: theme.accent }
    });
    
    // Tech name
    slide.addText(tech.name, {
      x: xPos + 0.15, y: 3.7, w: 2.6, h: 0.35,
      fontSize: 15, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    // Version badge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos + 2.2, y: 3.75, w: 0.55, h: 0.22,
      fill: { color: theme.accent, transparency: 80 }
    });
    
    slide.addText(tech.stats, {
      x: xPos + 2.2, y: 3.75, w: 0.55, h: 0.22,
      fontSize: 7, fontFace: "Consolas",
      color: theme.accent, bold: false,
      align: "center", valign: "middle"
    });
    
    // Description
    slide.addText(tech.desc, {
      x: xPos + 0.15, y: 4.1, w: 2.6, h: 0.8,
      fontSize: 9, fontFace: "Consolas",
      color: "777777", bold: false
    });
    
    xPos += 3.1;
  });
  
  // Page number
  slide.addText("03", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
