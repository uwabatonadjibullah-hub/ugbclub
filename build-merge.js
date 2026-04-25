const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Copy public site
console.log('Copying Public-site/dist to dist...');
copyDir(path.join(__dirname, 'Public-site', 'dist'), distDir);

// Copy admin site
console.log('Copying Admin-site/dist to dist/admin...');
copyDir(path.join(__dirname, 'Admin-site', 'dist'), path.join(distDir, 'admin'));

console.log('Build merge complete!');
