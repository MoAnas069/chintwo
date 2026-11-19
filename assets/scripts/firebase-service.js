/**
 * CHINTWO STUDIO - FIREBASE BACKEND SERVICE LAYER
 * Modular SDK implementation using Google Cloud Firestore, Firebase Auth, and Storage.
 * Project: artist-portfolio-studio
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously 
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

// Official SDK Config for artist-portfolio-studio
export const firebaseConfig = {
  apiKey: "AIzaSyDcSLTXebEnSpNxgejr3ihM205gWPGa1V0",
  authDomain: "artist-portfolio-studio.firebaseapp.com",
  projectId: "artist-portfolio-studio",
  storageBucket: "artist-portfolio-studio.firebasestorage.app",
  messagingSenderId: "400112006219",
  appId: "1:400112006219:web:9f6e436a145febac1f49ce"
};

// Initialize Firebase App & Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Upload image to Firebase Storage with automatic base64 Data URL fallback
 */
export async function uploadImageFile(file, folder = 'uploads') {
  if (!file) throw new Error("No file selected.");
  try {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    const snap = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snap.ref);
    return downloadUrl;
  } catch (err) {
    console.warn("Storage upload fallback to base64 data URL:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

// Default Studio Settings
export const DEFAULT_STUDIO_SETTINGS = {
  artistName: "Chintwo",
  atelierTitle: "Contemporary Visual Artist & Illustrator",
  location: "Hackney Downs Studios, London E8 2BT, United Kingdom",
  inquiryEmail: "studio@chintwo.com",
  commissionStatus: "Commissions Open: 2026 – 2027",
  commissionStatusActive: true,
  announcementActive: false,
  announcementText: "Upcoming Solo Exhibition: 'The Weight of Quiet Images' at Kyoto Contemporary, Autumn 2026.",
  artistBio: "Chintwo is a contemporary visual artist working at the intersection of traditional East Asian sumi printmaking and atmospheric narrative. Rooted in the Kyoto concept of Ma—the charged stillness between forms—each creation investigates negative space, tactile washi fibers, and the emotional resonance of solitude.",
  heroStatement: "Contemporary Visual Artist & Illustrator • London & Kyoto",
  adminUsername: "chintwo",
  adminPasswordHash: "45c2ce93a130c5b8ad910ba3562858c3f42c946986ea14755dd357753c914e6c", // sha256('atelier2026!')
  socialInstagram: "https://www.instagram.com/chintwo.com",
  socialX: "https://x.com/chintwo",
  socialLinkedIn: "https://www.linkedin.com/in/chintwosankeerthanam",

  // 1. Cover / Hero Section
  heroCoverLandscape: "/assets/images/hero_landscape.webp",
  heroCoverPortrait: "/assets/images/hero_portrait.webp",
  heroBrandName: "- Chintwo -",
  heroBrandFont: "'Over the Rainbow', cursive",
  heroScrollCue: "SCROLL TO MERGE",

  // 2. Selected Works Section
  worksHeading: "Selected Works & Editions",
  worksButtonText: "Explore Full Portfolio Archive →",

  // 3. About Section
  aboutTeaserHeading: "A Story in Ink, Atmosphere & Memory",
  aboutTeaserText: "Chintwo is a contemporary visual artist working at the intersection of traditional East Asian sumi printmaking and atmospheric narrative. Rooted in the Kyoto concept of Ma—the charged stillness between forms—each creation investigates negative space, tactile washi fibers, and the emotional resonance of solitude.",
  aboutTeaserImage: "/assets/images/art_process.webp",
  aboutChapter1Title: "Ma: The Architecture of Negative Space",
  aboutChapter1Subtitle: "Kyoto Practice • 2018–Present",
  aboutChapter1Text: "In traditional Japanese aesthetics, Ma is not merely absence, but the pregnant pause that gives structure to speech, the quiet ground that allows form to exist. In every composition, the negative space is treated as an active participant—a field of vibrating restraint where the viewer's imagination completes the narrative.",
  aboutChapter1Image: "/assets/images/fDh0jZF0V8L0VApCB9oAHIFgd8.webp",
  aboutChapter2Title: "Mineral Pigments & Echizen Washi",
  aboutChapter2Subtitle: "Material Philosophy • Natural Pigments",
  aboutChapter2Text: "Working with raw lapis lazuli, crushed malachite, and Badakhshan slate requires a dialogue with gravity and water. Sized with deer hide nikawa across handmade Echizen mulberry paper, the mineral particles settle in natural sedimentations that no digital raster or chemical ink can replicate.",
  aboutChapter2Image: "/assets/images/peaa6VBBdWRSL3icJ2tpwsIXZI.webp",
  aboutChapter3Title: "The Silent Geometry of Solitude",
  aboutChapter3Subtitle: "Atmospheric Storytelling • Contemporary Chiaroscuro",
  aboutChapter3Text: "The solitary traveler, the distant mountain ridgeline, the solitary lantern in twilight—these archetypes recur as emotional coordinates. The work invites the viewer to step out of contemporary velocity into an expansive, contemplative stillness.",
  aboutChapter3Image: "/assets/images/LcTxyeMFm5sIiiSm4Iop5zds.webp",
  aboutMetric1Val: "14+",
  aboutMetric1Lbl: "Years Practice",
  aboutMetric2Val: "28+",
  aboutMetric2Lbl: "Archival Editions",
  aboutMetric3Val: "180+",
  aboutMetric3Lbl: "Private Collections",

  // 4. Journal / Field Notes Section
  journalHeading: "Dispatches from the Atelier",
  journalSubheading: "Explorations in Japanese aesthetics, the philosophy of solitude, and raw materiality.",
  journalButtonText: "View All Field Notes →",

  // 5. Footer & Provenance
  footerStatement: "Contemporary visual artist & storyteller specializing in monumental oil canvases, atmospheric chiaroscuro compositions, and limited archival editions.",
  footerSubstatement: "London & Kyoto Atelier • Private viewings by appointment • Inquiries: studio@chintwo.com",
  footerCopyright: "© 2026 CHINTWO STUDIO. All rights reserved.",

  // 6. Contact Page
  contactHeading: "Direct Inquiries & Private Commissions",
  contactSubheading: "The London and Kyoto ateliers welcome dialogues with collectors, museum curators, architectural practices, and private commissioners worldwide.",

  updatedAt: new Date().toISOString()
};

// Default Journal Posts (Field Notes & Essays)
export const DEFAULT_JOURNAL_POSTS = [
  {
    id: "on-the-weight-of-quiet-images",
    slug: "on-the-weight-of-quiet-images",
    title: "On the Weight of Quiet Images",
    badge: "ESSAY • 5 MIN READ",
    date: "OCTOBER 2026 • STUDIO ESSAY",
    image: "/assets/images/fDh0jZF0V8L0VApCB9oAHIFgd8.webp",
    excerpt: "An inquiry into visual restraint, negative space (Ma), and why quiet pictures possess an enduring, contemplative weight in an era of relentless sensory noise.",
    author: "Chintwo",
    order: 1,
    content: "The modern world is characterized by an escalating velocity of images. In this essay, we contemplate the aesthetic power of restraint, negative space (Ma), and the quiet resonance that remains after sensory noise has receded."
  },
  {
    id: "the-poetry-of-chiaroscuro",
    slug: "the-poetry-of-chiaroscuro",
    title: "The Poetry of Chiaroscuro: Framing Solitude in Book Covers",
    badge: "PROCESS • 7 MIN READ",
    date: "SEPTEMBER 2026 • COVER ART",
    image: "/assets/images/LcTxyeMFm5sIiiSm4Iop5zds.webp",
    excerpt: "Deconstructing the interplay of deep shadow, singular illumination, and emotional vulnerability in literary cover illustration and narrative composition.",
    author: "Chintwo",
    order: 2,
    content: "Chiaroscuro is more than a technical distribution of value; it is a metaphysical boundary. By placing characters at the liminal edge between illumination and absolute shadow, we evoke profound psychological interiority."
  },
  {
    id: "monoprint-textures-and-synthesis",
    slug: "monoprint-textures-and-synthesis",
    title: "Monoprint Textures & Digital Synthesis",
    badge: "TECHNIQUE • 6 MIN READ",
    date: "AUGUST 2026 • MATERIAL STUDIES",
    image: "/assets/images/peaa6VBBdWRSL3icJ2tpwsIXZI.webp",
    excerpt: "Exploring the friction between hand-pulled sumi ink impressions on Echizen kozo washi and high-precision digital layers to achieve atmospheric depth.",
    author: "Chintwo",
    order: 3,
    content: "The hand responds to the visceral resistance of wet mulberry paper, carbon ink, and heavy rollers. When these raw analog textures are layered with contemporary digital precision, a unique spatial atmosphere emerges."
  }
];

// Default Artworks Catalog
export const DEFAULT_ARTWORKS = [
  {
    id: "the-silent-hour",
    slug: "the-silent-hour",
    title: "The Silent Hour",
    year: "2026",
    editionTag: "SOLO PRESENTATION",
    category: "oil",
    dims: "180 × 120 CM (70.8 × 47.2 IN)",
    medium: "Oil, carbon sumi ink, and crushed Badakhshan slate on hand-sized linen",
    image: "/assets/images/art_silent_hour.webp",
    status: "Private Collection, London",
    availability: "acquired",
    featured: true,
    order: 1,
    description: "The Silent Hour explores the liminal threshold between twilight and absolute darkness. Painted across sixteen layering sessions in the East London atelier."
  },
  {
    id: "arrival-in-the-cold-mist",
    slug: "arrival-in-the-cold-mist",
    title: "Arrival in the Cold Mist",
    year: "2025",
    editionTag: "MUSEUM ACQUISITION",
    category: "washi",
    dims: "140 × 100 CM (55.1 × 39.4 IN)",
    medium: "Natural mineral pigments and bone hide sizing (nikawa) on Echizen kozo washi",
    image: "/assets/images/6TsUBdB1Ab00bEfg5EwbCxb1Khg.webp",
    status: "Museum Acquisition, Kyoto",
    availability: "acquired",
    featured: true,
    order: 2,
    description: "Raw mineral lapis lazuli and crushed oyster shell suspended in animal hide glue across unbleached mulberry fiber, evoking mountain mist rising at dawn."
  },
  {
    id: "the-cartographers-dream",
    slug: "the-cartographers-dream",
    title: "The Cartographer’s Dream",
    year: "2025",
    editionTag: "LITERARY COMMISSION",
    category: "charcoal",
    dims: "160 × 120 CM (63.0 × 47.2 IN)",
    medium: "Vine charcoal, ground oyster shell, and animal hide glue on unbleached Belgian linen",
    image: "/assets/images/Jh0aZZUumY8rCVh8diGYoi30lAU.webp",
    status: "Private Collection, Zurich",
    availability: "acquired",
    featured: true,
    order: 3,
    description: "An imagined topography of forgotten coastal territories and solitary navigational waypoints, investigating emotional distance."
  },
  {
    id: "nocturne-for-two-solitudes",
    slug: "nocturne-for-two-solitudes",
    title: "Nocturne for Two Solitudes",
    year: "2024",
    editionTag: "PARIS PRESENTATION",
    category: "monotype",
    dims: "120 × 90 CM (47.2 × 35.4 IN)",
    medium: "Monotype relief impression and dry graphite powder on unpressed mulberry paper",
    image: "/assets/images/bg5zKXacbxF9hxgxh95vSeYyKHM.webp",
    status: "Private Collection, Paris",
    availability: "acquired",
    featured: true,
    order: 4,
    description: "Pulled on a vintage Rochat press in a single meditative morning, capturing dense atmospheric gradations of ink."
  },
  {
    id: "fine-art-editions",
    slug: "fine-art-editions",
    title: "Fine Art & Archival Editions",
    year: "2024–2026",
    editionTag: "ARCHIVAL PRINT SUITE",
    category: "edition",
    dims: "VARIABLE SIZES (EDITIONS OF 25)",
    medium: "Hand-pulled prints on 300gsm Somerset Velvet cotton rag with deckled edges",
    image: "/assets/images/coNU5GEVyZAGUw45WDGQjFl1OPI.webp",
    status: "Select Impressions Available",
    availability: "available",
    featured: true,
    order: 5,
    description: "Limited 25-impression suites produced on 100% acid-free mould-made cotton paper with hand-torn deckled edges, signed and numbered."
  },
  {
    id: "exhibitions-archive",
    slug: "exhibitions-archive",
    title: "Exhibitions & Archive",
    year: "2020–2026",
    editionTag: "RETROSPECTIVE & PROVENANCE",
    category: "retrospective",
    dims: "INSTITUTIONAL RECORD",
    medium: "Curated installations, museum retrospectives, and gallery monographs",
    image: "/assets/images/art_process.webp",
    status: "Permanent Studio Archive",
    availability: "archive",
    featured: true,
    order: 6,
    description: "Comprehensive record of solo presentations, collaborative museum installations, and international gallery expositions."
  }
];

// Helper: Generate clean reference ID
function generateInquiryRef() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CH-${dateStr}-${rand}`;
}

/**
 * 1. Submit Collector Inquiry to Firestore
 */
export async function submitInquiry({ name, email, inquiryType, message }) {
  if (!name || !email || !message) {
    throw new Error("Please provide your name, email, and message.");
  }

  const reference = generateInquiryRef();
  const inquiryData = {
    reference,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    inquiryType: inquiryType || "General Studio Dialogue",
    message: message.trim(),
    status: "new", // 'new' | 'reviewing' | 'responded' | 'archived'
    createdAt: serverTimestamp(),
    clientTime: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : "browser"
  };

  try {
    const docRef = await addDoc(collection(db, "inquiries"), inquiryData);
    return {
      success: true,
      id: docRef.id,
      reference,
      createdAt: inquiryData.clientTime
    };
  } catch (err) {
    console.error("Firestore submitInquiry error:", err);
    throw err;
  }
}

/**
 * 2. Subscribe to Studio Dispatches (Newsletter)
 */
export async function subscribeNewsletter(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const subData = {
    email: cleanEmail,
    createdAt: serverTimestamp(),
    clientTime: new Date().toISOString(),
    status: "active"
  };

  try {
    // Use cleanEmail as doc ID to prevent duplicates
    const safeDocId = cleanEmail.replace(/[^a-z0-9]/g, '_');
    await setDoc(doc(db, "subscribers", safeDocId), subData, { merge: true });
    return { success: true, email: cleanEmail };
  } catch (err) {
    console.error("Firestore subscribeNewsletter error:", err);
    throw err;
  }
}

/**
 * 3. Fetch Studio Configuration
 */
export async function getStudioSettings() {
  try {
    const docSnap = await getDoc(doc(db, "settings", "studio"));
    if (docSnap.exists()) {
      const data = { ...DEFAULT_STUDIO_SETTINGS, ...docSnap.data() };
      try { localStorage.setItem('chintwo_studio_settings_cache', JSON.stringify(data)); } catch (e) {}
      return data;
    }
  } catch (err) {
    console.warn("Using cached / default studio settings:", err);
  }
  try {
    const local = localStorage.getItem('chintwo_studio_settings_cache');
    if (local) return { ...DEFAULT_STUDIO_SETTINGS, ...JSON.parse(local) };
  } catch (e) {}
  return DEFAULT_STUDIO_SETTINGS;
}

/**
 * 4. Real-time Studio Settings Listener
 */
export function onStudioSettingsChange(callback) {
  try {
    return onSnapshot(doc(db, "settings", "studio"), (snap) => {
      if (snap.exists()) {
        const data = { ...DEFAULT_STUDIO_SETTINGS, ...snap.data() };
        try { localStorage.setItem('chintwo_studio_settings_cache', JSON.stringify(data)); } catch (e) {}
        callback(data);
      } else {
        callback(DEFAULT_STUDIO_SETTINGS);
      }
    }, (err) => {
      console.warn("Studio settings snapshot error:", err);
      try {
        const local = localStorage.getItem('chintwo_studio_settings_cache');
        if (local) return callback({ ...DEFAULT_STUDIO_SETTINGS, ...JSON.parse(local) });
      } catch (e) {}
      callback(DEFAULT_STUDIO_SETTINGS);
    });
  } catch (err) {
    console.warn("onStudioSettingsChange error:", err);
    try {
      const local = localStorage.getItem('chintwo_studio_settings_cache');
      if (local) return callback({ ...DEFAULT_STUDIO_SETTINGS, ...JSON.parse(local) });
    } catch (e) {}
    callback(DEFAULT_STUDIO_SETTINGS);
    return () => {};
  }
}

/**
 * 5. Save Studio Configuration
 */
export async function saveStudioSettings(newSettings) {
  const current = await getStudioSettings();
  const merged = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };
  try { localStorage.setItem('chintwo_studio_settings_cache', JSON.stringify(merged)); } catch (e) {}
  try {
    await setDoc(doc(db, "settings", "studio"), merged, { merge: true });
  } catch (err) {
    console.warn("Firestore saveStudioSettings fallback to localStorage:", err);
  }
  return merged;
}

/**
 * 6. Get Artworks Catalog
 */
export async function getArtworks() {
  try {
    const q = query(collection(db, "artworks"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      try { localStorage.setItem('chintwo_artworks_cache', JSON.stringify(items)); } catch (e) {}
      return items;
    }
  } catch (err) {
    console.warn("Using cached / default artworks:", err);
  }
  try {
    const local = localStorage.getItem('chintwo_artworks_cache');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_ARTWORKS;
}

/**
 * 7. Real-time Artworks Listener
 */
export function onArtworksChange(callback) {
  try {
    const q = query(collection(db, "artworks"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        try { localStorage.setItem('chintwo_artworks_cache', JSON.stringify(items)); } catch (e) {}
        callback(items);
      } else {
        callback(DEFAULT_ARTWORKS);
      }
    }, (err) => {
      console.warn("Artworks snapshot error:", err);
      try {
        const local = localStorage.getItem('chintwo_artworks_cache');
        if (local) return callback(JSON.parse(local));
      } catch (e) {}
      callback(DEFAULT_ARTWORKS);
    });
  } catch (err) {
    try {
      const local = localStorage.getItem('chintwo_artworks_cache');
      if (local) return callback(JSON.parse(local));
    } catch (e) {}
    callback(DEFAULT_ARTWORKS);
    return () => {};
  }
}

/**
 * 8. Save or Update Artwork
 */
export async function saveArtwork(artworkId, data) {
  const docId = artworkId || data.slug || `work-${Date.now()}`;
  const artworkRecord = {
    ...data,
    id: docId,
    updatedAt: new Date().toISOString()
  };

  // Sync to local storage
  try {
    const items = await getArtworks();
    const idx = items.findIndex(a => a.id === docId);
    if (idx >= 0) items[idx] = artworkRecord;
    else items.push(artworkRecord);
    localStorage.setItem('chintwo_artworks_cache', JSON.stringify(items));
  } catch (e) {}

  // Sync to Firestore
  try {
    await setDoc(doc(db, "artworks", docId), {
      ...data,
      id: docId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore saveArtwork fallback to localStorage:", err);
  }
  return docId;
}

/**
 * 9. Delete Artwork
 */
export async function deleteArtwork(artworkId) {
  try {
    const items = await getArtworks();
    const filtered = items.filter(a => a.id !== artworkId);
    localStorage.setItem('chintwo_artworks_cache', JSON.stringify(filtered));
  } catch (e) {}

  try {
    await deleteDoc(doc(db, "artworks", artworkId));
  } catch (err) {
    console.warn("Firestore deleteArtwork note:", err);
  }
  return true;
}

/**
 * 9B. Get Journal Posts (Field Notes & Essays)
 */
export async function getJournalPosts() {
  try {
    const q = query(collection(db, "journals"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      try { localStorage.setItem('chintwo_journals_cache', JSON.stringify(posts)); } catch (e) {}
      return posts;
    }
  } catch (err) {
    console.warn("Using cached / default journal posts:", err);
  }
  try {
    const local = localStorage.getItem('chintwo_journals_cache');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_JOURNAL_POSTS;
}

/**
 * 9C. Real-time Journal Posts Listener
 */
export function onJournalPostsChange(callback) {
  try {
    const q = query(collection(db, "journals"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        try { localStorage.setItem('chintwo_journals_cache', JSON.stringify(posts)); } catch (e) {}
        callback(posts);
      } else {
        callback(DEFAULT_JOURNAL_POSTS);
      }
    }, (err) => {
      console.warn("Journal snapshot error:", err);
      try {
        const local = localStorage.getItem('chintwo_journals_cache');
        if (local) return callback(JSON.parse(local));
      } catch (e) {}
      callback(DEFAULT_JOURNAL_POSTS);
    });
  } catch (err) {
    try {
      const local = localStorage.getItem('chintwo_journals_cache');
      if (local) return callback(JSON.parse(local));
    } catch (e) {}
    callback(DEFAULT_JOURNAL_POSTS);
    return () => {};
  }
}

/**
 * 9D. Save or Update Journal Post
 */
export async function saveJournalPost(postId, data) {
  const docId = postId || data.slug || `post-${Date.now()}`;
  const postRecord = {
    ...data,
    id: docId,
    updatedAt: new Date().toISOString()
  };

  // Sync to local cache
  try {
    const posts = await getJournalPosts();
    const idx = posts.findIndex(p => p.id === docId);
    if (idx >= 0) posts[idx] = postRecord;
    else posts.push(postRecord);
    localStorage.setItem('chintwo_journals_cache', JSON.stringify(posts));
  } catch (e) {}

  // Sync to Firestore
  try {
    await setDoc(doc(db, "journals", docId), {
      ...data,
      id: docId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore saveJournalPost fallback to localStorage:", err);
  }
  return docId;
}

/**
 * 9E. Delete Journal Post
 */
export async function deleteJournalPost(postId) {
  try {
    const posts = await getJournalPosts();
    const filtered = posts.filter(p => p.id !== postId);
    localStorage.setItem('chintwo_journals_cache', JSON.stringify(filtered));
  } catch (e) {}

  try {
    await deleteDoc(doc(db, "journals", postId));
  } catch (err) {
    console.warn("Firestore deleteJournalPost note:", err);
  }
  return true;
}

/**
 * 10. Get All Collector Inquiries (Admin)
 */
export async function getInquiries() {
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    try { localStorage.setItem('chintwo_inquiries_cache', JSON.stringify(items)); } catch (e) {}
    return items;
  } catch (err) {
    try {
      const snap = await getDocs(collection(db, "inquiries"));
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      try { localStorage.setItem('chintwo_inquiries_cache', JSON.stringify(items)); } catch (e) {}
      return items;
    } catch (e2) {
      const local = localStorage.getItem('chintwo_inquiries_cache');
      if (local) return JSON.parse(local);
      return [];
    }
  }
}

/**
 * 11. Update Inquiry Status (Admin)
 */
export async function updateInquiryStatus(inquiryId, status) {
  try {
    const local = localStorage.getItem('chintwo_inquiries_cache');
    if (local) {
      const items = JSON.parse(local);
      const target = items.find(i => i.id === inquiryId);
      if (target) target.status = status;
      localStorage.setItem('chintwo_inquiries_cache', JSON.stringify(items));
    }
  } catch (e) {}

  try {
    await updateDoc(doc(db, "inquiries", inquiryId), {
      status,
      statusUpdatedAt: serverTimestamp()
    });
  } catch (e) {}
  return true;
}

/**
 * 12. Delete Inquiry (Admin)
 */
export async function deleteInquiry(inquiryId) {
  try {
    const local = localStorage.getItem('chintwo_inquiries_cache');
    if (local) {
      const items = JSON.parse(local).filter(i => i.id !== inquiryId);
      localStorage.setItem('chintwo_inquiries_cache', JSON.stringify(items));
    }
  } catch (e) {}

  try {
    await deleteDoc(doc(db, "inquiries", inquiryId));
  } catch (e) {}
  return true;
}

/**
 * 13. Get All Newsletter Subscribers (Admin)
 */
export async function getSubscribers() {
  try {
    const snap = await getDocs(collection(db, "subscribers"));
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    try { localStorage.setItem('chintwo_subscribers_cache', JSON.stringify(items)); } catch (e) {}
    return items;
  } catch (err) {
    try {
      const local = localStorage.getItem('chintwo_subscribers_cache');
      if (local) return JSON.parse(local);
    } catch (e) {}
    return [];
  }
}

/**
 * 14. Delete Subscriber (Admin)
 */
export async function deleteSubscriber(subscriberId) {
  try {
    const local = localStorage.getItem('chintwo_subscribers_cache');
    if (local) {
      const items = JSON.parse(local).filter(s => s.id !== subscriberId);
      localStorage.setItem('chintwo_subscribers_cache', JSON.stringify(items));
    }
  } catch (e) {}

  try {
    await deleteDoc(doc(db, "subscribers", subscriberId));
  } catch (e) {}
  return true;
}

/**
 * 14B. Cryptographic Helper (SHA-256)
 */
export async function sha256(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buffer = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

/**
 * 14C. Verify Admin Username & Password Credentials
 */
export async function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  const settings = await getStudioSettings();
  const inputUser = username.trim().toLowerCase();
  const validUser = (settings.adminUsername || "chintwo").toLowerCase();
  
  // Accept 'chintwo' or 'admin'
  if (inputUser !== validUser && inputUser !== "admin") {
    return false;
  }

  const inputHash = await sha256(password);
  const targetHash = settings.adminPasswordHash || "45c2ce93a130c5b8ad910ba3562858c3f42c946986ea14755dd357753c914e6c";
  return inputHash === targetHash;
}

/**
 * 14D. Change Admin Password
 */
export async function changeAdminPassword(newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  const newHash = await sha256(newPassword);
  await saveStudioSettings({ adminPasswordHash: newHash });
  return true;
}

/**
 * 15. Admin Authentication
 */
export async function adminSignIn(email, password) {
  if (email && password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }
  // Anonymous studio manager fallback session
  return await signInAnonymously(auth);
}

export async function adminSignOut() {
  return await signOut(auth);
}

export function onAdminAuthStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 16. Seed Initial Data
 */
export async function seedInitialBackendData() {
  try {
    // Seed Settings
    const settingsSnap = await getDoc(doc(db, "settings", "studio"));
    if (!settingsSnap.exists()) {
      await setDoc(doc(db, "settings", "studio"), DEFAULT_STUDIO_SETTINGS);
      console.log("✓ Seeded default studio settings");
    }

    // Seed Artworks
    const artsSnap = await getDocs(collection(db, "artworks"));
    if (artsSnap.empty) {
      for (const item of DEFAULT_ARTWORKS) {
        await setDoc(doc(db, "artworks", item.id), item);
      }
      console.log("✓ Seeded 6 default portfolio artworks");
    }

    // Seed Journals
    const journalSnap = await getDocs(collection(db, "journals"));
    if (journalSnap.empty) {
      for (const post of DEFAULT_JOURNAL_POSTS) {
        await setDoc(doc(db, "journals", post.id), post);
      }
      console.log("✓ Seeded 3 default journal essays");
    }

    return true;
  } catch (err) {
    console.warn("Seed initial data note:", err);
    return false;
  }
}

