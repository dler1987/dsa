export type LunarPhaseKind =
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface LunarPhaseInfo {
  kind: LunarPhaseKind;
  labelKu: string;
  illumination: number;
  phaseRatio: number;
}

const SYNODIC_MONTH = 29.530588853;
// Reference New Moon: 2000-01-06 18:14 UTC
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getLunarPhase(date: Date): LunarPhaseInfo {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON_MS) / 86400000;
  const cycles = diffDays / SYNODIC_MONTH;
  const phaseRatio = ((cycles % 1) + 1) % 1;
  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phaseRatio)) / 2) * 100);

  let kind: LunarPhaseKind;
  let labelKu: string;

  if (phaseRatio < 0.0625 || phaseRatio >= 0.9375) {
    kind = 'new-moon';
    labelKu = 'مانگی نوێ';
  } else if (phaseRatio < 0.1875) {
    kind = 'waxing-crescent';
    labelKu = 'هیلالی یەکەم';
  } else if (phaseRatio < 0.3125) {
    kind = 'first-quarter';
    labelKu = 'چارەکی یەکەم';
  } else if (phaseRatio < 0.4375) {
    kind = 'waxing-gibbous';
    labelKu = 'مانگی پڕبوون';
  } else if (phaseRatio < 0.5625) {
    kind = 'full-moon';
    labelKu = 'مانگی چواردە';
  } else if (phaseRatio < 0.6875) {
    kind = 'waning-gibbous';
    labelKu = 'مانگی کەمبوون';
  } else if (phaseRatio < 0.8125) {
    kind = 'last-quarter';
    labelKu = 'چارەکی کۆتایی';
  } else {
    kind = 'waning-crescent';
    labelKu = 'هیلالی کۆتایی';
  }

  return {
    kind,
    labelKu,
    illumination,
    phaseRatio,
  };
}
