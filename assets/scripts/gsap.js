/**
 * GSAP ES Module Wrapper for Chintwo Portfolio
 * Provides standard module export from window.gsap
 */
const gsapInstance = (typeof window !== 'undefined' && window.gsap) 
  ? window.gsap 
  : (typeof globalThis !== 'undefined' ? globalThis.gsap : null);

export const gsap = gsapInstance;
export default gsapInstance;
