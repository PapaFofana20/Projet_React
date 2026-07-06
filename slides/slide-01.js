// Slide 01 - Cover Page - Futuristic Design with SENEFLIX Logo
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  
  // Deep black background
  slide.background = { color: "050505" };
  
  // Grid lines for futuristic effect (horizontal)
  for (let i = 0; i < 6; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: 0, y: i * 1.1, w: 10, h: 0,
      line: { color: "1A1A1A", width: 0.5 }
    });
  }
  
  // Grid lines (vertical)
  for (let i = 0; i < 11; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: i, y: 0, w: 0, h: 5.625,
      line: { color: "1A1A1A", width: 0.5 }
    });
  }
  
  // Neon red glow effect (large circle behind text)
  slide.addShape(pres.shapes.OVAL, {
    x: -2, y: 0.5, w: 8, h: 4,
    fill: { color: theme.accent, transparency: 92 }
  });
  
  // Red accent bar left
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.08, h: 5.625,
    fill: { color: theme.accent }
  });
  
  // Large geometric accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7, y: 0, w: 3, h: 0.15,
    fill: { color: theme.accent }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.5, y: 0, w: 1.5, h: 2,
    fill: { color: theme.accent, transparency: 70 }
  });
  
  // Add SENEFLIX Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 1.0, w: 4.5, h: 1.5
  });
  
  // Red underline with glow
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.6, w: 4.5, h: 0.06,
    fill: { color: theme.accent }
  });
  
  // Subtitle
  slide.addText("APPLICATION DE RESERVATION DE BILLETS DE CINEMA", {
    x: 0.5, y: 2.85, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Arial",
    color: theme.accent, bold: false,
    charSpacing: 2
  });
  
  // Tagline with typing effect style
  slide.addText("// L'experience cinema redifinie pour l'ere digitale", {
    x: 0.5, y: 3.55, w: 8, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: "888888", bold: false
  });
  
  // Tech stack indicator
  slide.addText("React 19 | TypeScript | NestJS | MySQL", {
    x: 0.5, y: 4.2, w: 6, h: 0.35,
    fontSize: 11, fontFace: "Consolas",
    color: theme.accent, bold: false
  });
  
  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.25, w: 10, h: 0.375,
    fill: { color: theme.accent }
  });
  
  slide.addText("PRESENTATION TECHNIQUE  //  2026  //  v1.0", {
    x: 0.5, y: 5.28, w: 9, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    charSpacing: 1
  });
}

module.exports = { createSlide };
