const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        getAllHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles('.');
console.log(`Auditing ${htmlFiles.length} HTML files...`);

let issues = 0;
const auditedRoutes = new Set();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasTaskbar = content.includes('chintwo-taskbar');
  const hasFooter = content.includes('chintwo-footer');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'MISSING TITLE';

  // Check for any leftover #111112 without override or broken styles
  const hasRawBlackGround = content.includes('#111112') && !content.includes('#f7f5f0 !important');

  // Check for broken links (e.g. solitude-light-space or old photographer links)
  const hasOldSolitudeLink = content.includes('solitude-light-space');
  const hasOldAuthorLink = content.includes('abhinand');

  if (!hasTaskbar || !hasFooter || hasRawBlackGround || hasOldSolitudeLink || hasOldAuthorLink) {
    console.warn(`[WARN] ${file}:`);
    if (!hasTaskbar) console.warn('  - Missing taskbar');
    if (!hasFooter) console.warn('  - Missing footer');
    if (hasRawBlackGround) console.warn('  - Un-overridden black ground #111112');
    if (hasOldSolitudeLink) console.warn('  - Contains old solitude-light-space link');
    if (hasOldAuthorLink) console.warn('  - Contains old abhinand text');
    issues++;
  } else {
    console.log(`✓ ${file} [OK] - "${title}"`);
  }
});

console.log(`\nAudit completed: ${htmlFiles.length - issues}/${htmlFiles.length} passed.`);
