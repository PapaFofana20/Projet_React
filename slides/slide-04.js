// Slide 04 - Frontend Technologies Details
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
  
  // Neon glow right
  slide.addShape(pres.shapes.OVAL, {
    x: 6, y: 0, w: 5, h: 5,
    fill: { color: theme.accent, transparency: 95 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.2, w: 2.2, h: 0.7
  });
  
  // Section indicator
  slide.addText("01 //", {
    x: 3.0, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("STACK FRONTEND DETAILLE", {
    x: 0.5, y: 1.0, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 2
  });
  
  // Two-column layout
  // Left column - Core Technologies
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 4.3, h: 1.9,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.65, w: 4.3, h: 0.05,
    fill: { color: theme.accent }
  });
  
  slide.addText("// CORE TECHNOLOGIES", {
    x: 0.65, y: 1.8, w: 4, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
  
  const coreTech = [
    "React 19 - Interface utilisateur reactive avec hooks et composants",
    "TypeScript - Typage statique pour un code plus securise",
    "Vite - Outil de build avec hot module replacement",
    "React Router DOM - Navigation declarative et routes"
  ];
  
  slide.addText(coreTech.map((tech, i) => ({
    text: tech,
    options: { bullet: true, breakLine: i < coreTech.length - 1 }
  })), {
    x: 0.65, y: 2.15, w: 4, h: 1.35,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false,
    paraSpaceAfter: 5
  });
  
  // Right column - UI & UX
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.65, w: 4.3, h: 1.9,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.65, w: 4.3, h: 0.05,
    fill: { color: theme.accent }
  });
  
  slide.addText("// UI / UX STACK", {
    x: 5.35, y: 1.8, w: 4, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
  
  const uiTech = [
    "TailwindCSS - Framework CSS utility-first pour design rapide",
    "Framer Motion - Animations declaratives et gestures avancees",
    "Lucide React - Iconographie moderne et personnalisable",
    "Tailwind Merge - Optimisation des classes CSS"
  ];
  
  slide.addText(uiTech.map((tech, i) => ({
    text: tech,
    options: { bullet: true, breakLine: i < uiTech.length - 1 }
  })), {
    x: 5.35, y: 2.15, w: 4, h: 1.35,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false,
    paraSpaceAfter: 5
  });
  
  // Libraries section
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.7, w: 9, h: 1.6,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.7, w: 0.08, h: 1.6,
    fill: { color: theme.accent }
  });
  
  slide.addText("// BIBLIOTHEQUES SPECIALISEES", {
    x: 0.75, y: 3.85, w: 8, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
  
  const libTech = [
    "Recharts - Visualisation de donnees performante et personnalisable",
    "JSPDF - Generation de documents PDF pour les tickets de cinema",
    "QRCode React - Creation de codes QR uniques pour chaque reservation",
    "Supabase Client - Integration backend pour authentification et stockage",
    "React Hook Form - Gestion des formulaires avec validation optimale"
  ];
  
  slide.addText(libTech.map((tech, i) => ({
    text: tech,
    options: { bullet: true, breakLine: i < libTech.length - 1 }
  })), {
    x: 0.75, y: 4.2, w: 8.5, h: 1.05,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false,
    paraSpaceAfter: 3
  });
  
  // Page number
  slide.addText("04", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
