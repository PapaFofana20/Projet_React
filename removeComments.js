const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove JSX comments: {/* ... */}
      content = content.replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, '');
      
      // Remove block comments: /* ... */
      content = content.replace(/\/\*[\s\S]*?\*\/\n?/g, '');
      
      // Remove line comments: // ...
      content = content.replace(/(?<!:)\/\/.*$/gm, '');

      // Clean up multiple empty lines
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
