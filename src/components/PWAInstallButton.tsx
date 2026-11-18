import React, { useState } from 'react';
import { Check, Copy, Download, Smartphone, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton({ compact = false }: { compact?: boolean }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isInstalled) {
    return null;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  const handlePrimaryClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePrimaryClick}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
          compact
            ? 'min-h-[40px] px-2.5 py-1.5 text-xs bg-white/10 hover:bg-white/18 text-white'
            : 'min-h-[44px] w-full px-4 py-2.5 text-xs bg-emerald-500/18 hover:bg-emerald-500/28 border border-emerald-400/35 text-emerald-200'
        }`}
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{isInstallable ? 'دابەزاندن وەک ئەپ (Android)' : 'دابەزاندن / گۆڕین بۆ APK'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setShowGuide(false)}
          role="dialog"
          aria-modal="true"
          aria-label="ڕێنمایی دابەزاندن لەسەر Android و Galaxy S25 Ultra"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#10141c] border border-white/12 p-6 text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">دامەزراندن لەسەر Galaxy S25 Ultra</h2>
                  <p className="text-[11px] text-slate-400">WebAPK ی ڕاستەوخۆ و دروستکردنی فایلەکانی APK</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="داخستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 text-xs leading-relaxed text-slate-300">
              {isIOS ? (
                <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3.5">
                  <div className="font-bold text-white mb-1">بۆ iPhone / Safari:</div>
                  <p>لە Safari دوگمەی Share دابگرە و پاشان Add to Home Screen هەڵبژێرە.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3.5">
                    <div className="font-bold text-white mb-1">
                      1. دامەزراندنی ڕاستەوخۆ لەسەر Galaxy S25 Ultra (باشترین ڕێگا):
                    </div>
                    <p>
                      سەرەتا بەستەرەکە لە <span className="text-sky-300 font-semibold">Chrome</span> یان{' '}
                      <span className="text-sky-300 font-semibold">Samsung Internet</span> لە دەرەوەی چوارچێوەی AI Studio بکەرەوە، دواتر لە مێنووی{' '}
                      <span className="text-white font-semibold">⋮ → Add to Home screen → Install</span> دابگرە. ڕاستەوخۆ وەک ئەپێکی سەربەخۆ لەسەر مۆبایلەکەت دادەمەزرێت.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3.5">
                    <div className="font-bold text-white mb-1">
                      2. بۆچی PWABuilder نەیتوانی بیخوێنێتەوە؟
                    </div>
                    <p>
                      بەستەری AI Studio تایبەتە و پێویستی بە چوونەژوورەوەی Google هەیە، بۆیە ماڵپەڕی دەرەکی وەک{' '}
                      <span className="font-clock text-sky-300" dir="ltr">pwabuilder.com</span> ناتوانێت بیخوێنێتەوە. بۆ دەرهێنانی فایلی{' '}
                      <span className="font-clock text-emerald-300" dir="ltr">.apk</span>، پێویستە کۆدەکە لەسەر هۆستێکی گشتی (وەک Vercel یان Netlify) دابنێیت و دواتر بەستەرە گشتییەکە بدەیتە PWABuilder.
                    </p>
                  </div>
                </>
              )}

              {currentUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <div
                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-clock text-[11px] text-slate-300 truncate"
                    dir="ltr"
                  >
                    {currentUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="min-h-[38px] px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کۆپی کرا' : 'کۆپی'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg backdrop-blur-md">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>دۆخی بێ ئینتەرنێت · زانیارییە پاشەکەوتکراوەکان بەکاردێن</span>
    </div>
  );
}
