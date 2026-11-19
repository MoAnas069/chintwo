const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'public');

console.log('Building static site into:', OUT_DIR);

// Clean or create public/
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy top-level HTML and static files
const topLevelFiles = [
  'index.html',
  '404.html',
  'about.html',
  'portfolio.html',
  'blog.html',
  'contact.html',
  'admin.html',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico'
];

topLevelFiles.forEach(f => {
  const src = path.join(ROOT_DIR, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT_DIR, f));
  }
});

// 2. Copy directories
const dirs = ['assets', 'about', 'portfolio', 'blog', 'contact', 'admin'];
dirs.forEach(d => {
  const src = path.join(ROOT_DIR, d);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(OUT_DIR, d));
  }
});

console.log('Static site build complete! Output in public/');
