export type WeatherKind =
  | 'sunny'
  | 'clear-night'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'storm'
  | 'snow';

export type AlertSeverity = 'extreme' | 'severe' | 'moderate';

export interface WeatherAlert {
  id: string;
  severity: AlertSeverity;
  titleKu: string;
  titleEn?: string;
  descriptionKu: string;
  source: string;
  expiresAt?: string;
  metricLabel?: string;
}

export interface CityPreset {
  id: string;
  nameKu: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export interface HourlySnapshot {
  timeLabel: string;
  temp: number;
  kind: WeatherKind;
}

export interface WeatherData {
  cityKu: string;
  cityEn: string;
  temperature: number;
  feelsLike: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  pressureHpa: number;
  cloudCover: number;
  conditionKu: string;
  kind: WeatherKind;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  sunriseMinutes: number;
  sunsetMinutes: number;
  utcOffsetSeconds: number;
  hourly: HourlySnapshot[];
  alerts: WeatherAlert[];
  updatedAt: string;
}

function parseIsoTimeToMinutes(isoStr: unknown, fallbackMinutes: number): { label: string; minutes: number } {
  const str = String(isoStr || '');
  const match = str.match(/T(\d{2}):(\d{2})/);
  if (!match) {
    const h = String(Math.floor(fallbackMinutes / 60)).padStart(2, '0');
    const m = String(fallbackMinutes % 60).padStart(2, '0');
    return { label: `${h}:${m}`, minutes: fallbackMinutes };
  }
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  return {
    label: `${match[1]}:${match[2]}`,
    minutes: hh * 60 + mm,
  };
}

export function isDaylightNow(weather: WeatherData, now: Date): boolean {
  const cityTime = new Date(now.getTime() + weather.utcOffsetSeconds * 1000);
  const currentMinutes = cityTime.getUTCHours() * 60 + cityTime.getUTCMinutes();
  return currentMinutes >= weather.sunriseMinutes && currentMinutes < weather.sunsetMinutes;
}

export const KURDISTAN_CITIES: CityPreset[] = [
  { id: 'erbil', nameKu: 'هەولێر', nameEn: 'Erbil', lat: 36.1911, lon: 44.0091 },
  { id: 'sulaymaniyah', nameKu: 'سلێمانی', nameEn: 'Sulaymaniyah', lat: 35.5613, lon: 45.4309 },
  { id: 'duhok', nameKu: 'دهۆک', nameEn: 'Duhok', lat: 36.8669, lon: 42.9885 },
  { id: 'kirkuk', nameKu: 'کەرکووک', nameEn: 'Kirkuk', lat: 35.4681, lon: 44.3922 },
  { id: 'halabja', nameKu: 'هەڵەبجە', nameEn: 'Halabja', lat: 35.1778, lon: 45.9861 },
  { id: 'zakho', nameKu: 'زاخۆ', nameEn: 'Zakho', lat: 37.1436, lon: 42.6819 },
  { id: 'soran', nameKu: 'سۆران', nameEn: 'Soran', lat: 36.6531, lon: 44.5441 },
  { id: 'ranya', nameKu: 'ڕانیە', nameEn: 'Ranya', lat: 36.2558, lon: 44.8825 },
];

export function mapWmoCodeToKurdish(
  code: number,
  isDay: boolean
): { conditionKu: string; kind: WeatherKind } {
  if (code === 0) {
    return {
      conditionKu: isDay ? 'ئاسمان ساماڵە' : 'شەوێکی ساماڵ',
      kind: isDay ? 'sunny' : 'clear-night',
    };
  }
  if (code === 1 || code === 2) {
    return {
      conditionKu: 'کەمێک هەوراوی',
      kind: 'partly-cloudy',
    };
  }
  if (code === 3) {
    return {
      conditionKu: 'هەوراوی',
      kind: 'cloudy',
    };
  }
  if (code === 45 || code === 48) {
    return {
      conditionKu: 'تەماوی',
      kind: 'fog',
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      conditionKu: code >= 63 || code >= 81 ? 'بارانی بەخوڕ' : 'باراناوی',
      kind: 'rain',
    };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      conditionKu: 'بەفراوی',
      kind: 'snow',
    };
  }
  if (code >= 95) {
    return {
      conditionKu: 'هەورەبروسکە و باران',
      kind: 'storm',
    };
  }
  return {
    conditionKu: 'نیمچە هەور',
    kind: 'partly-cloudy',
  };
}

function normalizeSeverity(raw: unknown): AlertSeverity {
  const val = String(raw || '').toLowerCase();
  if (val.includes('extreme')) return 'extreme';
  if (val.includes('severe')) return 'severe';
  return 'moderate';
}

function parseExplicitApiAlerts(data: Record<string, unknown>): WeatherAlert[] {
  const rawList = Array.isArray(data.alerts)
    ? data.alerts
    : Array.isArray(data.warnings)
    ? data.warnings
    : [];

  return rawList
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item, idx) => {
      const title = String(item.headline || item.event || item.title || 'ئاگادارکردنەوەی کەشوهەوا');
      const description = String(item.description || item.instruction || title);
      return {
        id: String(item.id || `api-alert-${idx}-${title.slice(0, 12)}`),
        severity: normalizeSeverity(item.severity),
        titleKu: title,
        titleEn: item.event ? String(item.event) : undefined,
        descriptionKu: description,
        source: String(item.senderName || item.source || 'سەرچاوەی کەشوهەوا'),
        expiresAt: item.expires ? String(item.expires) : undefined,
      };
    });
}

function extractSevereWeatherFromTelemetry(
  data: Record<string, unknown>,
  startIdx: number
): WeatherAlert[] {
  const current = (data.current || {}) as Record<string, unknown>;
  const hourly = (data.hourly || {}) as Record<string, unknown>;
  const daily = (data.daily || {}) as Record<string, unknown>;

  const alerts: WeatherAlert[] = [];
  const code = Number(current.weather_code ?? 0);
  const temp = Number(current.temperature_2m ?? 0);
  const feelsLike = Number(current.apparent_temperature ?? temp);
  const windSpeed = Number(current.wind_speed_10m ?? 0);
  const windGusts = Number(current.wind_gusts_10m ?? windSpeed);

  const hourlyCodes: number[] = Array.isArray(hourly.weather_code)
    ? hourly.weather_code.slice(startIdx, startIdx + 6).map(Number)
    : [];
  const hourlyGusts: number[] = Array.isArray(hourly.wind_gusts_10m)
    ? hourly.wind_gusts_10m.slice(startIdx, startIdx + 6).map(Number)
    : [];
  const maxDailyPrecip = Array.isArray(daily.precipitation_sum)
    ? Number(daily.precipitation_sum[0] ?? 0)
    : 0;

  // 1. Thunderstorm / Hail warning
  if (code >= 95 || hourlyCodes.some((c) => c >= 95)) {
    const isHail = code === 96 || code === 99 || hourlyCodes.some((c) => c === 96 || c === 99);
    alerts.push({
      id: 'wmo-storm-warning',
      severity: isHail ? 'extreme' : 'severe',
      titleKu: isHail ? 'هۆشداریی تەزرە و هەورەبروسکە' : 'هۆشداریی هەورەبروسکە و ڕەشەبا',
      descriptionKu: isHail
        ? 'تۆمارکردنی هەورەبروسکەی توند و ئەگەری بارینی تەزرە لە ناوچەکەدا.'
        : 'ئەگەری هەورەبروسکە و بارانی کتوپڕ هەیە؛ لە شوێنی کراوە دووربکەوەرەوە.',
      source: 'Open-Meteo WMO',
      metricLabel: `WMO ${code}`,
    });
  }

  // 2. Heavy Rain / Flood Risk
  if (
    code === 65 ||
    code === 67 ||
    code === 82 ||
    maxDailyPrecip >= 25 ||
    hourlyCodes.some((c) => c === 65 || c === 67 || c === 82)
  ) {
    alerts.push({
      id: 'wmo-heavy-rain',
      severity: 'severe',
      titleKu: 'هۆشداریی بارانی بەخوڕ',
      descriptionKu: 'بڕێکی زۆر باران تۆمارکراوە؛ وریابە لە کۆبوونەوەی ئاو و خلیسکان.',
      source: 'Open-Meteo WMO',
      metricLabel: maxDailyPrecip >= 25 ? `${Math.round(maxDailyPrecip)} mm` : undefined,
    });
  }

  // 3. Heavy Snow / Blizzard
  if (code === 75 || code === 86 || hourlyCodes.some((c) => c === 75 || c === 86)) {
    alerts.push({
      id: 'wmo-heavy-snow',
      severity: 'severe',
      titleKu: 'هۆشداریی بەفربارینی زۆر',
      descriptionKu: 'بەفربارینی چڕ و کەمبوونەوەی مەودای بینین لە ڕێگاوبانەکاندا.',
      source: 'Open-Meteo WMO',
    });
  }

  // 4. High Wind Gusts
  const peakGust = Math.max(windGusts, ...hourlyGusts, 0);
  if (peakGust >= 60 || windSpeed >= 45) {
    alerts.push({
      id: 'wmo-high-wind',
      severity: peakGust >= 80 ? 'severe' : 'moderate',
      titleKu: 'هۆشداریی بای بەهێز',
      descriptionKu: 'خێرایی با بەرزە و ئەگەری تۆز و خۆڵ یان جوڵانی تەنی سووک هەیە.',
      source: 'Open-Meteo Wind',
      metricLabel: `${Math.round(peakGust)} km/h`,
    });
  }

  // 5. Extreme Heat
  if (temp >= 43 || feelsLike >= 45) {
    alerts.push({
      id: 'wmo-extreme-heat',
      severity: 'severe',
      titleKu: 'هۆشداریی گەرمای توند',
      descriptionKu: 'پلەی گەرمی زۆر بەرزە؛ خۆت بپارێزە لە بەرکەوتنی ڕاستەوخۆی خۆر.',
      source: 'Open-Meteo Temp',
      metricLabel: `${Math.round(temp)}°C`,
    });
  }

  // 6. Extreme Cold / Freeze
  if (temp <= -5) {
    alerts.push({
      id: 'wmo-freeze',
      severity: 'moderate',
      titleKu: 'هۆشداریی سەرما و بەستەڵەک',
      descriptionKu: 'پلەی گەرمی لە ژێر سفرەوەیە و ئەگەری دروستبوونی شەختە هەیە.',
      source: 'Open-Meteo Temp',
      metricLabel: `${Math.round(temp)}°C`,
    });
  }

  // 7. Dense Fog
  if (code === 45 || code === 48) {
    alerts.push({
      id: 'wmo-dense-fog',
      severity: 'moderate',
      titleKu: 'هۆشداریی تەمومژی چڕ',
      descriptionKu: 'مەودای بینین بەهۆی تەمومژەوە کەمبووەتەوە؛ لە شۆفێریدا وریابە.',
      source: 'Open-Meteo WMO',
    });
  }

  return alerts;
}

async function fetchNwsAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: { Accept: 'application/geo+json' },
        signal: controller.signal,
      }
    );
    window.clearTimeout(timeoutId);

    if (!res.ok) return [];
    const geo = await res.json();
    const features = Array.isArray(geo?.features) ? geo.features : [];

    return features
      .slice(0, 4)
      .map((feature: Record<string, unknown>, idx: number) => {
        const props = (feature.properties || {}) as Record<string, unknown>;
        const eventName = String(props.event || 'Severe Weather Alert');
        const headline = String(props.headline || eventName);
        const description = String(props.description || headline);
        const expires = props.expires ? String(props.expires) : undefined;

        return {
          id: String(props.id || feature.id || `nws-${idx}`),
          severity: normalizeSeverity(props.severity),
          titleKu: headline,
          titleEn: eventName,
          descriptionKu: description,
          source: String(props.senderName || 'National Weather Service'),
          expiresAt: expires
            ? new Date(expires).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined,
        };
      });
  } catch {
    return [];
  }
}

export async function fetchWeatherForCoords(
  lat: number,
  lon: number,
  cityKu: string,
  cityEn: string
): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_gusts_10m,surface_pressure,cloud_cover` +
    `&hourly=temperature_2m,weather_code,is_day,wind_gusts_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
    `&timezone=auto&forecast_days=2`;

  const [response, nwsAlerts] = await Promise.all([
    fetch(url),
    fetchNwsAlerts(lat, lon),
  ]);

  if (!response.ok) {
    throw new Error('Weather request failed');
  }

  const data = await response.json();
  const current = data.current;
  const isDay = Boolean(current.is_day);
  const mapped = mapWmoCodeToKurdish(Number(current.weather_code), isDay);

  const nowHourIso = String(current.time || '').slice(0, 13);
  const hourlyTimes: string[] = data.hourly?.time || [];
  let startIdx = hourlyTimes.findIndex((t) => t.startsWith(nowHourIso));
  if (startIdx < 0) startIdx = 0;

  const hourly: HourlySnapshot[] = [];
  for (let i = 1; i <= 5; i += 1) {
    const idx = startIdx + i * 2;
    if (idx < hourlyTimes.length) {
      const hourStr = hourlyTimes[idx].slice(11, 16);
      const hCode = Number(data.hourly.weather_code[idx]);
      const hDay = Boolean(data.hourly.is_day?.[idx] ?? 1);
      hourly.push({
        timeLabel: hourStr,
        temp: Math.round(Number(data.hourly.temperature_2m[idx])),
        kind: mapWmoCodeToKurdish(hCode, hDay).kind,
      });
    }
  }

  const explicitAlerts = parseExplicitApiAlerts(data);
  const telemetryAlerts = extractSevereWeatherFromTelemetry(data, startIdx);

  // Deduplicate by id, prioritizing official CAP/NWS alerts and explicit API alerts first
  const mergedMap = new Map<string, WeatherAlert>();
  for (const alert of [...nwsAlerts, ...explicitAlerts, ...telemetryAlerts]) {
    if (!mergedMap.has(alert.id)) {
      mergedMap.set(alert.id, alert);
    }
  }

  const sunriseParsed = parseIsoTimeToMinutes(data.daily?.sunrise?.[0], 6 * 60 + 30);
  const sunsetParsed = parseIsoTimeToMinutes(data.daily?.sunset?.[0], 17 * 60 + 30);
  const utcOffsetSeconds = Number(data.utc_offset_seconds ?? 0);

  return {
    cityKu,
    cityEn,
    temperature: Math.round(Number(current.temperature_2m)),
    feelsLike: Math.round(Number(current.apparent_temperature)),
    tempMax: Math.round(Number(data.daily?.temperature_2m_max?.[0] ?? current.temperature_2m)),
    tempMin: Math.round(Number(data.daily?.temperature_2m_min?.[0] ?? current.temperature_2m)),
    humidity: Math.round(Number(current.relative_humidity_2m)),
    windSpeed: Math.round(Number(current.wind_speed_10m)),
    pressureHpa: Math.round(Number(current.surface_pressure ?? 1013)),
    cloudCover: Math.round(Number(current.cloud_cover ?? 0)),
    conditionKu: mapped.conditionKu,
    kind: mapped.kind,
    isDay,
    sunrise: sunriseParsed.label,
    sunset: sunsetParsed.label,
    sunriseMinutes: sunriseParsed.minutes,
    sunsetMinutes: sunsetParsed.minutes,
    utcOffsetSeconds,
    hourly,
    alerts: Array.from(mergedMap.values()),
    updatedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}
