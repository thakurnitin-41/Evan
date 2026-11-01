import React from 'react';
import { Event, TaskPriority } from '../types/event';
import { VisualCountdown } from './VisualCountdown';
import { SafeImage } from './SafeImage';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface OverviewDashboardProps {
  event: Event;
  onNavigateTab: (tab: string) => void;
  integrityReport: { healthScore: number; issues: any[] };
  onOpenCopilotWithQuery: (query: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  event,
  onNavigateTab,
  integrityReport,
  onOpenCopilotWithQuery,
}) => {
  // Arithmetic Calculations (Deterministic)
  const totalEst = event.budgetItems.reduce((acc, b) => acc + b.estimatedCost, 0);
  const totalAct = event.budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
  const totalSpentOrEst = Math.max(totalEst, totalAct);
  const remainingBudget = event.budget - totalSpentOrEst;
  const budgetPercentage = Math.min(100, Math.round((totalSpentOrEst / event.budget) * 100));

  // Task Completion Calculations
  const completedTasks = event.tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = event.tasks.length || 1;
  const taskCompletionPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Guest RSVP Ratio
  const confirmedGuests = event.guests.filter((g) => g.status === 'attending').length;
  const totalGuests = event.guestCount || 1;
  const rsvpPercentage = Math.round((confirmedGuests / totalGuests) * 100);

  // Days Countdown Calculation
  const calculateDaysLeft = () => {
    const target = new Date(event.date).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };
  const daysLeft = calculateDaysLeft();

  return (
    <div className="space-y-8 text-[#F4EEE5]">
      
      {/* 1. HERO CONCEPT BANNER */}
      <div className="relative rounded-2xl overflow-hidden border border-[#3B333B] bg-[#29252A]">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <SafeImage
            src={event.concept.moodboardImage}
            alt={event.concept.title}
            fallbackTitle={event.concept.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211721] via-[#211721]/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#D8BC91]">
              <span className="uppercase tracking-wider font-mono">{event.type}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#A7B49A]" />
                {event.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A7B49A]" />
                {event.date}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#F4EEE5] leading-tight">
              {event.concept.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light line-clamp-2">
              {event.concept.headline} — {event.concept.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {/* Days Left Countdown Pill */}
            <div className="px-4 py-3 rounded-xl bg-[#211721]/90 border border-[#3B333B] text-center backdrop-blur-md">
              <div className="text-2xl font-serif text-[#D8BC91] font-bold font-mono">{daysLeft}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Days Left</div>
            </div>

            {/* Health Score Pill */}
            <div className="px-4 py-3 rounded-xl bg-[#211721]/90 border border-[#3B333B] text-center backdrop-blur-md">
              <div className="text-2xl font-serif text-[#A7B49A] font-bold font-mono">
                {integrityReport.healthScore}%
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Integrity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Live Countdown Component (Days, Hours, Minutes, Seconds with <30 day highlight) */}
      <VisualCountdown
        eventDate={event.date}
        eventTitle={event.title}
        createdAt={event.createdAt}
      />

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Budget Card */}
        <div
          onClick={() => onNavigateTab('budget')}
          className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/60 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">Total Budget</span>
            <DollarSign className="w-4 h-4 text-[#D8BC91]" />
          </div>
          <div className="text-2xl font-serif text-[#F4EEE5] font-semibold">
            {event.currency}{event.budget.toLocaleString()}
          </div>
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-1.5 bg-[#3B333B] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetPercentage > 100 ? 'bg-red-500' : 'bg-[#D8BC91]'
                }`}
                style={{ width: `${Math.min(100, budgetPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Spent: {event.currency}{totalSpentOrEst.toLocaleString()}</span>
              <span>Rem: {event.currency}{remainingBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Task Completion Card */}
        <div
          onClick={() => onNavigateTab('timeline')}
          className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/60 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">Task Completion</span>
            <CheckCircle2 className="w-4 h-4 text-[#A7B49A]" />
          </div>
          <div className="text-2xl font-serif text-[#F4EEE5] font-semibold">
            {completedTasks} / {totalTasks} <span className="text-xs text-gray-400 font-sans">({taskCompletionPercentage}%)</span>
          </div>
          <div className="w-full h-1.5 bg-[#3B333B] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A7B49A] transition-all duration-500"
              style={{ width: `${taskCompletionPercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 truncate">
            {event.tasks.filter((t) => t.status !== 'completed').length} milestones remaining
          </div>
        </div>

        {/* Guest RSVP Card */}
        <div
          onClick={() => onNavigateTab('guests')}
          className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/60 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">Guest RSVPs</span>
            <Users className="w-4 h-4 text-[#D8BC91]" />
          </div>
          <div className="text-2xl font-serif text-[#F4EEE5] font-semibold">
            {confirmedGuests} / {event.guestCount} <span className="text-xs text-gray-400 font-sans">Attending</span>
          </div>
          <div className="w-full h-1.5 bg-[#3B333B] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E5C384] transition-all duration-500"
              style={{ width: `${Math.min(100, rsvpPercentage)}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400">
            {event.guests.filter((g) => g.status === 'invited').length} pending responses
          </div>
        </div>

        {/* Vendors Booked Card */}
        <div
          onClick={() => onNavigateTab('vendors')}
          className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/60 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">Vendors Matchbook</span>
            <Sparkles className="w-4 h-4 text-[#D8BC91]" />
          </div>
          <div className="text-2xl font-serif text-[#F4EEE5] font-semibold">
            {event.vendors.filter((v) => v.status === 'booked').length} Booked
          </div>
          <div className="text-[11px] text-gray-400 flex items-center justify-between pt-2">
            <span>{event.vendors.filter((v) => v.status === 'quoted').length} Quoted</span>
            <ChevronRight className="w-4 h-4 text-[#D8BC91] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. PLAN INTEGRITY AUDIT & AI NEXT STEPS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Smart Next Steps (2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D8BC91]" />
              <h2 className="text-2xl font-serif text-[#F4EEE5]">Smart Next Steps</h2>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs text-[#D8BC91] hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {event.nextSteps.map((step) => (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        step.priority === 'high' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <h3 className="text-sm font-semibold text-[#F4EEE5]">{step.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 pl-4">{step.reason}</p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 font-mono">Target: {step.deadline}</span>
                  <button
                    onClick={() => onOpenCopilotWithQuery(`Help me execute next step: "${step.title}"`)}
                    className="px-3 py-1.5 rounded-lg bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs text-[#D8BC91] font-medium transition-colors"
                  >
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Action Presets */}
          <div className="p-4 rounded-xl bg-[#29252A]/60 border border-[#3B333B] space-y-3">
            <div className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">
              Ask ÉLAN Intelligence
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Reduce estimated costs by 15% without losing quality',
                'What happens to budget if I add 30 guests?',
                'Draft enquiry to caterer',
                'Suggest an outdoor venue rain backup plan',
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => onOpenCopilotWithQuery(query)}
                  className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] hover:border-[#D8BC91] text-xs text-gray-300 hover:text-white transition-all text-left"
                >
                  ✨ {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Plan Integrity Check Drawer */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A7B49A]" />
              <h2 className="text-2xl font-serif text-[#F4EEE5]">Integrity Audit</h2>
            </div>
            <span className="text-xs text-[#A7B49A] font-mono">{integrityReport.healthScore}/100</span>
          </div>

          <div className="space-y-3">
            {integrityReport.issues.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#29252A] border border-[#3B333B] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#A7B49A] mx-auto" />
                <h3 className="text-sm font-semibold text-white">All Integrity Checks Passed</h3>
                <p className="text-xs text-gray-400">Budget, vendor allocation, and timelines are in perfect balance.</p>
              </div>
            ) : (
              integrityReport.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    issue.type === 'error'
                      ? 'bg-red-950/20 border-red-800/40 text-red-200'
                      : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <h3 className="text-xs font-semibold">{issue.title}</h3>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">{issue.description}</p>
                  {issue.suggestedAction && (
                    <div className="pt-2 border-t border-current/20 flex items-center justify-between">
                      <span className="text-[10px] font-medium italic">{issue.suggestedAction}</span>
                      <button
                        onClick={() => onOpenCopilotWithQuery(`Fix integrity issue: ${issue.title}`)}
                        className="text-[11px] font-bold underline"
                      >
                        Auto-Fix
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
