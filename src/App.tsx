import React, { useCallback, useEffect, useState } from 'react';
import { SlidersHorizontal, Maximize2, X } from 'lucide-react';
import {
  ClockStyle,
  S25UltraScreensaver,
  ScreensaverMode,
  TitaniumFinish,
} from './components/S25UltraScreensaver';
import { ControlStudio } from './components/ControlStudio';
import { DualCalendarModal } from './components/DualCalendarModal';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import {
  CityPreset,
  fetchWeatherForCoords,
  isDaylightNow,
  KURDISTAN_CITIES,
  WeatherData,
} from './utils/weatherService';

const DEFAULT_SAN_PHOTO = '/assets/aistudio/20261114_195309_9385aefd.jpg';

interface BatteryManagerLike extends EventTarget {
  level: number;
  charging: boolean;
}

export default function App() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [mode, setMode] = useState<ScreensaverMode>('wallpaper');
  const [titaniumFinish, setTitaniumFinish] = useState<TitaniumFinish>('silverblue');
  const [clockStyle, setClockStyle] = useState<ClockStyle>('stacked');
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [useKurdishDigits, setUseKurdishDigits] = useState<boolean>(false);
  const [autoTheme, setAutoTheme] = useState<boolean>(true);
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_SAN_PHOTO);

  const [selectedCity, setSelectedCity] = useState<CityPreset>(KURDISTAN_CITIES[0]);
  const [customCoords, setCustomCoords] = useState<{
    lat: number;
    lon: number;
    nameKu: string;
    nameEn: string;
  } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  const [batteryLevel, setBatteryLevel] = useState<number>(96);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true)
  );
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState<boolean>(false);

  // Live clock tick
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Live battery status (when browser supports Battery Status API)
  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManagerLike>;
    };
    if (!nav.getBattery) return;

    let batteryRef: BatteryManagerLike | null = null;
    const syncBattery = () => {
      if (!batteryRef) return;
      setBatteryLevel(Math.round(batteryRef.level * 100));
      setIsCharging(batteryRef.charging);
    };

    nav.getBattery().then((bat) => {
      batteryRef = bat;
      syncBattery();
      bat.addEventListener('levelchange', syncBattery);
      bat.addEventListener('chargingchange', syncBattery);
    }).catch(() => {
      // Ignore if blocked by browser policy
    });

    return () => {
      if (batteryRef) {
        batteryRef.removeEventListener('levelchange', syncBattery);
        batteryRef.removeEventListener('chargingchange', syncBattery);
      }
    };
  }, []);

  // Load weather for active city or GPS coordinates
  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const target = customCoords ?? selectedCity;
      const data = await fetchWeatherForCoords(
        target.lat,
        target.lon,
        target.nameKu,
        target.nameEn
      );
      setWeather(data);
    } catch {
      setWeatherError('نەتوانرا کەشوهەوا بهێنرێت');
    } finally {
      setWeatherLoading(false);
    }
  }, [selectedCity, customCoords]);

  useEffect(() => {
    loadWeather();
    const refreshTimer = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => window.clearInterval(refreshTimer);
  }, [loadWeather]);

  const isDaylight = weather ? isDaylightNow(weather, now) : true;

  // Auto-Theme: adapt Titanium finish, display layout, and clock style to selected city's sunrise & sunset
  useEffect(() => {
    if (!autoTheme || !weather) return;
    if (isDaylight) {
      setMode('wallpaper');
      setTitaniumFinish('whitesilver');
      setClockStyle('horizon');
    } else {
      setMode('aod');
      setTitaniumFinish('black');
      setClockStyle('stacked');
    }
  }, [autoTheme, weather, isDaylight]);

  const handleManualModeChange = (nextMode: ScreensaverMode) => {
    setAutoTheme(false);
    setMode(nextMode);
  };

  const handleManualTitaniumChange = (nextFinish: TitaniumFinish) => {
    setAutoTheme(false);
    setTitaniumFinish(nextFinish);
  };

  const handleManualClockChange = (nextClock: ClockStyle) => {
    setAutoTheme(false);
    setClockStyle(nextClock);
  };

  // Listen to native fullscreen exit (e.g. Esc key)
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Iframe sandbox may disallow native fullscreen; full-viewport mode still activates cleanly
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore
      }
    }
  };

  const handleSelectCity = (city: CityPreset) => {
    setCustomCoords(null);
    setSelectedCity(city);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setWeatherError('وێبگەڕەکەت پشتگیری GPS ناکات');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          nameKu: 'شوێنی ئێستا',
          nameEn: 'Current Location',
        });
        setLocating(false);
      },
      () => {
        setWeatherError('ڕێگەپێدانی شوێن نەدرا');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 relative overflow-x-hidden">
      {/* Subtle deep ambient lighting */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.07),transparent_50%)]"
        aria-hidden="true"
      />

      {/* Mobile Compact Action Bar */}
      <div className="lg:hidden relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#090c12]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">سان</span>
          <span className="text-slate-500 text-xs" aria-hidden="true">·</span>
          <span className="text-xs text-slate-300 font-clock">Galaxy S25 Ultra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PWAInstallButton compact />
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>پڕشاشە</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSettingsOpen(true)}
            className="min-h-[40px] min-w-[40px] rounded-xl bg-white/10 text-white flex items-center justify-center"
            aria-label="ڕێکخستنەکان"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Responsive Stage */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 min-h-[calc(100vh-64px)] lg:min-h-screen flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-8 lg:gap-12 items-center">
          {/* Centerpiece: Samsung Galaxy S25 Ultra Screensaver */}
          <div className="flex justify-center">
            <S25UltraScreensaver
              now={now}
              mode={mode}
              titaniumFinish={titaniumFinish}
              clockStyle={clockStyle}
              use24Hour={use24Hour}
              showSeconds={showSeconds}
              useKurdishDigits={useKurdishDigits}
              photoUrl={photoUrl}
              batteryLevel={batteryLevel}
              isCharging={isCharging}
              weather={weather}
              weatherLoading={weatherLoading}
              weatherError={weatherError}
              onRefreshWeather={loadWeather}
              onOpenCalendar={() => setCalendarOpen(true)}
              onToggleMode={() => handleManualModeChange(mode === 'wallpaper' ? 'aod' : 'wallpaper')}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>

          {/* Desktop Control Studio */}
          <div className="hidden lg:block">
            <ControlStudio
              mode={mode}
              onModeChange={handleManualModeChange}
              titaniumFinish={titaniumFinish}
              onTitaniumFinishChange={handleManualTitaniumChange}
              clockStyle={clockStyle}
              onClockStyleChange={handleManualClockChange}
              use24Hour={use24Hour}
              onUse24HourChange={setUse24Hour}
              showSeconds={showSeconds}
              onShowSecondsChange={setShowSeconds}
              useKurdishDigits={useKurdishDigits}
              onUseKurdishDigitsChange={setUseKurdishDigits}
              autoTheme={autoTheme}
              onAutoThemeChange={setAutoTheme}
              isDaylight={isDaylight}
              weather={weather}
              selectedCityId={customCoords ? '' : selectedCity.id}
              onSelectCity={handleSelectCity}
              onUseCurrentLocation={handleUseCurrentLocation}
              locating={locating}
              onOpenCalendar={() => setCalendarOpen(true)}
              onToggleFullscreen={handleToggleFullscreen}
              onUploadPhoto={setPhotoUrl}
              onResetPhoto={() => setPhotoUrl(DEFAULT_SAN_PHOTO)}
              isCustomPhoto={photoUrl !== DEFAULT_SAN_PHOTO}
            />
          </div>
        </div>
      </main>

      {/* Mobile Settings Sheet */}
      {mobileSettingsOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-end"
          onClick={() => setMobileSettingsOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#0e121a] border-t border-white/15 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-sm font-bold text-white">ڕێکخستنەکانی سکرین سەیڤەر</span>
              <button
                type="button"
                onClick={() => setMobileSettingsOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-white/8 flex items-center justify-center text-slate-300"
                aria-label="داخستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ControlStudio
              mode={mode}
              onModeChange={handleManualModeChange}
              titaniumFinish={titaniumFinish}
              onTitaniumFinishChange={handleManualTitaniumChange}
              clockStyle={clockStyle}
              onClockStyleChange={handleManualClockChange}
              use24Hour={use24Hour}
              onUse24HourChange={setUse24Hour}
              showSeconds={showSeconds}
              onShowSecondsChange={setShowSeconds}
              useKurdishDigits={useKurdishDigits}
              onUseKurdishDigitsChange={setUseKurdishDigits}
              autoTheme={autoTheme}
              onAutoThemeChange={setAutoTheme}
              isDaylight={isDaylight}
              weather={weather}
              selectedCityId={customCoords ? '' : selectedCity.id}
              onSelectCity={handleSelectCity}
              onUseCurrentLocation={handleUseCurrentLocation}
              locating={locating}
              onOpenCalendar={() => {
                setMobileSettingsOpen(false);
                setCalendarOpen(true);
              }}
              onToggleFullscreen={() => {
                setMobileSettingsOpen(false);
                handleToggleFullscreen();
              }}
              onUploadPhoto={setPhotoUrl}
              onResetPhoto={() => setPhotoUrl(DEFAULT_SAN_PHOTO)}
              isCustomPhoto={photoUrl !== DEFAULT_SAN_PHOTO}
            />
          </div>
        </div>
      )}

      {/* Dual Kurdish & Gregorian Calendar Modal */}
      <DualCalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        now={now}
        useKurdishDigits={useKurdishDigits}
      />

      <OfflineIndicator />
    </div>
  );
}
