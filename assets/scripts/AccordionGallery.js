/**
 * AccordionGallery Component - React Bits implementation
 * Vanilla JS + GSAP controller for Chintwo Portfolio
 */

import { gsap } from './gsap.js';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

export function initAccordionGallery(container, options = {}) {
  if (!container) return null;

  const {
    items = DEFAULT_ITEMS,
    defaultIndex = 2,
    accentColor = '#ffffff',
    overlayColor = '#060010',
    textColor = '#ffffff',
    height = 560,
    gap = 12,
    radius = 16,
    expandRatio = 0.52,
    orientation = 'horizontal',
    duration = 0.6,
    ease = 'power3.out',
    parallax = 0.5,
    tilt = 8,
    stagger = 0.06,
    trigger = 'hover',
    showLabels = true,
    grayscale = true,
    className = ''
  } = options;

  const vertical = orientation === 'vertical';
  const count = items.length;
  let active = Math.min(Math.max(defaultIndex, 0), count - 1);
  let tl = null;
  let firstRun = true;
  let mediaSize = 320;

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Build DOM Structure
  container.className = `accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`;
  container.setAttribute('role', 'list');
  container.setAttribute('aria-label', 'Image accordion gallery');
  container.style.setProperty('--ag-accent', accentColor);
  container.style.setProperty('--ag-overlay', overlayColor);
  container.style.setProperty('--ag-text', textColor);
  container.style.setProperty('--ag-gap', `${gap}px`);
  container.style.setProperty('--ag-radius', `${radius}px`);
  container.style.height = vertical ? `${Math.round(height * 1.6)}px` : `${height}px`;

  // Render Panels
  container.innerHTML = '';
  const panelElements = [];
  const mediaElements = [];
  const barElements = [];
  const textElements = [];

  items.forEach((item, i) => {
    const isActive = i === active;
    const tag = item.link ? 'a' : 'div';
    const panel = document.createElement(tag);
    panel.className = `ag-panel${isActive ? ' ag-panel--active' : ''}`;
    panel.style.borderRadius = `${radius}px`;
    if (item.link) panel.href = item.link;
    panel.setAttribute('role', 'listitem');
    panel.setAttribute('tabindex', '0');
    if (isActive) panel.setAttribute('aria-current', 'true');
    panel.setAttribute('aria-label', item.label || '');

    // Frame
    const frame = document.createElement('span');
    frame.className = 'ag-panel__frame';

    // Media
    const media = document.createElement('span');
    media.className = 'ag-panel__media';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.alt || item.label || '';
    img.draggable = false;
    img.loading = i < 3 ? 'eager' : 'lazy';
    media.appendChild(img);

    // Overlay
    const overlay = document.createElement('span');
    overlay.className = 'ag-panel__overlay';
    overlay.setAttribute('aria-hidden', 'true');

    frame.appendChild(media);
    frame.appendChild(overlay);
    panel.appendChild(frame);

    // Label
    let bar = null;
    let text = null;
    if (showLabels) {
      const labelContainer = document.createElement('span');
      labelContainer.className = 'ag-panel__label';
      labelContainer.setAttribute('aria-hidden', 'true');

      bar = document.createElement('span');
      bar.className = 'ag-panel__bar';

      text = document.createElement('span');
      text.className = 'ag-panel__text';

      if (item.subtitle) {
        text.innerHTML = `
          <span class="ag-panel__text-title">${item.label}</span>
          <span class="ag-panel__text-sub">${item.subtitle}</span>
        `;
      } else {
        text.textContent = item.label;
      }

      labelContainer.appendChild(bar);
      labelContainer.appendChild(text);
      panel.appendChild(labelContainer);
    }

    container.appendChild(panel);

    panelElements.push(panel);
    mediaElements.push(media);
    barElements.push(bar);
    textElements.push(text);
  });

  // GSAP animation engine
  const applyLayout = (animate = true) => {
    if (!panelElements.length) return;

    const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

    if (tl) tl.kill();
    const dur = animate && !prefersReduced ? duration : 0;
    
    // Check if gsap is available
    const g = window.gsap || gsap;
    if (!g) {
      // Fallback layout without GSAP
      panelElements.forEach((panel, i) => {
        const isActive = i === active;
        panel.style.flexGrow = isActive ? grow : 1;
        panel.classList.toggle('ag-panel--active', isActive);
      });
      return;
    }

    tl = g.timeline();

    panelElements.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === active;
      panel.classList.toggle('ag-panel--active', isActive);
      if (isActive) {
        panel.setAttribute('aria-current', 'true');
      } else {
        panel.removeAttribute('aria-current');
      }

      const media = mediaElements[i];
      const bar = barElements[i];
      const text = textElements[i];

      const rot = isActive ? 0 : i < active ? tilt : -tilt;
      const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

      tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, active - i));
        const shift = drift * parallax * mediaSize * 0.06;
        const gray = grayscale ? (isActive ? 0 : 1) : 0;
        tl.to(
          media,
          {
            xPercent: -50,
            yPercent: -50,
            x: vertical ? 0 : isActive ? 0 : shift,
            y: vertical ? (isActive ? 0 : shift) : 0,
            '--ag-gray': gray,
            '--ag-dim': isActive ? 0 : 0.35,
            duration: dur,
            ease
          },
          0
        );
      }

      if (showLabels && bar && text) {
        if (isActive) {
          tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
        } else {
          tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
        }
      }
    });
  };

  const setActive = (i, animate = true) => {
    if (i < 0 || i >= count || i === active) return;
    active = i;
    applyLayout(animate);
    if (typeof options.onChange === 'function') {
      options.onChange(active, items[active]);
    }
  };

  // Measure and Resize handling
  const measure = () => {
    const rect = container.getBoundingClientRect();
    const total = vertical ? rect.height : rect.width;
    const usable = Math.max(total - gap * (count - 1), 120);
    const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
    mediaSize = size;
    container.style.setProperty('--ag-media-size', `${size}px`);
    applyLayout(!firstRun);
  };

  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(container);

  // Initial layout execution
  applyLayout(false);
  firstRun = false;

  // Event Listeners
  panelElements.forEach((panel, i) => {
    if (trigger === 'hover') {
      panel.addEventListener('mouseenter', () => setActive(i));
    }

    panel.addEventListener('click', (e) => {
      if (i !== active) {
        e.preventDefault();
        setActive(i);
      }
    });

    panel.addEventListener('focus', () => setActive(i));

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i + 1) % count);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i - 1 + count) % count);
      }
    });
  });

  return {
    setActive,
    destroy: () => {
      if (tl) tl.kill();
      ro.disconnect();
    }
  };
}

export default initAccordionGallery;
