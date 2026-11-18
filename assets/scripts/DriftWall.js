/**
 * DriftWall Component - React Bits implementation
 * Vanilla JS + CSS 3D controller for Chintwo Portfolio
 */

const DEFAULT_ITEMS = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Tile ${i + 1}`,
    href: undefined
  };
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export function initDriftWall(container, options = {}) {
  if (!container) return null;

  const {
    items = DEFAULT_ITEMS,
    columns = 3,
    tileWidth = 140,
    tileHeight = 96,
    gap = 14,
    radius = 12,
    tilt = 14,
    turn = -10,
    roll = 0,
    perspective = 1100,
    depth = 90,
    speed = 34,
    direction = 'up',
    variance = 0.45,
    parallax = 0.5,
    pauseOnHover = false,
    lift = 44,
    fade = 0.6,
    dim = 0.55,
    grayscale = false,
    overlayColor = '#060010',
    className = ''
  } = options;

  let containerHeight = container.clientHeight || 520;
  let activeId = null;
  let hoveredCol = -1;
  let wallHovered = false;
  let pointer = { x: 0, y: 0 };
  let pointerDamped = { x: 0, y: 0 };
  let lastTs = null;
  let rafId = null;
  let reduced = prefersReducedMotion();

  // Root class & style setup
  container.className = `drift-wall${reduced ? ' drift-wall--reduced' : ''}${className ? ` ${className}` : ''}`;
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Drifting wall of artwork tiles');

  container.style.setProperty('--dw-tile-w', `${tileWidth}px`);
  container.style.setProperty('--dw-tile-h', `${tileHeight}px`);
  container.style.setProperty('--dw-gap', `${gap}px`);
  container.style.setProperty('--dw-radius', `${radius}px`);
  container.style.setProperty('--dw-perspective', `${perspective}px`);
  container.style.setProperty('--dw-lift', `${lift}px`);
  container.style.setProperty('--dw-dim', dim);
  container.style.setProperty('--dw-gray', grayscale ? 1 : 0);
  container.style.setProperty('--dw-overlay', overlayColor);
  container.style.setProperty('--dw-edge', `${Math.max(0, (1 - fade) * 100)}%`);

  // Build columns
  const columnItems = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => columnItems[i % columns].push(item));

  const unit = tileHeight + gap;
  const columnMeta = columnItems.map(col => {
    const copyHeight = Math.max(unit, col.length * unit);
    const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
    return { copyHeight, copies };
  });

  const dirSign = direction === 'up' ? 1 : -1;
  const baseVelocities = columnItems.map((_, c) => {
    const altSign = c % 2 === 0 ? 1 : -1;
    return speed * columnFactor(c, variance) * dirSign * altSign;
  });

  const offsets = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
  const velocities = columnItems.map(() => 0);

  // Build DOM
  container.innerHTML = '';
  const plane = document.createElement('div');
  plane.className = 'drift-wall__plane';

  const trackElements = [];
  const tileElements = new Map();

  const activate = (id, colIndex) => {
    if (activeId && tileElements.has(activeId)) {
      tileElements.get(activeId).classList.remove('is-active');
    }
    activeId = id;
    hoveredCol = colIndex;
    if (tileElements.has(id)) {
      tileElements.get(id).classList.add('is-active');
    }
  };

  const release = () => {
    if (activeId && tileElements.has(activeId)) {
      tileElements.get(activeId).classList.remove('is-active');
    }
    activeId = null;
    hoveredCol = -1;
  };

  columnItems.forEach((col, c) => {
    const meta = columnMeta[c];
    const colEl = document.createElement('div');
    colEl.className = 'drift-wall__col';

    const trackEl = document.createElement('div');
    trackEl.className = 'drift-wall__track';

    for (let copyIndex = 0; copyIndex < meta.copies; copyIndex++) {
      col.forEach((item, itemIndex) => {
        const id = `${c}-${copyIndex}-${itemIndex}`;
        const tag = item.href ? 'a' : 'div';
        const tile = document.createElement(tag);
        tile.className = 'drift-wall__tile';
        tile.dataset.tileId = id;
        tile.dataset.col = String(c);
        if (item.href) {
          tile.href = item.href;
          tile.target = '_self';
        } else {
          tile.tabIndex = 0;
          tile.setAttribute('role', 'button');
        }
        tile.setAttribute('aria-label', item.title || 'Artwork Tile');

        const inner = document.createElement('span');
        inner.className = 'drift-wall__inner';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title || '';
        img.loading = 'lazy';
        img.draggable = false;

        const overlay = document.createElement('span');
        overlay.className = 'drift-wall__overlay';
        overlay.setAttribute('aria-hidden', 'true');

        inner.appendChild(img);
        inner.appendChild(overlay);

        if (item.title) {
          const caption = document.createElement('span');
          caption.className = 'drift-wall__caption';
          caption.textContent = item.title;
          inner.appendChild(caption);
        }

        tile.appendChild(inner);
        trackEl.appendChild(tile);
        tileElements.set(id, tile);

        // Interaction
        tile.addEventListener('focus', () => {
          activate(id, c);
        });
        tile.addEventListener('blur', release);
      });
    }

    colEl.appendChild(trackEl);
    plane.appendChild(colEl);
    trackElements.push(trackEl);
  });

  container.appendChild(plane);

  const applyPlaneTransform = (px, py) => {
    plane.style.transform =
      `translate(-50%, -50%) scale(1.18) ` +
      `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
      `translateZ(${-depth}px)`;
  };

  // Pointer & Touch Events
  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    if (!rect) return;
    if (parallax > 0 && !reduced) {
      pointer = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5
      };
    }
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
    if (!tile) return;
    const id = tile.dataset.tileId;
    if (id === activeId) return;
    activate(id, Number(tile.dataset.col));
  };

  const onPointerEnter = () => {
    wallHovered = true;
  };

  const onPointerLeave = () => {
    wallHovered = false;
    pointer = { x: 0, y: 0 };
    release();
  };

  // Touch handling
  const onTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      onPointerMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }
  };

  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerenter', onPointerEnter);
  container.addEventListener('pointerleave', onPointerLeave);
  container.addEventListener('touchmove', onTouchMove, { passive: true });
  container.addEventListener('touchend', release);

  // ResizeObserver
  const ro = new ResizeObserver(([entry]) => {
    const h = entry.contentRect.height;
    if (h && Math.abs(h - containerHeight) > 20) {
      containerHeight = h;
    }
  });
  ro.observe(container);

  // Animation Loop
  const animate = (ts) => {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0, ts - lastTs) / 1000);
    lastTs = ts;

    const maxTilt = parallax * 8;
    const targetX = pointer.x * maxTilt;
    const targetY = -pointer.y * maxTilt;
    const damp = 1 - Math.exp(-dt / 0.12);
    pointerDamped.x += (targetX - pointerDamped.x) * damp;
    pointerDamped.y += (targetY - pointerDamped.y) * damp;
    applyPlaneTransform(pointerDamped.x, pointerDamped.y);

    if (!reduced) {
      for (let c = 0; c < trackElements.length; c++) {
        const meta = columnMeta[c];
        if (!meta) continue;
        const paused = wallHovered && pauseOnHover;
        const factor = paused || hoveredCol === c ? 0 : 1;
        const target = baseVelocities[c] * factor;

        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocities[c] += (target - velocities[c]) * ease;
        let next = (offsets[c] ?? 0) + velocities[c] * dt;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        offsets[c] = next;

        const el = trackElements[c];
        if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
      }
    } else {
      for (let c = 0; c < trackElements.length; c++) {
        const el = trackElements[c];
        const meta = columnMeta[c];
        if (el && meta) el.style.transform = `translate3d(0, ${-(offsets[c] ?? 0)}px, 0)`;
      }
    }

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return {
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', release);
    }
  };
}

export default initDriftWall;

