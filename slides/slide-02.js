// Slide 02 - Table of Contents - Futuristic Design
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  
  // Black background
  slide.background = { color: "080808" };
  
  // Futuristic grid
  for (let i = 0; i < 6; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: 0, y: i * 1.1, w: 10, h: 0,
      line: { color: "151515", width: 0.5 }
    });
  }
  
  // Red accent top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.12,
    fill: { color: theme.accent }
  });
  
  // Left neon glow
  slide.addShape(pres.shapes.OVAL, {
    x: -1, y: 0.5, w: 3, h: 5,
    fill: { color: theme.accent, transparency: 95 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.25, w: 2.5, h: 0.8
  });
  
  // Title
  slide.addText("// SOMMAIRE", {
    x: 0.5, y: 1.1, w: 5, h: 0.6,
    fontSize: 32, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 3
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 2, h: 0.04,
    fill: { color: theme.accent }
  });
  
  // TOC items with futuristic cards
  const tocItems = [
    { num: "01", title: "Technologies Frontend", desc: "React 19, TypeScript, Vite, TailwindCSS, Framer Motion" },
    { num: "02", title: "Technologies Backend", desc: "NestJS, TypeORM, MySQL - API REST performante" },
    { num: "03", title: "Architecture du Projet", desc: "Pattern MVC, separation concerns, scalabilite" },
    { num: "04", title: "Design & UI/UX", desc: "Interface moderne, animations fluides, experience optimale" },
    { num: "05", title: "Conclusion", desc: "Recapitulatif et perspectives d'evolution" }
  ];
  
  let yPos = 2.0;
  tocItems.forEach((item) => {
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: yPos, w: 7, h: 0.6,
      fill: { color: "111111" }
    });
    
    // Red left accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: yPos, w: 0.06, h: 0.6,
      fill: { color: theme.accent }
    });
    
    // Number
    slide.addText(item.num, {
      x: 0.7, y: yPos + 0.08, w: 0.6, h: 0.45,
      fontSize: 18, fontFace: "Arial Black",
      color: theme.accent, bold: true
    });
    
    // Title
    slide.addText(item.title, {
      x: 1.4, y: yPos + 0.05, w: 3, h: 0.3,
      fontSize: 14, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    // Description
    slide.addText(item.desc, {
      x: 1.4, y: yPos + 0.32, w: 5.8, h: 0.25,
      fontSize: 9, fontFace: "Consolas",
      color: "666666", bold: false
    });
    
    yPos += 0.68;
  });
  
  // Right decorative panel
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8, y: 0.5, w: 1.8, h: 4.5,
    fill: { color: "0A0A0A" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8, y: 0.5, w: 1.8, h: 0.1,
    fill: { color: theme.accent }
  });
  
  // Decorative elements
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.3, y: 1.5, w: 1.2, h: 0.04,
    fill: { color: theme.accent, transparency: 50 }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.3, y: 1.8, w: 0.8, h: 0.04,
    fill: { color: theme.accent, transparency: 70 }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.3, y: 2.1, w: 1.0, h: 0.04,
    fill: { color: theme.accent, transparency: 60 }
  });
  
  // Page number
  slide.addText("02", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
