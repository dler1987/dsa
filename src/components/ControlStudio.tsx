import React, { useRef } from 'react';
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Moon,
  RotateCcw,
  Sun,
  Sunrise,
  Sunset,
  Upload,
} from 'lucide-react';
import { KURDISTAN_CITIES, CityPreset, WeatherData } from '../utils/weatherService';
import { formatDigits } from '../utils/kurdishCalendar';
import { ClockStyle, ScreensaverMode, TitaniumFinish } from './S25UltraScreensaver';
import { GalaxyAiIcon } from './GalaxyIcons';
import { PWAInstallButton } from './PWAInstallButton';

interface ControlStudioProps {
  mode: ScreensaverMode;
  onModeChange: (m: ScreensaverMode) => void;
  titaniumFinish: TitaniumFinish;
  onTitaniumFinishChange: (f: TitaniumFinish) => void;
  clockStyle: ClockStyle;
  onClockStyleChange: (c: ClockStyle) => void;
  use24Hour: boolean;
  onUse24HourChange: (v: boolean) => void;
  showSeconds: boolean;
  onShowSecondsChange: (v: boolean) => void;
  useKurdishDigits: boolean;
  onUseKurdishDigitsChange: (v: boolean) => void;
  autoTheme: boolean;
  onAutoThemeChange: (v: boolean) => void;
  isDaylight: boolean;
  weather: WeatherData | null;
  selectedCityId: string;
  onSelectCity: (city: CityPreset) => void;
  onUseCurrentLocation: () => void;
  locating: boolean;
  onOpenCalendar: () => void;
  onToggleFullscreen: () => void;
  onUploadPhoto: (dataUrl: string) => void;
  onResetPhoto: () => void;
  isCustomPhoto: boolean;
}

const TITANIUM_OPTIONS: { id: TitaniumFinish; label: string; swatch: string }[] = [
  { id: 'silverblue', label: 'شینی زیوی', swatch: 'bg-[#7d92a8]' },
  { id: 'black', label: 'ڕەش', swatch: 'bg-[#22252b]' },
  { id: 'gray', label: 'خۆڵەمێشی', swatch: 'bg-[#7b7974]' },
  { id: 'whitesilver', label: 'سپی زیوی', swatch: 'bg-[#d0d5dd]' },
];

export function ControlStudio({
  mode,
  onModeChange,
  titaniumFinish,
  onTitaniumFinishChange,
  clockStyle,
  onClockStyleChange,
  use24Hour,
  onUse24HourChange,
  showSeconds,
  onShowSecondsChange,
  useKurdishDigits,
  onUseKurdishDigitsChange,
  autoTheme,
  onAutoThemeChange,
  isDaylight,
  weather,
  selectedCityId,
  onSelectCity,
  onUseCurrentLocation,
  locating,
  onOpenCalendar,
  onToggleFullscreen,
  onUploadPhoto,
  onResetPhoto,
  isCustomPhoto,
}: ControlStudioProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="w-full rounded-3xl bg-[#0e121a] border border-white/10 p-6 flex flex-col gap-6 text-slate-100">
      {/* Studio Heading */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <GalaxyAiIcon className="w-5 h-5" />
            <h1 className="text-xl font-bold text-white">سکرین سەیڤەری سان</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ڕێکخستنی شاشەی Samsung Galaxy S25 Ultra · One UI 7
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>سکرین سەیڤەری پڕشاشە</span>
        </button>
      </div>

      {/* Auto-Theme (Sunrise / Sunset) Mode */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {isDaylight ? (
                <Sunrise className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Sunset className="w-4 h-4 text-indigo-300 shrink-0" />
              )}
              <span>ڕووناکایی خۆکار (خۆرهەڵاتن / خۆرئاوابوون)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {autoTheme
                ? isDaylight
                  ? 'دۆخی ڕۆژ چالاکە · تیتانیۆمی سپی زیوی + وێنەی پڕشاشە'
                  : 'دۆخی شەو چالاکە · تیتانیۆمی ڕەش + AMOLED'
                : 'گۆڕینی خۆکاری ڕەنگ و شێواز بەپێی کاتی خۆری شارەکە'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoTheme}
            onClick={() => onAutoThemeChange(!autoTheme)}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border ${
              autoTheme
                ? 'bg-sky-500 text-slate-950 border-sky-400'
                : 'bg-white/8 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            {autoTheme ? 'چالاکە' : 'ناچالاکە'}
          </button>
        </div>

        {weather && (
          <div className="flex items-center justify-between pt-2 border-t border-white/8 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-300" />
              <span>خۆرهەڵاتن</span>
              <span className="font-clock font-semibold text-white tabular-nums" dir="ltr">
                {formatDigits(weather.sunrise, useKurdishDigits)}
              </span>
            </span>
            <span className="text-white/25" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Sunset className="w-3.5 h-3.5 text-indigo-300" />
              <span>خۆرئاوابوون</span>
              <span className="font-clock font-semibold text-white tabular-nums" dir="ltr">
                {formatDigits(weather.sunset, useKurdishDigits)}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Display Mode: Wallpaper vs Always-On Display */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          شێوازی سکرین سەیڤەر
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/8">
          <button
            type="button"
            onClick={() => onModeChange('wallpaper')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors ${
              mode === 'wallpaper'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>وێنەی پڕشاشە</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('aod')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors ${
              mode === 'aod'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Always-On AMOLED</span>
          </button>
        </div>
      </div>

      {/* Clock Style & Time Options */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            شێوازی کاتژمێر
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'stacked' as ClockStyle, label: 'دوو ڕیز' },
            { id: 'horizon' as ClockStyle, label: 'ئاسۆیی' },
            { id: 'editorial' as ClockStyle, label: 'کلاسیک' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onClockStyleChange(item.id)}
              className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                clockStyle === item.id
                  ? 'bg-white/12 border-sky-400/40 text-white'
                  : 'bg-white/[0.03] border-white/8 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onUse24HourChange(!use24Hour)}
            className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs border transition-colors ${
              use24Hour
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.03] border-white/8 text-slate-400'
            }`}
          >
            {use24Hour
              ? (useKurdishDigits ? '٢٤ کاتژمێری' : '24 کاتژمێری')
              : (useKurdishDigits ? '١٢ کاتژمێری' : '12 کاتژمێری')}
          </button>
          <button
            type="button"
            onClick={() => onShowSecondsChange(!showSeconds)}
            className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs border transition-colors ${
              showSeconds
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.03] border-white/8 text-slate-400'
            }`}
          >
            {showSeconds ? 'چرکە: چالاک' : 'چرکە: ناچالاک'}
          </button>
          <button
            type="button"
            onClick={() => onUseKurdishDigitsChange(!useKurdishDigits)}
            className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs border transition-colors ${
              useKurdishDigits
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/[0.03] border-white/8 text-slate-400'
            }`}
          >
            {useKurdishDigits ? 'ژمارەی ١٢٣' : 'ژمارەی 123'}
          </button>
        </div>
      </div>

      {/* Weather City Selector */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            شاری کەشوهەوا
          </span>
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={locating}
            className="text-[11px] font-medium text-sky-400 hover:text-sky-300 disabled:opacity-50 transition-colors"
          >
            {locating ? 'دیاریکردنی شوێن...' : 'شوێنی ئێستا (GPS)'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {KURDISTAN_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-medium border transition-colors truncate ${
                selectedCityId === city.id
                  ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                  : 'bg-white/[0.03] border-white/8 text-slate-400 hover:text-white'
              }`}
            >
              {city.nameKu}
            </button>
          ))}
        </div>
      </div>

      {/* Galaxy S25 Ultra Titanium Frame Finish */}
      <div>
        <span className="block text-xs font-semibold text-slate-300 mb-2">
          ڕەنگی چوارچێوەی تیتانیۆمی S25 Ultra
        </span>
        <div className="grid grid-cols-2 gap-2">
          {TITANIUM_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onTitaniumFinishChange(opt.id)}
              className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${
                titaniumFinish === opt.id
                  ? 'bg-white/10 border-sky-400/40 text-white'
                  : 'bg-white/[0.03] border-white/8 text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border border-white/25 shrink-0 ${opt.swatch}`} />
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo & Dual Calendar Actions */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenCalendar}
          className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-white/8 hover:bg-white/14 text-xs font-medium text-white inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>ڕۆژمێری کوردی و گریگۆری</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/8 hover:bg-white/14 text-xs font-medium text-slate-200 inline-flex items-center justify-center gap-2 transition-colors"
          title="گۆڕینی وێنە"
        >
          {isCustomPhoto ? <ImageIcon className="w-4 h-4 text-sky-400" /> : <Upload className="w-4 h-4 text-sky-400" />}
          <span>وێنەی نوێ</span>
        </button>

        {isCustomPhoto && (
          <button
            type="button"
            onClick={onResetPhoto}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white/8 hover:bg-white/14 text-xs font-medium text-slate-300 inline-flex items-center justify-center gap-1.5 transition-colors"
            title="گەڕانەوە بۆ وێنەی سەرەکی سان"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>وێنەی سان</span>
          </button>
        )}
      </div>

      {/* Android / S25 Ultra App Install & APK Packaging */}
      <PWAInstallButton />
    </aside>
  );
}
