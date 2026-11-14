const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

const routesToTest = [
  '/',
  '/about',
  '/portfolio',
  '/portfolio/the-cartographers-dream',
  '/portfolio/arrival-in-the-cold-mist',
  '/portfolio/the-silent-hour',
  '/portfolio/nocturne-for-two-solitudes',
  '/portfolio/fine-art-editions',
  '/portfolio/exhibitions-archive',
  '/blog',
  '/blog/on-the-weight-of-quiet-images',
  '/blog/the-poetry-of-chiaroscuro',
  '/blog/monoprint-textures-and-synthesis',
  '/contact',
  '/assets/scripts/FlexCarousel.js',
  '/assets/styles/FlexCarousel.css',
  '/assets/images/chintwo_emblem.svg',
  '/assets/images/fDh0jZF0V8L0VApCB9oAHIFgd8.webp',
  '/assets/images/LcTxyeMFm5sIiiSm4Iop5zds.webp',
  '/assets/images/peaa6VBBdWRSL3icJ2tpwsIXZI.webp',
  '/assets/images/art_silent_hour.webp',
  '/assets/images/6TsUBdB1Ab00bEfg5EwbCxb1Khg.webp',
  '/assets/images/Jh0aZZUumY8rCVh8diGYoi30lAU.webp',
  '/assets/images/bg5zKXacbxF9hxgxh95vSeYyKHM.webp',
  '/assets/images/coNU5GEVyZAGUw45WDGQjFl1OPI.webp',
  '/assets/images/art_process.webp'
];

function resolveRoute(urlPath) {
  let pathname = urlPath;
  if (pathname.startsWith('/images/')) {
    pathname = '/assets/images/' + pathname.slice('/images/'.length);
  } else if (pathname.startsWith('/sites/2taSyT2OLbVMIVlKVrycdC/')) {
    pathname = '/assets/scripts/' + pathname.slice('/sites/2taSyT2OLbVMIVlKVrycdC/'.length);
  }

  // 1. Direct file check
  let potentialPath = path.join(ROOT_DIR, pathname);
  if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
    return potentialPath;
  }

  // 2. Root check
  if (pathname === '/') {
    return path.join(ROOT_DIR, 'index.html');
  }

  // 3. Clean route check
  const dirIndex = path.join(ROOT_DIR, pathname, 'index.html');
  if (fs.existsSync(dirIndex)) {
    return dirIndex;
  }

  const htmlFile = path.join(ROOT_DIR, pathname + '.html');
  if (fs.existsSync(htmlFile)) {
    return htmlFile;
  }

  return null;
}

console.log(`Resolving ${routesToTest.length} routes...`);
let passed = 0;
for (const r of routesToTest) {
  const resolved = resolveRoute(r);
  if (resolved && fs.existsSync(resolved)) {
    const size = fs.statSync(resolved).size;
    console.log(`[PASS] ${r} -> ${path.relative(ROOT_DIR, resolved)} (${size} bytes)`);
    passed++;
  } else {
    console.error(`[FAIL] ${r} did not resolve`);
  }
}

console.log(`\nResult: ${passed}/${routesToTest.length} routes successfully resolved.`);
