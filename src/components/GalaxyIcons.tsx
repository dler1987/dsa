import React from 'react';
import { WeatherKind } from '../utils/weatherService';
import { LunarPhaseKind } from '../utils/lunarPhase';

/**
 * Galaxy AI signature 4-point star emblem
 */
export function GalaxyAiIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="galaxyAiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <path
        d="M11.5 2.5C11.8 7.3 14.7 10.2 19.5 10.5C14.7 10.8 11.8 13.7 11.5 18.5C11.2 13.7 8.3 10.8 3.5 10.5C8.3 10.2 11.2 7.3 11.5 2.5Z"
        fill="url(#galaxyAiGrad)"
      />
      <path
        d="M18.5 15.5C18.65 17.5 19.8 18.65 21.8 18.8C19.8 18.95 18.65 20.1 18.5 22.1C18.35 20.1 17.2 18.95 15.2 18.8C17.2 18.65 18.35 17.5 18.5 15.5Z"
        fill="url(#galaxyAiGrad)"
      />
    </svg>
  );
}

/**
 * Samsung Galaxy S25 Ultra S Pen icon
 */
export function SPenIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M18.6 3.4a2 2 0 0 1 2.83 2.83l-9.9 9.9-4.1 1.27 1.27-4.1 9.9-9.9Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8 6.2l2.8 2.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4 20.5h7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * One UI 7 Ultrasonic In-Display Fingerprint icon
 */
export function UltrasonicFingerprintIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 4.5C9.5 4.5 6 7.9 6 12.4v2.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18.8 5.9A8.2 8.2 0 0 1 22 12.4v3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.8 17.8V12.5a5.2 5.2 0 0 1 10.4 0v4.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.6 19.8v-7.3a2.4 2.4 0 0 1 4.8 0v6.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 12.5v9.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.4 17.8c.2 2.4 1 4.2 2.4 5.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21.2 18.8c-.4 1.8-1.2 3.2-2.4 4.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Samsung One UI 7 Multi-tone Weather Icons
 */
export function OneUiWeatherIcon({
  kind,
  className = 'w-8 h-8',
}: {
  kind: WeatherKind;
  className?: string;
}) {
  switch (kind) {
    case 'sunny':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <defs>
            <radialGradient id="oneUiSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
          </defs>
          <circle cx="18" cy="18" r="8.5" fill="url(#oneUiSun)" />
          <g stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="3.5" x2="18" y2="6.2" />
            <line x1="18" y1="29.8" x2="18" y2="32.5" />
            <line x1="3.5" y1="18" x2="6.2" y2="18" />
            <line x1="29.8" y1="18" x2="32.5" y2="18" />
            <line x1="7.7" y1="7.7" x2="9.7" y2="9.7" />
            <line x1="26.3" y1="26.3" x2="28.3" y2="28.3" />
            <line x1="28.3" y1="7.7" x2="26.3" y2="9.7" />
            <line x1="9.7" y1="26.3" x2="7.7" y2="28.3" />
          </g>
        </svg>
      );
    case 'clear-night':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="oneUiMoon" x1="8" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          <path
            d="M24.8 22.8A10.2 10.2 0 0 1 13.2 11.2a10.2 10.2 0 0 1 1-4.4A10.5 10.5 0 1 0 29.2 21.8a10.2 10.2 0 0 1-4.4 1Z"
            fill="url(#oneUiMoon)"
          />
          <circle cx="26" cy="9" r="1.4" fill="#E0F2FE" />
          <circle cx="29.5" cy="13.5" r="0.9" fill="#BAE6FD" />
        </svg>
      );
    case 'partly-cloudy':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <circle cx="13.5" cy="13.5" r="6.5" fill="#FBBF24" />
          <path
            d="M11 27.5h15.2a5.3 5.3 0 0 0 .8-10.5 7 7 0 0 0-13.5-1.5A5.5 5.5 0 0 0 11 27.5Z"
            fill="#F1F5F9"
            fillOpacity="0.95"
          />
        </svg>
      );
    case 'rain':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <path
            d="M10 22.5h16a5 5 0 0 0 .7-9.95 6.8 6.8 0 0 0-13.1-1.45A5.2 5.2 0 0 0 10 22.5Z"
            fill="#CBD5E1"
          />
          <g stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12.5" y1="26" x2="11" y2="30" />
            <line x1="18.5" y1="26" x2="17" y2="30" />
            <line x1="24.5" y1="26" x2="23" y2="30" />
          </g>
        </svg>
      );
    case 'storm':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <path
            d="M10 22h16a5 5 0 0 0 .7-9.95 6.8 6.8 0 0 0-13.1-1.45A5.2 5.2 0 0 0 10 22Z"
            fill="#94A3B8"
          />
          <path
            d="M19 22l-3 5h3.5l-2 5.5 5.5-7h-3.5L21 22h-2Z"
            fill="#FACC15"
          />
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <path
            d="M10 22h16a5 5 0 0 0 .7-9.95 6.8 6.8 0 0 0-13.1-1.45A5.2 5.2 0 0 0 10 22Z"
            fill="#E2E8F0"
          />
          <circle cx="13" cy="27" r="1.6" fill="#BAE6FD" />
          <circle cx="18.5" cy="29" r="1.6" fill="#E0F2FE" />
          <circle cx="24" cy="27" r="1.6" fill="#BAE6FD" />
        </svg>
      );
    case 'fog':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <path
            d="M10 20h16a4.8 4.8 0 0 0 .7-9.5 6.4 6.4 0 0 0-12.4-1.4A4.9 4.9 0 0 0 10 20Z"
            fill="#CBD5E1"
          />
          <g stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round">
            <line x1="8" y1="24.5" x2="28" y2="24.5" />
            <line x1="11" y1="28.5" x2="25" y2="28.5" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <path
            d="M9.5 25.5h17a5.5 5.5 0 0 0 .8-10.9 7.3 7.3 0 0 0-14.1-1.6A5.6 5.6 0 0 0 9.5 25.5Z"
            fill="#E2E8F0"
          />
        </svg>
      );
  }
}

/**
 * Samsung One UI 7 Squircle App Icons (Phone, Camera, Gallery, Calendar, Galaxy AI)
 */
export function OneUiPhoneIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`oneui-squircle bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 ${className}`}>
      <svg viewBox="0 0 24 24" fill="white" className="w-[54%] h-[54%]" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
      </svg>
    </div>
  );
}

export function OneUiCameraIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`oneui-squircle bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-950/40 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-[58%] h-[58%]" aria-hidden="true">
        <path
          d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.6A1.5 1.5 0 0 1 10.9 4h2.2a1.5 1.5 0 0 1 1.2.4L15.5 6h2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
          fill="white"
        />
        <circle cx="12" cy="12.5" r="3.4" fill="#E11D48" />
        <circle cx="12" cy="12.5" r="1.6" fill="white" fillOpacity="0.85" />
      </svg>
    </div>
  );
}

export function OneUiGalleryIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`oneui-squircle bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-950/40 ${className}`}>
      <svg viewBox="0 0 24 24" fill="white" className="w-[58%] h-[58%]" aria-hidden="true">
        <circle cx="12" cy="7.2" r="2.6" />
        <circle cx="16.6" cy="10.4" r="2.6" fillOpacity="0.92" />
        <circle cx="14.8" cy="15.8" r="2.6" fillOpacity="0.88" />
        <circle cx="9.2" cy="15.8" r="2.6" fillOpacity="0.88" />
        <circle cx="7.4" cy="10.4" r="2.6" fillOpacity="0.92" />
        <circle cx="12" cy="12" r="1.8" fill="#FB7185" />
      </svg>
    </div>
  );
}

export function OneUiCalendarIcon({
  dayNumber,
  className = 'w-10 h-10',
}: {
  dayNumber: string;
  className?: string;
}) {
  return (
    <div className={`oneui-squircle bg-white text-slate-900 flex flex-col items-center justify-center shadow-lg shadow-black/40 overflow-hidden ${className}`}>
      <div className="w-full h-[26%] bg-sky-600" />
      <div className="flex-1 flex items-center justify-center font-clock font-bold text-[0.95em] leading-none text-slate-900 pb-0.5">
        {dayNumber}
      </div>
    </div>
  );
}

export function OneUiGalaxyStoreIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`oneui-squircle bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-950/40 ${className}`}>
      <GalaxyAiIcon className="w-[58%] h-[58%] brightness-150" />
    </div>
  );
}

/**
 * S25 Ultra Status Bar Signal + 5G + Wi-Fi + Battery
 */
export function StatusBarIcons({ batteryLevel }: { batteryLevel: number }) {
  return (
    <div className="flex items-center gap-1.5 text-white/90" dir="ltr">
      {/* Wi-Fi */}
      <svg viewBox="0 0 16 14" fill="currentColor" className="w-3.5 h-3" aria-hidden="true">
        <path d="M8 11.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm-3.1-2a4.6 4.6 0 0 1 6.2 0l-1 1.1a3.1 3.1 0 0 0-4.2 0l-1-1.1Zm-2.5-2.6a8.2 8.2 0 0 1 11.2 0l-1 1.1a6.7 6.7 0 0 0-9.2 0l-1-1.1ZM0 4a11.7 11.7 0 0 1 16 0l-1 1.1a10.2 10.2 0 0 0-14 0L0 4Z" />
      </svg>
      {/* 5G badge text */}
      <span className="font-clock text-[10px] font-semibold tracking-tight leading-none">5G</span>
      {/* Cellular Bars */}
      <svg viewBox="0 0 14 12" fill="currentColor" className="w-3 h-2.5" aria-hidden="true">
        <rect x="0.5" y="8" width="2" height="3.5" rx="0.6" />
        <rect x="4" y="5.8" width="2" height="5.7" rx="0.6" />
        <rect x="7.5" y="3.5" width="2" height="8" rx="0.6" />
        <rect x="11" y="1" width="2" height="10.5" rx="0.6" />
      </svg>
      {/* One UI 7 Pill Battery */}
      <div className="flex items-center gap-1">
        <div className="relative flex items-center justify-center px-1.5 h-[14px] min-w-[24px] rounded-full bg-white/25 border border-white/30 text-[9px] font-clock font-bold text-white leading-none tabular-nums">
          {batteryLevel}
        </div>
      </div>
    </div>
  );
}

/**
 * Small Lunar Phase SVG Icon representing each of the 8 lunar phases
 */
export function LunarPhaseIcon({
  phase,
  className = 'w-3.5 h-3.5',
}: {
  phase: LunarPhaseKind;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
      {phase === 'full-moon' && (
        <circle cx="10" cy="10" r="7.2" fill="#FDE68A" />
      )}
      {phase === 'first-quarter' && (
        <path d="M10 2.8A7.2 7.2 0 0 1 10 17.2Z" fill="#FDE68A" />
      )}
      {phase === 'last-quarter' && (
        <path d="M10 2.8A7.2 7.2 0 0 0 10 17.2Z" fill="#FDE68A" />
      )}
      {phase === 'waxing-crescent' && (
        <path d="M10 2.8A7.2 7.2 0 0 1 10 17.2A4.4 7.2 0 0 0 10 2.8Z" fill="#FDE68A" />
      )}
      {phase === 'waning-crescent' && (
        <path d="M10 2.8A7.2 7.2 0 0 0 10 17.2A4.4 7.2 0 0 1 10 2.8Z" fill="#FDE68A" />
      )}
      {phase === 'waxing-gibbous' && (
        <path d="M10 2.8A7.2 7.2 0 0 1 10 17.2A4.2 7.2 0 0 1 10 2.8Z" fill="#FDE68A" />
      )}
      {phase === 'waning-gibbous' && (
        <path d="M10 2.8A7.2 7.2 0 0 0 10 17.2A4.2 7.2 0 0 0 10 2.8Z" fill="#FDE68A" />
      )}
    </svg>
  );
}
