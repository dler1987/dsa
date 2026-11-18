import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import {
  formatDigits,
  getGregorianInfo,
  getKurdishMonthGrid,
  GREGORIAN_MONTHS_KURDISH,
  KURDISH_MONTHS,
  KURDISH_WEEK_HEADER,
  toKurdishDate,
} from '../utils/kurdishCalendar';

interface DualCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  now: Date;
  useKurdishDigits: boolean;
}

export function DualCalendarModal({
  isOpen,
  onClose,
  now,
  useKurdishDigits,
}: DualCalendarModalProps) {
  const todayKurdish = toKurdishDate(now);
  const todayGregorian = getGregorianInfo(now);

  const [viewYear, setViewYear] = useState(todayKurdish.year);
  const [viewMonth, setViewMonth] = useState(todayKurdish.month);

  if (!isOpen) return null;

  const cells = getKurdishMonthGrid(viewYear, viewMonth, now);

  // Determine Gregorian span covered by this Kurdish month
  const currentMonthCells = cells.filter((c) => c.isCurrentMonth);
  const firstG = currentMonthCells[0]?.gregorian;
  const lastG = currentMonthCells[currentMonthCells.length - 1]?.gregorian;
  const gregorianSpan =
    firstG && lastG
      ? firstG.getMonth() === lastG.getMonth()
        ? `${GREGORIAN_MONTHS_KURDISH[firstG.getMonth()]} ${formatDigits(firstG.getFullYear(), useKurdishDigits)}`
        : `${GREGORIAN_MONTHS_KURDISH[firstG.getMonth()]} – ${GREGORIAN_MONTHS_KURDISH[lastG.getMonth()]} ${formatDigits(lastG.getFullYear(), useKurdishDigits)}`
      : '';

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setViewYear(todayKurdish.year);
    setViewMonth(todayKurdish.month);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="ڕۆژمێری کوردی و گریگۆری"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#10141c] border border-white/12 shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ڕۆژمێری کوردی و گریگۆری</h2>
              <p className="text-xs text-slate-400">
                {todayKurdish.weekdayName} · {formatDigits(todayKurdish.day, useKurdishDigits)}ی{' '}
                {todayKurdish.monthName} {formatDigits(todayKurdish.year, useKurdishDigits)} /{' '}
                {formatDigits(todayGregorian.day, useKurdishDigits)}ی{' '}
                {todayGregorian.monthNameKurdish} {formatDigits(todayGregorian.year, useKurdishDigits)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="داخستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="text-xl font-bold text-white">
              {KURDISH_MONTHS[viewMonth - 1]} {formatDigits(viewYear, useKurdishDigits)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{gregorianSpan}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-white/8 hover:bg-white/15 text-sky-300 transition-colors min-h-[40px]"
            >
              ئەمڕۆ
            </button>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="min-w-[40px] min-h-[40px] rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-200 transition-colors"
              aria-label="مانگی پێشوو"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="min-w-[40px] min-h-[40px] rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-200 transition-colors"
              aria-label="مانگی داهاتوو"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1.5 px-6 pb-2 text-center">
          {KURDISH_WEEK_HEADER.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-semibold py-1 ${
                idx === 6 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 px-6 pb-6">
          {cells.map((cell, index) => {
            const isFriday = cell.gregorian.getDay() === 5;
            return (
              <div
                key={`${cell.kurdish.year}-${cell.kurdish.month}-${cell.kurdish.day}-${index}`}
                className={`relative rounded-xl p-2 flex flex-col items-center justify-between min-h-[54px] border transition-colors ${
                  cell.isToday
                    ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-900/40'
                    : cell.isCurrentMonth
                    ? 'bg-white/[0.04] border-white/[0.06] text-slate-100'
                    : 'bg-transparent border-transparent text-slate-600'
                }`}
              >
                <span
                  className={`font-clock text-sm font-bold leading-none tabular-nums ${
                    !cell.isToday && isFriday && cell.isCurrentMonth ? 'text-rose-400' : ''
                  }`}
                >
                  {formatDigits(cell.kurdish.day, useKurdishDigits)}
                </span>
                <span
                  className={`font-clock text-[10px] leading-none tabular-nums mt-1.5 ${
                    cell.isToday ? 'text-sky-100' : 'text-slate-400/80'
                  }`}
                >
                  {formatDigits(cell.gregorian.getDate(), useKurdishDigits)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
