import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, AlertCircle, Zap } from 'lucide-react';

interface VisualCountdownProps {
  eventDate: string;
  eventTitle: string;
  createdAt?: string;
}

export const VisualCountdown: React.FC<VisualCountdownProps> = ({ eventDate, eventTitle, createdAt }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Assume event starts at 18:00 (6 PM) on the event date if no time specified
      const targetTime = new Date(`${eventDate}T18:00:00`).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff, isPassed: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const isWithin30Days = timeLeft.days <= 30 && !timeLeft.isPassed;
  const isUrgentWithin7Days = timeLeft.days <= 7 && !timeLeft.isPassed;

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-500 overflow-hidden border ${
        isUrgentWithin7Days
          ? 'bg-gradient-to-r from-[#29252A] via-[#3D2534] to-[#29252A] border-amber-500/80 shadow-[0_0_30px_rgba(229,195,132,0.25)]'
          : isWithin30Days
          ? 'bg-gradient-to-r from-[#29252A] via-[#332733] to-[#29252A] border-[#D8BC91] shadow-[0_0_20px_rgba(216,188,145,0.15)]'
          : 'bg-[#29252A] border-[#3B333B]'
      }`}
    >
      {/* Background Ambient Glow for within 30 days */}
      {isWithin30Days && (
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#D8BC91]/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side Info */}
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center gap-2">
            {isWithin30Days ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#D8BC91] text-[#211721] shadow-md animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Final Countdown · Within 30 Days</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-[#211721] text-[#A7B49A] border border-[#3B333B]">
                <Clock className="w-3 h-3" />
                <span>Event Milestone Countdown</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-serif text-[#F4EEE5] pt-1">
            {timeLeft.isPassed ? 'Event Completed' : `Countdown to ${eventTitle}`}
          </h3>
          <p className="text-xs text-gray-400 font-light">
            Target Date: <span className="text-[#D8BC91] font-mono font-medium">{eventDate}</span> (6:00 PM)
          </p>
        </div>

        {/* Right Side Digit Units */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-18 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold border shadow-inner transition-all ${
                isWithin30Days
                  ? 'bg-[#211721] text-[#D8BC91] border-[#D8BC91]/60'
                  : 'bg-[#211721] text-white border-[#3B333B]'
              }`}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1.5">
              Days
            </span>
          </div>

          <div className="text-xl font-serif text-gray-600 font-light self-center pb-5">:</div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-18 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold border shadow-inner transition-all ${
                isWithin30Days
                  ? 'bg-[#211721] text-[#D8BC91] border-[#D8BC91]/60'
                  : 'bg-[#211721] text-white border-[#3B333B]'
              }`}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1.5">
              Hours
            </span>
          </div>

          <div className="text-xl font-serif text-gray-600 font-light self-center pb-5">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-18 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold border shadow-inner transition-all ${
                isWithin30Days
                  ? 'bg-[#211721] text-[#A7B49A] border-[#A7B49A]/60'
                  : 'bg-[#211721] text-white border-[#3B333B]'
              }`}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1.5">
              Mins
            </span>
          </div>

          <div className="hidden sm:block text-xl font-serif text-gray-600 font-light self-center pb-5">:</div>

          {/* Seconds (on desktop or wider screens) */}
          <div className="hidden sm:flex flex-col items-center">
            <div
              className={`w-16 h-18 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold border shadow-inner transition-all ${
                isWithin30Days
                  ? 'bg-[#211721] text-amber-300 border-amber-500/50'
                  : 'bg-[#211721] text-gray-300 border-[#3B333B]'
              }`}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mt-1.5">
              Secs
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
