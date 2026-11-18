import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Droplets,
  Gauge,
  Maximize2,
  Minimize2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Wind,
  X,
} from 'lucide-react';
import {
  formatDigits,
  getGregorianInfo,
  toKurdishDate,
} from '../utils/kurdishCalendar';
import { AlertSeverity, WeatherData } from '../utils/weatherService';
import { getLunarPhase } from '../utils/lunarPhase';
import {
  GalaxyAiIcon,
  LunarPhaseIcon,
  OneUiCalendarIcon,
  OneUiCameraIcon,
  OneUiGalleryIcon,
  OneUiGalaxyStoreIcon,
  OneUiPhoneIcon,
  OneUiWeatherIcon,
  SPenIcon,
  StatusBarIcons,
  UltrasonicFingerprintIcon,
} from './GalaxyIcons';

export type ScreensaverMode = 'wallpaper' | 'aod';
export type TitaniumFinish = 'silverblue' | 'black' | 'gray' | 'whitesilver';
export type ClockStyle = 'stacked' | 'horizon' | 'editorial';

interface S25UltraScreensaverProps {
  now: Date;
  mode: ScreensaverMode;
  titaniumFinish: TitaniumFinish;
  clockStyle: ClockStyle;
  use24Hour: boolean;
  showSeconds: boolean;
  useKurdishDigits: boolean;
  photoUrl: string;
  batteryLevel: number;
  isCharging: boolean;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  onRefreshWeather: () => void;
  onOpenCalendar: () => void;
  onToggleMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const TITANIUM_STYLES: Record<
  TitaniumFinish,
  { bezel: string; rail: string; button: string; label: string }
> = {
  silverblue: {
    bezel: 'from-[#8fa5bc] via-[#5d7187] to-[#7c92a9]',
    rail: 'ring-[#a6bad0]/40',
    button: 'bg-[#7d92a8]',
    label: 'تیتانیۆمی شینی زیوی',
  },
  black: {
    bezel: 'from-[#35383f] via-[#1c1e22] to-[#2e3138]',
    rail: 'ring-white/15',
    button: 'bg-[#2a2d33]',
    label: 'تیتانیۆمی ڕەش',
  },
  gray: {
    bezel: 'from-[#8a8883] via-[#5c5a55] to-[#7b7974]',
    rail: 'ring-[#b3b0aa]/30',
    button: 'bg-[#75736e]',
    label: 'تیتانیۆمی خۆڵەمێشی',
  },
  whitesilver: {
    bezel: 'from-[#d8dce2] via-[#aeb5bf] to-[#cfd4dc]',
    rail: 'ring-white/60',
    button: 'bg-[#c5cbd3]',
    label: 'تیتانیۆمی سپی زیوی',
  },
};

export function S25UltraScreensaver({
  now,
  mode,
  titaniumFinish,
  clockStyle,
  use24Hour,
  showSeconds,
  useKurdishDigits,
  photoUrl,
  batteryLevel,
  isCharging,
  weather,
  weatherLoading,
  weatherError,
  onRefreshWeather,
  onOpenCalendar,
  onToggleMode,
  isFullscreen,
  onToggleFullscreen,
}: S25UltraScreensaverProps) {
  const [imgError, setImgError] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [fingerprintPulse, setFingerprintPulse] = useState(false);
  const [alertExpanded, setAlertExpanded] = useState(false);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  useEffect(() => {
    setDismissedAlertIds([]);
    setAlertExpanded(false);
  }, [weather?.cityEn]);

  const activeAlerts = (weather?.alerts ?? []).filter(
    (a) => !dismissedAlertIds.includes(a.id)
  );
  const primaryAlert = activeAlerts[0];

  const getAlertStyle = (severity: AlertSeverity) => {
    if (severity === 'extreme') {
      return {
        container: 'bg-rose-500/18 border-rose-400/45 text-rose-100',
        badge: 'text-rose-200',
        label: 'ئاگاداریی زۆر توند',
      };
    }
    if (severity === 'severe') {
      return {
        container: 'bg-amber-500/18 border-amber-400/45 text-amber-100',
        badge: 'text-amber-200',
        label: 'هۆشداریی توند',
      };
    }
    return {
      container: 'bg-sky-500/16 border-sky-400/40 text-sky-100',
      badge: 'text-sky-200',
      label: 'ئاگادارکردنەوە',
    };
  };

  const kurdish = toKurdishDate(now);
  const gregorian = getGregorianInfo(now);
  const lunar = getLunarPhase(now);

  let hoursNum = now.getHours();
  const isPm = hoursNum >= 12;
  if (!use24Hour) {
    hoursNum = hoursNum % 12 || 12;
  }
  const hoursStr = formatDigits(String(hoursNum).padStart(2, '0'), useKurdishDigits);
  const minutesStr = formatDigits(String(now.getMinutes()).padStart(2, '0'), useKurdishDigits);
  const secondsStr = formatDigits(String(now.getSeconds()).padStart(2, '0'), useKurdishDigits);
  const amPmKu = isPm ? 'د.ن' : 'پ.ن';

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    window.setTimeout(() => {
      setActiveToast((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const handleFingerprintTap = () => {
    setFingerprintPulse(true);
    triggerToast('بەخێربێیت سان · Galaxy S25 Ultra ئامادەیە');
    window.setTimeout(() => setFingerprintPulse(false), 650);
  };

  const finish = TITANIUM_STYLES[titaniumFinish];

  // Screen content shared between framed S25 Ultra view and true fullscreen OLED view
  const screenContent = (
    <div
      className={`relative w-full h-full overflow-hidden flex flex-col justify-between select-none ${
        mode === 'aod' ? 'bg-black' : 'bg-[#080b12]'
      }`}
    >
      {/* Background Layer */}
      {mode === 'wallpaper' && !imgError ? (
        <>
          <img
            src={photoUrl}
            alt="وێنەی سان"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-[center_24%] transition-transform duration-700"
          />
          {/* Measured gradient scrim for WCAG AA contrast on clock, calendar & weather */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/92 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-[at_50%_42%] from-transparent via-black/15 to-black/60 pointer-events-none" />
        </>
      ) : mode === 'wallpaper' && imgError ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#131d33] to-[#05070b]" />
      ) : (
        /* Deep Pure AMOLED Black for Always-On Display */
        <div className="absolute inset-0 bg-black pointer-events-none" />
      )}

      {/* Top Infinity-O Punch-Hole Camera & One UI 7 Status Bar */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-3 pb-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
          <span>سان</span>
          <span className="text-white/40" aria-hidden="true">·</span>
          <span className="font-clock text-[10px] tracking-wide text-sky-300/90">S25 Ultra</span>
        </div>

        {/* Center Infinity-O Selfie Camera */}
        {!isFullscreen && (
          <div
            className="w-3 h-3 rounded-full bg-black ring-1 ring-white/15 shadow-inner shrink-0"
            aria-hidden="true"
          />
        )}

        <div className="flex items-center gap-2">
          <StatusBarIcons batteryLevel={batteryLevel} />
          {isFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="دەرچوون لە پڕشاشە"
              title="دەرچوون لە پڕشاشە"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Container (applies subtle OLED shift in AOD mode) */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-between px-5 pt-2 pb-3 ${
          mode === 'aod' ? 'animate-aod-shift' : ''
        }`}
      >
        {/* Top Zone: San Signature + Live Clock + Dual Kurdish & Gregorian Date */}
        <div className="flex flex-col items-center text-center">
          {/* San Signature & Galaxy AI Emblem */}
          <div className="flex items-center gap-2 text-xs text-sky-200/90 mb-1">
            <GalaxyAiIcon className="w-4 h-4" />
            <span className="font-bold text-sm tracking-normal text-white">سان</span>
            <span className="text-white/35" aria-hidden="true">·</span>
            <span className="font-clock text-[11px] text-slate-300">Galaxy S25 Ultra</span>
          </div>

          {/* One UI 7 Clock Styles */}
          {clockStyle === 'stacked' && (
            <div className="flex flex-col items-center leading-none my-1" dir="ltr">
              <div className="flex items-baseline gap-2">
                <span className="font-clock text-[3.5rem] sm:text-[3.85rem] font-semibold tracking-tight text-white leading-[0.92]">
                  {hoursStr}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-clock text-[3.5rem] sm:text-[3.85rem] font-light tracking-tight text-sky-200 leading-[0.92]">
                  {minutesStr}
                </span>
                {showSeconds && (
                  <span className="font-clock text-sm font-medium text-sky-300/90 tabular-nums">
                    {secondsStr}
                  </span>
                )}
                {!use24Hour && (
                  <span className="font-kurdish text-xs font-medium text-white/75 ml-1">
                    {amPmKu}
                  </span>
                )}
              </div>
            </div>
          )}

          {clockStyle === 'horizon' && (
            <div className="flex items-baseline justify-center gap-1 my-2" dir="ltr">
              <span className="font-clock text-[3.4rem] sm:text-[3.75rem] font-bold tracking-tight text-white leading-none">
                {hoursStr}
              </span>
              <span className="font-clock text-[3.2rem] font-light text-sky-400 leading-none">:</span>
              <span className="font-clock text-[3.4rem] sm:text-[3.75rem] font-bold tracking-tight text-white leading-none">
                {minutesStr}
              </span>
              {showSeconds && (
                <span className="font-clock text-base font-medium text-sky-300/90 ml-1">
                  :{secondsStr}
                </span>
              )}
              {!use24Hour && (
                <span className="font-kurdish text-xs text-white/75 ml-1.5">{amPmKu}</span>
              )}
            </div>
          )}

          {clockStyle === 'editorial' && (
            <div className="flex items-baseline justify-center gap-1.5 my-2" dir="ltr">
              <span className="font-clock text-[3.6rem] font-extralight tracking-tighter text-white/95 leading-none">
                {hoursStr}
              </span>
              <span className="font-clock text-[2.6rem] font-thin text-white/50 leading-none">:</span>
              <span className="font-clock text-[3.6rem] font-semibold tracking-tighter text-sky-300 leading-none">
                {minutesStr}
              </span>
              {showSeconds && (
                <span className="font-clock text-sm font-normal text-white/75 ml-1">
                  {secondsStr}
                </span>
              )}
              {!use24Hour && (
                <span className="font-kurdish text-xs text-white/75 ml-1">{amPmKu}</span>
              )}
            </div>
          )}

          {/* Dual Calendar Readout (Kurdish + Gregorian) */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="group mt-1 px-3 py-1.5 rounded-2xl hover:bg-white/10 transition-colors text-center"
            title="کردنەوەی ڕۆژمێری تەواو"
          >
            <div className="text-[13px] font-semibold text-white group-hover:text-sky-300 transition-colors">
              {kurdish.weekdayName}، {formatDigits(kurdish.day, useKurdishDigits)}ی{' '}
              {kurdish.monthName} {formatDigits(kurdish.year, useKurdishDigits)} کوردی
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300/90 mt-0.5">
              <span>
                {formatDigits(gregorian.day, useKurdishDigits)}ی {gregorian.monthNameKurdish}{' '}
                {formatDigits(gregorian.year, useKurdishDigits)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-clock" dir="ltr">
                {gregorian.monthNameShortEn} {gregorian.day}, {gregorian.year}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-300/90">{kurdish.seasonName}</span>
            </div>
          </button>
        </div>

        {/* Middle Zone: Framed Portrait in AOD mode OR Transparent Window over San's Photo in Wallpaper mode */}
        {mode === 'aod' ? (
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-32 h-32 oneui-squircle p-[2px] bg-gradient-to-br from-sky-400/70 via-slate-400/30 to-indigo-500/60 shadow-2xl shadow-sky-950/50">
              <div className="w-full h-full oneui-squircle overflow-hidden bg-slate-900 flex items-center justify-center">
                {!imgError ? (
                  <img
                    src={photoUrl}
                    alt="وێنەی سان"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">سان</span>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>{kurdish.seasonName}</span>
              <span aria-hidden="true">·</span>
              <span>ساڵی کوردی {formatDigits(kurdish.year, useKurdishDigits)}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-[115px]" />
        )}

        {/* Toast feedback when tapping Galaxy icons */}
        {activeToast && (
          <div className="mx-auto mb-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-sky-400/30 text-[11px] font-medium text-sky-100 shadow-lg backdrop-blur-md text-center">
            {activeToast}
          </div>
        )}

        {/* Bottom Zone: Weather Card + Special Galaxy S25 Ultra Icons + Now Bar */}
        <div className="flex flex-col gap-2.5">
          {/* Live Weather & Temperature Strip */}
          <div
            className={`rounded-2xl px-3.5 py-2.5 border transition-colors ${
              mode === 'aod'
                ? 'bg-white/[0.04] border-white/10'
                : 'bg-black/50 backdrop-blur-md border-white/12'
            }`}
          >
            {weatherLoading && !weather ? (
              <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                <span>وەرگرتنی کەشوهەوای ڕاستەوخۆ...</span>
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              </div>
            ) : weatherError && !weather ? (
              <div className="flex items-center justify-between text-xs text-rose-300 py-1">
                <span>{weatherError}</span>
                <button
                  type="button"
                  onClick={onRefreshWeather}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px]"
                >
                  هەوڵدانەوە
                </button>
              </div>
            ) : weather ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <OneUiWeatherIcon kind={weather.kind} className="w-9 h-9 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{weather.cityKu}</span>
                        <span className="text-white/35 text-xs" aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-200">{weather.conditionKu}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300/90 mt-0.5 flex-wrap">
                        <span>
                          بەرز {formatDigits(weather.tempMax, useKurdishDigits)}° / نزم{' '}
                          {formatDigits(weather.tempMin, useKurdishDigits)}°
                        </span>
                        <span className="text-white/30" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-amber-200/90">
                          <LunarPhaseIcon phase={lunar.kind} className="w-3.5 h-3.5 shrink-0" />
                          <span>{lunar.labelKu}</span>
                          <span className="font-clock text-slate-300/85 tabular-nums" dir="ltr">
                            ({formatDigits(lunar.illumination, useKurdishDigits)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-clock text-2xl font-bold text-white tabular-nums leading-none"
                      dir="ltr"
                    >
                      {formatDigits(weather.temperature, useKurdishDigits)}°
                    </span>
                    <button
                      type="button"
                      onClick={onRefreshWeather}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="نوێکردنەوەی کەشوهەوا"
                      title="نوێکردنەوەی کەشوهەوا"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Secondary Weather Summary Metrics */}
                <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-white/10 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                      <Droplets className="w-2.5 h-2.5 text-sky-400" />
                      <span>شێ</span>
                    </span>
                    <span className="font-clock text-[11px] font-semibold text-white tabular-nums" dir="ltr">
                      {formatDigits(weather.humidity, useKurdishDigits)}%
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                      <Wind className="w-2.5 h-2.5 text-slate-300" />
                      <span>با</span>
                    </span>
                    <span className="font-clock text-[11px] font-semibold text-white tabular-nums" dir="ltr">
                      {formatDigits(weather.windSpeed, useKurdishDigits)} km/h
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                      <Thermometer className="w-2.5 h-2.5 text-amber-300" />
                      <span>هەستپێکراو</span>
                    </span>
                    <span className="font-clock text-[11px] font-semibold text-white tabular-nums" dir="ltr">
                      {formatDigits(weather.feelsLike, useKurdishDigits)}°
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                      <Gauge className="w-2.5 h-2.5 text-indigo-300" />
                      <span>پەستان</span>
                    </span>
                    <span className="font-clock text-[11px] font-semibold text-white tabular-nums" dir="ltr">
                      {formatDigits(weather.pressureHpa, useKurdishDigits)} hPa
                    </span>
                  </div>
                </div>

                {/* Severe Weather Alert Notification inside Weather Module */}
                {primaryAlert && (
                  <div
                    className={`rounded-xl border px-2.5 py-2 transition-colors ${
                      getAlertStyle(primaryAlert.severity).container
                    }`}
                    role="alert"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setAlertExpanded((v) => !v)}
                        className="flex-1 min-w-0 flex items-center gap-2 text-right"
                        aria-expanded={alertExpanded}
                      >
                        {primaryAlert.severity === 'moderate' ? (
                          <AlertTriangle
                            className={`w-4 h-4 shrink-0 ${
                              getAlertStyle(primaryAlert.severity).badge
                            }`}
                          />
                        ) : (
                          <ShieldAlert
                            className={`w-4 h-4 shrink-0 ${
                              getAlertStyle(primaryAlert.severity).badge
                            }`}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold leading-tight">
                            <span>{getAlertStyle(primaryAlert.severity).label}</span>
                            {activeAlerts.length > 1 && (
                              <span className="opacity-85">
                                · +{formatDigits(activeAlerts.length - 1, useKurdishDigits)}
                              </span>
                            )}
                            {primaryAlert.metricLabel && (
                              <span className="font-clock opacity-85" dir="ltr">
                                · {formatDigits(primaryAlert.metricLabel, useKurdishDigits)}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-medium truncate mt-0.5">
                            {primaryAlert.titleKu}
                          </div>
                        </div>
                        {alertExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDismissedAlertIds((prev) => [...prev, primaryAlert.id])
                        }
                        className="p-1 rounded-lg hover:bg-white/15 transition-colors shrink-0"
                        aria-label="لابردنی ئاگادارکردنەوە"
                        title="لابردن"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {alertExpanded && (
                      <div className="mt-2 pt-2 border-t border-white/15 flex flex-col gap-2 max-h-[105px] overflow-y-auto">
                        {activeAlerts.map((alert) => {
                          const style = getAlertStyle(alert.severity);
                          return (
                            <div
                              key={alert.id}
                              className="flex items-start justify-between gap-2 text-[10px] leading-relaxed"
                            >
                              <div className="min-w-0">
                                <div className={`font-bold ${style.badge}`}>
                                  {style.label} · {alert.titleKu}
                                </div>
                                <p className="text-white/90 mt-0.5">{alert.descriptionKu}</p>
                                <div className="text-white/65 mt-0.5 flex items-center gap-1.5">
                                  <span>{alert.source}</span>
                                  {alert.expiresAt && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-clock" dir="ltr">
                                        {formatDigits(alert.expiresAt, useKurdishDigits)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {activeAlerts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDismissedAlertIds((prev) => [...prev, alert.id])
                                  }
                                  className="p-1 rounded hover:bg-white/15 shrink-0"
                                  aria-label="لابردنی ئاگادارکردنەوە"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Mini Hourly Strip */}
                {weather.hourly.length > 0 && (
                  <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-white/10 text-center">
                    {weather.hourly.map((h) => (
                      <div key={h.timeLabel} className="flex flex-col items-center gap-0.5">
                        <span className="font-clock text-[9px] text-slate-400 tabular-nums" dir="ltr">
                          {formatDigits(h.timeLabel, useKurdishDigits)}
                        </span>
                        <OneUiWeatherIcon kind={h.kind} className="w-4 h-4" />
                        <span className="font-clock text-[10px] font-semibold text-slate-100 tabular-nums" dir="ltr">
                          {formatDigits(h.temp, useKurdishDigits)}°
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Special Galaxy S25 Ultra Icons Row */}
          <div className="flex items-center justify-between px-2 py-1">
            <button
              type="button"
              onClick={onOpenCalendar}
              className="flex flex-col items-center gap-1 group"
              aria-label="ڕۆژمێری کوردی"
            >
              <OneUiCalendarIcon
                dayNumber={formatDigits(kurdish.day, useKurdishDigits)}
                className="w-10 h-10 group-hover:scale-105 transition-transform"
              />
              <span className="text-[10px] text-slate-200 font-medium">ڕۆژمێر</span>
            </button>

            <button
              type="button"
              onClick={onToggleMode}
              className="flex flex-col items-center gap-1 group"
              aria-label="شێوازی وێنەی سان"
            >
              <OneUiGalleryIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] text-slate-200 font-medium">وێنە</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerToast(
                  `S Pen بۆ سان · ئەمڕۆ ${formatDigits(kurdish.day, useKurdishDigits)}ی ${kurdish.monthName}`
                )
              }
              className="flex flex-col items-center gap-1 group"
              aria-label="قەڵەمی S Pen"
            >
              <div className="w-10 h-10 oneui-squircle bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20 flex items-center justify-center text-sky-300 shadow-lg group-hover:scale-105 transition-transform">
                <SPenIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-200 font-medium font-clock">S Pen</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerToast('Galaxy AI · سکرین سەیڤەری تایبەت بۆ سان')
              }
              className="flex flex-col items-center gap-1 group"
              aria-label="Galaxy AI"
            >
              <OneUiGalaxyStoreIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] text-slate-200 font-medium font-clock">Galaxy AI</span>
            </button>
          </div>

          {/* Ultrasonic Fingerprint + One UI 7 Now Bar + Quick Corner Shortcuts */}
          <div className="flex flex-col items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleFingerprintTap}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                fingerprintPulse
                  ? 'bg-sky-400/30 text-sky-200 scale-110 ring-2 ring-sky-400/60'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
              aria-label="پەنجەمۆری ئۆڵتراسۆنیک"
              title="پەنجەمۆری گالاکسی S25 Ultra"
            >
              <UltrasonicFingerprintIcon className="w-7 h-7" />
            </button>

            <div className="w-full flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => triggerToast('تەلەفۆنی گالاکسی · پەیوەندی خێرا')}
                className="hover:scale-105 transition-transform"
                aria-label="تەلەفۆن"
              >
                <OneUiPhoneIcon className="w-9 h-9" />
              </button>

              {/* One UI 7 Signature Now Bar */}
              <button
                type="button"
                onClick={onOpenCalendar}
                className="flex-1 max-w-[210px] h-9 px-3 rounded-full bg-white/12 hover:bg-white/18 backdrop-blur-md border border-white/15 flex items-center justify-center gap-2 text-[11px] font-medium text-white transition-colors truncate"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span className="truncate">
                  سان · {formatDigits(batteryLevel, useKurdishDigits)}%
                  {isCharging ? ' بارگاوی' : ''} · {weather ? `${formatDigits(weather.temperature, useKurdishDigits)}°` : 'S25 Ultra'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerToast(`کامێرای ${formatDigits(200, useKurdishDigits)} مێگاپیکسڵی S25 Ultra`)
                }
                className="hover:scale-105 transition-transform"
                aria-label="کامێرا"
              >
                <OneUiCameraIcon className="w-9 h-9" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-[460px] mx-auto relative">
          {screenContent}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle Ambient Titanium Glow behind S25 Ultra */}
      <div
        className="absolute -inset-6 rounded-[64px] bg-gradient-to-br from-sky-500/12 via-transparent to-indigo-500/12 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Samsung Galaxy S25 Ultra Hardware Chassis */}
      <div className="relative">
        {/* Side Hardware Buttons (Volume & Power on right titanium rail) */}
        <div
          className={`hidden sm:block absolute -right-[4px] top-28 w-[4px] h-14 rounded-r-sm ${finish.button}`}
          aria-hidden="true"
        />
        <div
          className={`hidden sm:block absolute -right-[4px] top-48 w-[4px] h-9 rounded-r-sm ${finish.button}`}
          aria-hidden="true"
        />

        {/* Titanium Outer Bezel */}
        <div
          className={`relative w-[348px] sm:w-[376px] h-[724px] sm:h-[768px] rounded-[42px] p-[5px] bg-gradient-to-br ${finish.bezel} ring-1 ${finish.rail} shadow-[0_28px_80px_-15px_rgba(0,0,0,0.85)]`}
        >
          {/* Inner Ultra-thin Black AMOLED Bezel */}
          <div className="w-full h-full rounded-[37px] bg-black p-[5px] overflow-hidden">
            {/* Dynamic AMOLED 2X Display */}
            <div className="w-full h-full rounded-[33px] overflow-hidden relative">
              {screenContent}
            </div>
          </div>
        </div>

        {/* Fullscreen Launch Shortcut under device on desktop */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span>Samsung Galaxy S25 Ultra</span>
          <span aria-hidden="true">·</span>
          <span>{finish.label}</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>پڕشاشە</span>
          </button>
        </div>
      </div>
    </div>
  );
}
