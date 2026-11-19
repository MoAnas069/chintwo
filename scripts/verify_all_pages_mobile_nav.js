const fs = require('fs');

const allPages = [
  'index.html',
  'about.html',
  'portfolio.html',
  'blog.html',
  'contact.html',
  '404.html',
  'about/index.html',
  'portfolio/index.html',
  'blog/index.html',
  'contact/index.html',
  'portfolio/arrival-in-the-cold-mist.html',
  'portfolio/exhibitions-archive.html',
  'portfolio/fine-art-editions.html',
  'portfolio/nocturne-for-two-solitudes.html',
  'portfolio/the-cartographers-dream.html',
  'portfolio/the-silent-hour.html',
  'portfolio/arrival-in-the-cold-mist/index.html',
  'portfolio/exhibitions-archive/index.html',
  'portfolio/fine-art-editions/index.html',
  'portfolio/nocturne-for-two-solitudes/index.html',
  'portfolio/the-cartographers-dream/index.html',
  'portfolio/the-silent-hour/index.html',
  'blog/monoprint-textures-and-synthesis.html',
  'blog/on-the-weight-of-quiet-images.html',
  'blog/the-poetry-of-chiaroscuro.html',
  'blog/monoprint-textures-and-synthesis/index.html',
  'blog/on-the-weight-of-quiet-images/index.html',
  'blog/the-poetry-of-chiaroscuro/index.html'
];

console.log(`Starting rigorous verification across ${allPages.length} pages...\n`);

let passedCount = 0;
let failures = [];

allPages.forEach(file => {
  if (!fs.existsSync(file)) {
    failures.push({ file, reason: 'File does not exist' });
    return;
  }

  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Header taskbar
  const hasTaskbar = content.includes('class="chintwo-taskbar"');
  if (!hasTaskbar) {
    failures.push({ file, reason: 'Missing class="chintwo-taskbar"' });
    return;
  }

  // Check 2: Mobile menu button
  const hasMenuBtn = content.includes('chintwo-mobile-menu-btn');
  if (!hasMenuBtn) {
    failures.push({ file, reason: 'Missing chintwo-mobile-menu-btn' });
    return;
  }

  // Check 3: Mobile dropdown
  const hasDropdown = content.includes('chintwo-mobile-dropdown');
  if (!hasDropdown) {
    failures.push({ file, reason: 'Missing chintwo-mobile-dropdown' });
    return;
  }

  // Check 4: Inquire button inside dropdown
  const hasDropdownInquire = content.includes('chintwo-mobile-dropdown-inquire-btn');
  if (!hasDropdownInquire) {
    failures.push({ file, reason: 'Missing chintwo-mobile-dropdown-inquire-btn inside dropdown' });
    return;
  }

  // Check 5: Mobile CSS hides taskbar cta/inquire
  const hidesCtaOnMobile = (content.includes('.chintwo-taskbar-cta') || content.includes('.chintwo-inquire-btn')) &&
                           content.includes('display: none !important');
  if (!hidesCtaOnMobile) {
    failures.push({ file, reason: 'Mobile CSS does not hide taskbar Inquire CTA button with display: none !important' });
    return;
  }

  // Check 6: Mobile brand is centered
  const brandCentered = content.includes('left: 50% !important') && content.includes('transform: translate(-50%, -50%) !important');
  if (!brandCentered) {
    failures.push({ file, reason: 'Mobile brand is not centered in navbar' });
    return;
  }

  // Check 7: No conflicting rules showing Inquire in taskbar on mobile
  // Regex to check if any media query shows .chintwo-taskbar-cta or .chintwo-inquire-btn
  const mediaMatches = content.match(/@media[^{]*\{[\s\S]*?\}/g) || [];
  let conflictingRule = false;
  mediaMatches.forEach(m => {
    // If media query has max-width
    if (m.includes('max-width') && (m.includes('.chintwo-taskbar-cta') || m.includes('.chintwo-inquire-btn'))) {
      // Check if it sets display to inline-flex, flex, block, or anything other than none
      if (/display\s*:\s*(?:inline-flex|flex|block|inline-block)\s*!important/i.test(m)) {
        conflictingRule = true;
      }
    }
  });

  if (conflictingRule) {
    failures.push({ file, reason: 'Conflicting media query found setting Inquire button visible on mobile' });
    return;
  }

  passedCount++;
  console.log(`[PASS] ${file}`);
});

console.log(`\n===========================================`);
console.log(`VERIFICATION RESULT: ${passedCount}/${allPages.length} PASSED`);
if (failures.length === 0) {
  console.log(`ALL CRITERIA 100% SATISFIED!`);
} else {
  console.log(`FAILURES:`, failures);
}
console.log(`===========================================\n`);
