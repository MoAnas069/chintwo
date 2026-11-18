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
  socialInstagram: "https://www.instagram.com/chintwo.com",
  socialX: "https://x.com/chintwo",
  socialLinkedIn: "https://www.linkedin.com/in/chintwosankeerthanam",
  updatedAt: new Date().toISOString()
};

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
      return { ...DEFAULT_STUDIO_SETTINGS, ...docSnap.data() };
    }
    return DEFAULT_STUDIO_SETTINGS;
  } catch (err) {
    console.warn("Using default studio settings:", err);
    return DEFAULT_STUDIO_SETTINGS;
  }
}

/**
 * 4. Real-time Studio Settings Listener
 */
export function onStudioSettingsChange(callback) {
  try {
    return onSnapshot(doc(db, "settings", "studio"), (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_STUDIO_SETTINGS, ...snap.data() });
      } else {
        callback(DEFAULT_STUDIO_SETTINGS);
      }
    }, (err) => {
      console.warn("Studio settings snapshot error:", err);
      callback(DEFAULT_STUDIO_SETTINGS);
    });
  } catch (err) {
    console.warn("onStudioSettingsChange error:", err);
    callback(DEFAULT_STUDIO_SETTINGS);
    return () => {};
  }
}

/**
 * 5. Save Studio Configuration
 */
export async function saveStudioSettings(newSettings) {
  const merged = {
    ...DEFAULT_STUDIO_SETTINGS,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, "settings", "studio"), merged, { merge: true });
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
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return DEFAULT_ARTWORKS;
  } catch (err) {
    console.warn("Using default artworks:", err);
    return DEFAULT_ARTWORKS;
  }
}

/**
 * 7. Real-time Artworks Listener
 */
export function onArtworksChange(callback) {
  try {
    const q = query(collection(db, "artworks"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        callback(DEFAULT_ARTWORKS);
      }
    }, (err) => {
      console.warn("Artworks snapshot error:", err);
      callback(DEFAULT_ARTWORKS);
    });
  } catch (err) {
    callback(DEFAULT_ARTWORKS);
    return () => {};
  }
}

/**
 * 8. Save or Update Artwork
 */
export async function saveArtwork(artworkId, data) {
  const docId = artworkId || data.slug || `work-${Date.now()}`;
  await setDoc(doc(db, "artworks", docId), {
    ...data,
    id: docId,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return docId;
}

/**
 * 9. Delete Artwork
 */
export async function deleteArtwork(artworkId) {
  await deleteDoc(doc(db, "artworks", artworkId));
  return true;
}

/**
 * 10. Get All Collector Inquiries (Admin)
 */
export async function getInquiries() {
  try {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // If order by createdAt fails on empty, try plain collection
    const snap = await getDocs(collection(db, "inquiries"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

/**
 * 11. Update Inquiry Status (Admin)
 */
export async function updateInquiryStatus(inquiryId, status) {
  await updateDoc(doc(db, "inquiries", inquiryId), {
    status,
    statusUpdatedAt: serverTimestamp()
  });
  return true;
}

/**
 * 12. Delete Inquiry (Admin)
 */
export async function deleteInquiry(inquiryId) {
  await deleteDoc(doc(db, "inquiries", inquiryId));
  return true;
}

/**
 * 13. Get All Newsletter Subscribers (Admin)
 */
export async function getSubscribers() {
  const snap = await getDocs(collection(db, "subscribers"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * 14. Delete Subscriber (Admin)
 */
export async function deleteSubscriber(subscriberId) {
  await deleteDoc(doc(db, "subscribers", subscriberId));
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

    return true;
  } catch (err) {
    console.warn("Seed initial data note:", err);
    return false;
  }
}

