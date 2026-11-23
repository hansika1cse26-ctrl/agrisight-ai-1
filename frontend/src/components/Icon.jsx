import React from 'react';

const paths = {
  leaf: <><path d="M20 4c-9 0-16 5-16 13 0 4 3 7 7 7 9 0 12-11 9-20Z"/><path d="M4 22c4-7 9-11 15-15"/></>,
  scan: <><path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><path d="M12 7c-2.9 2-4.5 4.3-3.7 7 .7 2.3 3.9 2.8 5.4 1.1 2.4-2.7 2.5-5.1 1.6-8.1-1.5.2-3.6 1.4-5.6 2.3Z"/></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  upload: <><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></>,
  check: <><path d="m5 12 5 5L20 7"/></>,
  alert: <><path d="m10.4 3.7-8.1 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.3l-8.1-14a2 2 0 0 0-3.2 0Z"/><path d="M12 9v4m0 4h.01"/></>,
  x: <><path d="M18 6 6 18M6 6l12 12"/></>,
  trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6M10 10v7m4-7v7"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  sparkle: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/></>,
  camera: <><path d="M4 7h3l2-3h6l2 3h3v13H4V7Z"/><circle cx="12" cy="13" r="3.5"/></>,
  back: <><path d="m14 6-6 6 6 6M8 12h13"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
  photo: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 16-5-5L5 21"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
};

export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.leaf}
    </svg>
  );
}
