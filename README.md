# Chintwo — Visual Artist & Illustrator | London

Official portfolio website for **Chintwo**, a London-based contemporary visual artist creating evocative artworks, textured canvases, sculptural forms, and spatial installations.

---

## 🎨 About the Artist

Chintwo is a London-based multidisciplinary contemporary artist exploring light, spatial harmony, raw pigment, and tactile visual storytelling. From bespoke private commissions and architectural installations to gallery collections, Chintwo's work captures the intimacy of spaces, stories, and atmospheric beauty.

---

## 🌟 Highlights & Features

- **Refined Art Portfolio**: Dedicated showcases across 6 artistic disciplines:
  - **Spaces & Environments**: Architectural Murals & Spatial Works
  - **Sensory & Still Life Art**: Textural & Atmospheric Studies
  - **Archival Giclée & Screenprints**: Material & Fine Art Objects
  - **Conceptual & Editorial**: Creative Direction & Narrative Works
  - **Oil on Linen Panel**: Emotive Human Forms & Portraits
  - **Exhibitions & Live Art**: Gallery Curations & Public Art Activations
- **Complete 14-Page Site Architecture**: Homepage, About, Portfolio hub, 6 Portfolio project pages, Artist’s Journal (Blog), 3 essays/articles, Contact/Commissioning, and 404 page.
- **High-Performance Asset Optimization**: All photography and artwork assets optimized with Web-ready progressive compression (reduced from 216 MB down to 19 MB — a 91% reduction in load time with crisp retina clarity).
- **Client-Side Micro-Interactions**: Framer Motion animation runtime, smooth scrolling, cursor effects, and responsive navigation.
- **Zero-Dependency Built-In Node Server**: Runs out-of-the-box with Node.js on port 3000.
- **Static Hosting Ready**: Clean URL folder hierarchy (`/about/index.html`, `/portfolio/editorial-shoot/index.html`, etc.) for seamless deployment to Vercel, Netlify, GitHub Pages, Apache, or Nginx.

---

## 📁 Project Structure

```
artist 2/
├── package.json                                       # Project metadata & scripts
├── server.js                                          # Node.js server (clean URLs & asset delivery)
├── index.html                                         # Homepage (/)
├── about/
│   └── index.html                                     # About Chintwo (/about)
├── portfolio/
│   ├── index.html                                     # Portfolio gallery (/portfolio)
│   ├── interior-architectural-photography/index.html  # Spaces & Environments
│   ├── food-photography/index.html                    # Culinary & Still Life
│   ├── product-photography/index.html                 # Sculptural Objects
│   ├── editorial-shoot/index.html                     # Conceptual & Editorial
│   ├── portrait-lifestyle-photography/index.html      # Figurative Studies
│   └── event-brand-photography/index.html             # Exhibitions & Live Art
├── blog/
│   ├── index.html                                     # Artist’s Journal (/blog)
│   ├── airbnb-photography-the-one-investment/index.html
│   ├── crop-sensor-vs-full-frame-which-camera-is-right-for-you/index.html
│   └── the-impact-of-stunning-visuals-on-brand-perception/index.html
├── contact/
│   └── index.html                                     # Contact & Commissions (/contact)
├── 404.html                                           # Custom 404 Page
├── assets/
│   ├── images/                                        # Optimized artwork & photography assets (6.3 MB)
│   └── scripts/                                       # Framer runtime & animation modules
└── scripts/
    ├── build_site.py                                  # Site build & asset mapping script
    ├── optimize_images.py                             # Image optimization pipeline
    ├── rebrand_to_chintwo.py                          # Brand transformation script
    └── test_routes.py                                 # Route validation test suite
```

---

## 🚀 Running the Website

### Start the Server
```bash
npm start
# or
node server.js
```
Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Run Route Tests
```bash
npm test
# or
python scripts/test_routes.py
```

---

## 🌐 Complete Route Index

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | Homepage | Hero, Selected Works, Artist Statement, Reviews, FAQ, Inquiries |
| `/about` | About | Chintwo's artistic background, ethos, and London practice |
| `/portfolio` | Works | Comprehensive portfolio gallery |
| `/portfolio/interior-architectural-photography` | Spaces & Environments | Spatial Installations & Murals |
| `/portfolio/food-photography` | Still Life & Sensory | Culinary & Textural Art |
| `/portfolio/product-photography` | Sculptural Objects | Material & Fine Art Objects |
| `/portfolio/editorial-shoot` | Conceptual & Editorial | Concept-driven creative works |
| `/portfolio/portrait-lifestyle-photography` | Figurative Studies | Emotive Human Presence & Portraits |
| `/portfolio/event-brand-photography` | Exhibitions & Live Art | Public Art Activations & Exhibitions |
| `/blog` | Journal | Essays on contemporary art and collecting |
| `/blog/airbnb-photography-the-one-investment` | Essay 1 | *On the Weight of Quiet Images* |
| `/blog/crop-sensor-vs-full-frame-which-camera-is-right-for-you` | Essay 2 | *Scale, Medium & Texture in Art* |
| `/blog/the-impact-of-stunning-visuals-on-brand-perception` | Essay 3 | *The Power of Visual Presence* |
| `/contact` | Contact | Private commissions, studio visits & acquisitions |
| `/404` | 404 Page | Custom Not Found page |
