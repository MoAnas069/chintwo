/**
 * CHINTWO STUDIO - LIVE SITE CONTENT SYNCHRONIZATION
 * Dynamically binds backend studio settings to every heading, subheading, and image on the site.
 */

import { onStudioSettingsChange, getStudioSettings } from './firebase-service.js';

export function initSiteContentSync() {
  function applyContent(settings) {
    if (!settings) return;

    // 1. Cover / Hero Images & Text
    if (settings.heroCoverLandscape) {
      const isMobile = window.innerWidth <= 810;
      const targetImg = (isMobile && settings.heroCoverPortrait) ? settings.heroCoverPortrait : settings.heroCoverLandscape;
      const leftPane = document.querySelector('.chintwo-diptych-img-left');
      const rightPane = document.querySelector('.chintwo-diptych-img-right');
      if (leftPane) leftPane.style.backgroundImage = `url('${targetImg}')`;
      if (rightPane) rightPane.style.backgroundImage = `url('${targetImg}')`;
    }

    if (settings.heroBrandName) {
      const heroBrand = document.querySelector('.chintwo-hero-center-name');
      if (heroBrand) heroBrand.textContent = settings.heroBrandName;
    }

    if (settings.heroScrollCue) {
      const cue = document.querySelector('.chintwo-scroll-indicator-text');
      if (cue) cue.textContent = settings.heroScrollCue;
    }

    // 2. Selected Works
    if (settings.worksHeading) {
      const workHeading = document.querySelector('#work .chintwo-section-heading');
      if (workHeading) workHeading.textContent = settings.worksHeading;
      const portTitle = document.querySelector('.chintwo-portfolio-hero .chintwo-page-title');
      if (portTitle) portTitle.textContent = settings.worksHeading;
    }
    if (settings.worksButtonText) {
      const workBtn = document.querySelector('.chintwo-work-footer-cta a');
      if (workBtn) workBtn.textContent = settings.worksButtonText;
    }

    // 3. About Section Teaser
    if (settings.aboutTeaserHeading) {
      const aboutH2 = document.querySelector('.chintwo-about-teaser-heading');
      if (aboutH2) aboutH2.textContent = settings.aboutTeaserHeading;
    }
    if (settings.aboutTeaserText) {
      const aboutText = document.querySelector('.chintwo-about-teaser-text');
      if (aboutText) aboutText.textContent = settings.aboutTeaserText;
    }
    if (settings.aboutTeaserImage) {
      const aboutImg = document.querySelector('.chintwo-about-teaser-img');
      if (aboutImg) aboutImg.src = settings.aboutTeaserImage;
    }

    // Metrics
    if (settings.aboutMetric1Val) {
      const mVal1 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-val')[0];
      if (mVal1) mVal1.textContent = settings.aboutMetric1Val;
    }
    if (settings.aboutMetric1Lbl) {
      const mLbl1 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-lbl')[0];
      if (mLbl1) mLbl1.textContent = settings.aboutMetric1Lbl;
    }
    if (settings.aboutMetric2Val) {
      const mVal2 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-val')[1];
      if (mVal2) mVal2.textContent = settings.aboutMetric2Val;
    }
    if (settings.aboutMetric2Lbl) {
      const mLbl2 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-lbl')[1];
      if (mLbl2) mLbl2.textContent = settings.aboutMetric2Lbl;
    }
    if (settings.aboutMetric3Val) {
      const mVal3 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-val')[2];
      if (mVal3) mVal3.textContent = settings.aboutMetric3Val;
    }
    if (settings.aboutMetric3Lbl) {
      const mLbl3 = document.querySelectorAll('.chintwo-teaser-metric .chintwo-metric-lbl')[2];
      if (mLbl3) mLbl3.textContent = settings.aboutMetric3Lbl;
    }

    // About Chapters
    const storyRows = document.querySelectorAll('.chintwo-story-row');
    if (storyRows.length >= 3) {
      // Chapter 1
      if (settings.aboutChapter1Title) {
        const h3 = storyRows[0].querySelector('.chintwo-story-heading');
        if (h3) h3.textContent = settings.aboutChapter1Title;
      }
      if (settings.aboutChapter1Subtitle) {
        const sub = storyRows[0].querySelector('.chintwo-story-sub');
        if (sub) sub.textContent = settings.aboutChapter1Subtitle;
      }
      if (settings.aboutChapter1Text) {
        const p = storyRows[0].querySelector('.chintwo-story-text');
        if (p) p.textContent = settings.aboutChapter1Text;
      }
      if (settings.aboutChapter1Image) {
        const img = storyRows[0].querySelector('.chintwo-story-img');
        if (img) img.src = settings.aboutChapter1Image;
      }

      // Chapter 2
      if (settings.aboutChapter2Title) {
        const h3 = storyRows[1].querySelector('.chintwo-story-heading');
        if (h3) h3.textContent = settings.aboutChapter2Title;
      }
      if (settings.aboutChapter2Subtitle) {
        const sub = storyRows[1].querySelector('.chintwo-story-sub');
        if (sub) sub.textContent = settings.aboutChapter2Subtitle;
      }
      if (settings.aboutChapter2Text) {
        const p = storyRows[1].querySelector('.chintwo-story-text');
        if (p) p.textContent = settings.aboutChapter2Text;
      }
      if (settings.aboutChapter2Image) {
        const img = storyRows[1].querySelector('.chintwo-story-img');
        if (img) img.src = settings.aboutChapter2Image;
      }

      // Chapter 3
      if (settings.aboutChapter3Title) {
        const h3 = storyRows[2].querySelector('.chintwo-story-heading');
        if (h3) h3.textContent = settings.aboutChapter3Title;
      }
      if (settings.aboutChapter3Subtitle) {
        const sub = storyRows[2].querySelector('.chintwo-story-sub');
        if (sub) sub.textContent = settings.aboutChapter3Subtitle;
      }
      if (settings.aboutChapter3Text) {
        const p = storyRows[2].querySelector('.chintwo-story-text');
        if (p) p.textContent = settings.aboutChapter3Text;
      }
      if (settings.aboutChapter3Image) {
        const img = storyRows[2].querySelector('.chintwo-story-img');
        if (img) img.src = settings.aboutChapter3Image;
      }
    }

    // 4. Journal / Field Notes Section
    if (settings.journalHeading) {
      const jHead = document.querySelector('#journal .chintwo-section-heading');
      if (jHead) jHead.textContent = settings.journalHeading;
      const bTitle = document.querySelector('.chintwo-blog-hero .chintwo-page-title');
      if (bTitle) bTitle.textContent = settings.journalHeading;
    }
    if (settings.journalSubheading) {
      const jSub = document.querySelector('#journal .chintwo-section-sub');
      if (jSub) jSub.textContent = settings.journalSubheading;
      const bSub = document.querySelector('.chintwo-blog-hero .chintwo-page-subtitle');
      if (bSub) bSub.textContent = settings.journalSubheading;
    }
    if (settings.journalButtonText) {
      const jBtn = document.querySelector('.chintwo-journal-header-right a');
      if (jBtn) jBtn.textContent = settings.journalButtonText;
    }

    // 5. Footer & Provenance
    if (settings.footerStatement) {
      const fState = document.querySelector('.chintwo-footer-statement');
      if (fState) fState.textContent = settings.footerStatement;
    }
    if (settings.footerSubstatement) {
      const fSub = document.querySelector('.chintwo-footer-substatement');
      if (fSub) {
        fSub.innerHTML = settings.footerSubstatement.replace(
          /(studio@chintwo\.com|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
          '<a href="mailto:$1" class="chintwo-footer-email-link">$1</a>'
        );
      }
    }
    if (settings.footerCopyright) {
      const fCopy = document.querySelector('.chintwo-footer-copy');
      if (fCopy) fCopy.textContent = settings.footerCopyright;
    }

    // 6. Contact Page Elements
    if (settings.contactHeading) {
      const cHead = document.querySelector('.chintwo-contact-title');
      if (cHead) cHead.textContent = settings.contactHeading;
    }
    if (settings.contactSubheading) {
      const cSub = document.querySelector('.chintwo-contact-subtitle');
      if (cSub) cSub.textContent = settings.contactSubheading;
    }
  }

  // Load cached settings immediately
  getStudioSettings().then(applyContent);
  // Real-time listener for live updates from admin
  onStudioSettingsChange(applyContent);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteContentSync);
  } else {
    initSiteContentSync();
  }
}

