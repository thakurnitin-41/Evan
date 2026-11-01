import React, { useState } from 'react';
import { Event } from '../types/event';
import { Sparkles, Plus, Calendar, ChevronDown, Check, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';

interface NavigationProps {
  events: Event[];
  activeEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onOpenCreate: () => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenCopilot: () => void;
  integrityScore: number;
  onOpenIntegrity: () => void;
  isLanding: boolean;
  onGoHome: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreate,
  activeTab,
  onChangeTab,
  onOpenCopilot,
  integrityScore,
  onOpenIntegrity,
  isLanding,
  onGoHome,
}) => {
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'budget', label: 'Budget Reality' },
    { id: 'timeline', label: 'Living Timeline' },
    { id: 'vendors', label: 'Vendor Matchbook' },
    { id: 'moodboard', label: 'Moodboard' },
    { id: 'guests', label: 'Guests & RSVP' },
    { id: 'command', label: 'Command Center' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#211721]/95 backdrop-blur-md border-b border-[#3B333B]">
      {/* Primary Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark & Back Button */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {!isLanding && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#29252A] hover:bg-[#3B333B] text-xs font-medium text-[#D8BC91] hover:text-white border border-[#3B333B] transition-colors shrink-0"
              title="Back to All Events Showcase"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D8BC91]" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="text-[#D8BC91] font-serif text-2xl font-semibold tracking-wider hover:text-[#E5C384] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
          >
            <span>EVAN.</span>
            <span className="hidden sm:inline-block text-xs font-sans tracking-widest text-[#A7B49A] uppercase font-light">
              · Event Studio
            </span>
          </button>

          {/* Active Event Selector Dropdown */}
          {!isLanding && activeEvent && (
            <div className="relative">
              <button
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/50 text-xs text-[#F4EEE5] transition-all max-w-[220px]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D8BC91] shrink-0" />
                <span className="truncate font-medium">{activeEvent.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>

              {eventDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#29252A] border border-[#3B333B] shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#A7B49A] uppercase tracking-wider border-b border-[#3B333B]">
                    Select Event Plan
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt);
                          setEventDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#3B333B]/60 transition-colors ${
                          evt.id === activeEvent.id ? 'text-[#D8BC91] font-semibold bg-[#3B333B]/40' : 'text-gray-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate">{evt.title}</p>
                          <p className="text-[10px] text-gray-400 capitalize">
                            {evt.type} · {evt.currency}{evt.budget.toLocaleString()}
                          </p>
                        </div>
                        {evt.id === activeEvent.id && <Check className="w-3.5 h-3.5 text-[#D8BC91] shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#3B333B]">
                    <button
                      onClick={() => {
                        setEventDropdownOpen(false);
                        onOpenCreate();
                      }}
                      className="w-full text-center py-1.5 px-3 rounded-lg bg-[#D8BC91]/10 text-[#D8BC91] hover:bg-[#D8BC91]/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links / View Switcher */}
        {!isLanding && (
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg ${
                    isActive
                      ? 'text-[#211721] bg-[#D8BC91] font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-[#F4EEE5] hover:bg-[#29252A]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {!isLanding && (
            <>
              {/* Integrity Score Badge */}
              <button
                onClick={onOpenIntegrity}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] hover:border-[#A7B49A]/60 text-xs text-gray-300 transition-colors"
                title="Plan Integrity Score"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#A7B49A]" />
                <span className="font-mono text-[11px] text-[#A7B49A] font-medium">{integrityScore}%</span>
              </button>

              {/* ÉLAN Intelligence Copilot Button */}
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D8BC91]/15 text-[#D8BC91] hover:bg-[#D8BC91]/25 border border-[#D8BC91]/30 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D8BC91]" />
                <span className="hidden xs:inline">AI Copilot</span>
              </button>
            </>
          )}

          {/* Create Event CTA */}
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-lg bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold tracking-wide shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      {!isLanding && (
        <div className="lg:hidden border-t border-[#3B333B] bg-[#29252A] px-4 py-2 overflow-x-auto flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-[#D8BC91] text-[#211721] font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
