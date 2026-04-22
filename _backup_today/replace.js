const fs = require('fs');

function replaceInFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let newContent = content.replace(/비즈컷/g, 'THE3 컷').replace(/BizCut/g, 'THE3 Studio').replace(/bizcut/g, 'the3studio');
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log('Updated ' + filepath);
  }
}

const files = [
  'c:/THE3studio/the3-app/index.html',
  'c:/THE3studio/the3-app/components/Home.tsx',
  'c:/THE3studio/the3-app/components/Layout.tsx',
  'c:/THE3studio/the3-app/components/PersonaSetup.tsx',
  'c:/THE3studio/the3-app/components/PhotoEditor.tsx',
  'c:/THE3studio/the3-app/components/SnsContentCreator.tsx',
  'c:/THE3studio/the3-app/emergency.html'
];
files.forEach(f => {
  try { replaceInFile(f); } catch(e) {}
});
