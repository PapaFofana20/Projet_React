// Slide 07 - Design & UI/UX
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
    x: 6, y: 0.5, w: 5, h: 5,
    fill: { color: theme.accent, transparency: 95 }
  });
  
  // Logo
  slide.addImage({
    path: './logo.png',
    x: 0.5, y: 0.2, w: 2.2, h: 0.7
  });
  
  // Section indicator
  slide.addText("04 //", {
    x: 3.0, y: 0.3, w: 1.5, h: 0.4,
    fontSize: 14, fontFace: "Consolas",
    color: theme.accent, bold: true
  });
  
  // Title
  slide.addText("DESIGN & UI/UX", {
    x: 0.5, y: 1.0, w: 9, h: 0.55,
    fontSize: 28, fontFace: "Arial Black",
    color: "FFFFFF", bold: true,
    charSpacing: 2
  });
  
  // Design principles - 3 cards
  const designPrinciples = [
    { 
      title: "MINIMALISTE", 
      desc: "Interface epuree mettant en valeur le contenu. Espace blanc strategique pour guider l'attention.",
      icon: "[ ]"
    },
    { 
      title: "MODERNE", 
      desc: "Esthetique contemporaine avec couleurs profondes et accents vibrants. Typographie audacieuse.",
      icon: "< />"
    },
    { 
      title: "INTUITIF", 
      desc: "Navigation naturelle et parcours utilisateur optimise. Accessibilite au coeur du design.",
      icon: "{ }"
    }
  ];
  
  let xPos = 0.5;
  designPrinciples.forEach((principle) => {
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.65, w: 2.95, h: 1.7,
      fill: { color: "0C0C0C" }
    });
    
    // Red top accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xPos, y: 1.65, w: 2.95, h: 0.06,
      fill: { color: theme.accent }
    });
    
    // Icon
    slide.addText(principle.icon, {
      x: xPos + 0.15, y: 1.8, w: 2.65, h: 0.35,
      fontSize: 16, fontFace: "Consolas",
      color: theme.accent, bold: true
    });
    
    // Title
    slide.addText(principle.title, {
      x: xPos + 0.15, y: 2.15, w: 2.65, h: 0.3,
      fontSize: 12, fontFace: "Arial",
      color: "FFFFFF", bold: true
    });
    
    // Description
    slide.addText(principle.desc, {
      x: xPos + 0.15, y: 2.5, w: 2.65, h: 0.8,
      fontSize: 9, fontFace: "Consolas",
      color: "999999", bold: false
    });
    
    xPos += 3.1;
  });
  
  // Animation section
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 9, h: 1.7,
    fill: { color: "0C0C0C" }
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 0.1, h: 1.7,
    fill: { color: theme.accent }
  });
  
  slide.addText("// ANIMATIONS & INTERACTIONS", {
    x: 0.75, y: 3.7, w: 8, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
  
  const animations = [
    "Transitions de pages fluides avec Framer Motion pour une navigation smoother",
    "Effets de survol sur les cartes de films avec zoom subtil et changement de couleur",
    "Animations d'apparition progressive du contenu (fade-in, slide-up) pour guider le regard",
    "Feedback visuel instantane lors des clics et interactions utilisateur",
    "Chargement skeleton pour une perception de rapidite pendant les appels API",
    "Animations de validation pour confirmer les actions utilisateur"
  ];
  
  slide.addText(animations.map((anim, i) => ({
    text: anim,
    options: { bullet: true, breakLine: i < animations.length - 1 }
  })), {
    x: 0.75, y: 4.05, w: 8.5, h: 1.15,
    fontSize: 9, fontFace: "Consolas",
    color: "AAAAAA", bold: false,
    paraSpaceAfter: 2
  });
  
  // Page number
  slide.addText("07", {
    x: 9.3, y: 5.1, w: 0.5, h: 0.35,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true
  });
}

module.exports = { createSlide };
