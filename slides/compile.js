// compile.js - Compile all slides into SENEFLIX presentation
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'SENEFLIX - Presentation Technique';
pres.author = 'SENEFLIX Team';
pres.subject = 'Technologies et Architecture';

// Authentic SENEFLIX theme colors from logo
const theme = {
  primary: 'F4001A',    // Authentic SENEFLIX red
  secondary: '666666',  // Gray text
  accent: 'F4001A',     // Authentic SENEFLIX red
  light: 'CCCCCC',      // Light gray
  bg: '050505'          // Dark background
};

// Load and create all slides
require('./slide-01.js').createSlide(pres, theme);
require('./slide-02.js').createSlide(pres, theme);
require('./slide-03.js').createSlide(pres, theme);
require('./slide-04.js').createSlide(pres, theme);
require('./slide-05.js').createSlide(pres, theme);
require('./slide-06.js').createSlide(pres, theme);
require('./slide-07.js').createSlide(pres, theme);
require('./slide-08.js').createSlide(pres, theme);

// Generate the presentation
pres.writeFile({ fileName: './output/SENEFLIX_Presentation_Final.pptx' })
  .then(() => {
    console.log('Presentation generated successfully: ./output/SENEFLIX_Presentation_Final.pptx');
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
  });
