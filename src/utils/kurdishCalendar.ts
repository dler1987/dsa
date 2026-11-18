export interface KurdishDate {
  year: number;       // e.g. 2726
  month: number;      // 1..12
  day: number;        // 1..31
  monthName: string;  // e.g. گەڵاڕێزان
  seasonName: string; // e.g. پاییز
  weekdayName: string; // e.g. چوارشەممە
  isLeapYear: boolean;
}

export interface GregorianDateInfo {
  year: number;
  month: number; // 1..12
  day: number;
  monthNameKurdish: string;
  monthNameShortEn: string;
  weekdayNameKurdish: string;
}

export interface CalendarCell {
  gregorian: Date;
  kurdish: KurdishDate;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const KURDISH_MONTHS = [
  'خاکەلێوە',
  'گوڵان',
  'جۆزەردان',
  'پووشپەڕ',
  'گەلاوێژ',
  'خەرمانان',
  'ڕەزبەر',
  'گەڵاڕێزان',
  'سەرماوەز',
  'بەفرانبار',
  'ڕێبەندان',
  'ڕەشەمێ',
] as const;

export const KURDISH_SEASONS = [
  'بەهار',
  'هاوین',
  'پاییز',
  'زستان',
] as const;

export const GREGORIAN_MONTHS_KURDISH = [
  'کانوونی دووەم',
  'شوبات',
  'ئازار',
  'نیسان',
  'ئایار',
  'حوزەیران',
  'تەممووز',
  'ئاب',
  'ئەیلوول',
  'تشرینی یەکەم',
  'تشرینی دووەم',
  'کانوونی یەکەم',
] as const;

export const GREGORIAN_MONTHS_SHORT_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

// JavaScript getDay(): 0=Sunday .. 6=Saturday
export const KURDISH_WEEKDAYS = [
  'یەکشەممە',
  'دووشەممە',
  'سێشەممە',
  'چوارشەممە',
  'پێنجشەممە',
  'هەینی',
  'شەممە',
] as const;

// Kurdish calendar week starts on Saturday (شەممە)
export const KURDISH_WEEK_HEADER = [
  'ش',
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'هـ',
] as const;

const KURDISH_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function formatDigits(value: string | number, useKurdishDigits: boolean): string {
  const str = String(value);
  if (!useKurdishDigits) return str;
  return str.replace(/\d/g, (d) => KURDISH_DIGITS[Number(d)]);
}

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - div(a, b) * b;
}

const JALALI_BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
];

function jalCal(jy: number) {
  const bl = JALALI_BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = JALALI_BREAKS[0];
  let jm = 0;
  let jump = 0;
  let n = 0;

  if (jy < jp || jy >= JALALI_BREAKS[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  for (let i = 1; i < bl; i += 1) {
    jm = JALALI_BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return {
    leap,
    gy,
    march,
  };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm = 0;
  let jd = 0;

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export function isKurdishLeapYear(kurdishYear: number): boolean {
  const jy = kurdishYear - 1321;
  return jalCal(jy).leap === 0;
}

export function getKurdishMonthLength(kurdishYear: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isKurdishLeapYear(kurdishYear) ? 30 : 29;
}

export function toKurdishDate(date: Date): KurdishDate {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const { jy, jm, jd } = d2j(g2d(gy, gm, gd));
  const kurdishYear = jy + 1321;
  const seasonIndex = Math.floor((jm - 1) / 3);

  return {
    year: kurdishYear,
    month: jm,
    day: jd,
    monthName: KURDISH_MONTHS[jm - 1],
    seasonName: KURDISH_SEASONS[seasonIndex],
    weekdayName: KURDISH_WEEKDAYS[date.getDay()],
    isLeapYear: isKurdishLeapYear(kurdishYear),
  };
}

export function kurdishToGregorian(kurdishYear: number, month: number, day: number): Date {
  const jy = kurdishYear - 1321;
  const { gy, gm, gd } = d2g(j2d(jy, month, day));
  return new Date(gy, gm - 1, gd);
}

export function getGregorianInfo(date: Date): GregorianDateInfo {
  const month = date.getMonth() + 1;
  return {
    year: date.getFullYear(),
    month,
    day: date.getDate(),
    monthNameKurdish: GREGORIAN_MONTHS_KURDISH[month - 1],
    monthNameShortEn: GREGORIAN_MONTHS_SHORT_EN[month - 1],
    weekdayNameKurdish: KURDISH_WEEKDAYS[date.getDay()],
  };
}

export function getKurdishMonthGrid(kurdishYear: number, month: number, today: Date): CalendarCell[] {
  const daysInMonth = getKurdishMonthLength(kurdishYear, month);
  const firstGregorian = kurdishToGregorian(kurdishYear, month, 1);
  // Saturday (6) -> 0, Sunday (0) -> 1, ..., Friday (5) -> 6
  const startOffset = (firstGregorian.getDay() + 1) % 7;

  const cells: CalendarCell[] = [];
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  for (let i = -startOffset; i < daysInMonth + (42 - (daysInMonth + startOffset)); i += 1) {
    if (cells.length >= 42) break;
    const gDate = new Date(
      firstGregorian.getFullYear(),
      firstGregorian.getMonth(),
      firstGregorian.getDate() + i
    );
    const kDate = toKurdishDate(gDate);
    const cellStr = `${gDate.getFullYear()}-${gDate.getMonth()}-${gDate.getDate()}`;
    cells.push({
      gregorian: gDate,
      kurdish: kDate,
      isCurrentMonth: kDate.year === kurdishYear && kDate.month === month,
      isToday: cellStr === todayStr,
    });
  }

  // Trim trailing all-outside-month row if only 35 cells needed
  if (cells.length === 42 && cells.slice(35).every((c) => !c.isCurrentMonth)) {
    return cells.slice(0, 35);
  }
  return cells;
}
