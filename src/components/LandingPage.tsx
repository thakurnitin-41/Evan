import React from 'react';
import { Event, EventType } from '../types/event';
import { Sparkles, Calendar, DollarSign, Users, ArrowRight, Shield, Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface LandingPageProps {
  sampleEvents: Event[];
  onSelectSampleEvent: (event: Event) => void;
  onOpenCreateWithType: (type: EventType) => void;
  onOpenCreateGeneral: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  sampleEvents,
  onSelectSampleEvent,
  onOpenCreateWithType,
  onOpenCreateGeneral,
}) => {
  return (
    <div className="min-h-screen bg-[#211721] text-[#F4EEE5] overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Cinematic Backdrop Image with Overlay Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SafeImage
            src="/images/elan_hero_wedding_1793474322640.jpg"
            alt="Luxury Event Atmosphere"
            fallbackTitle="EVAN. Event Atmosphere"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transform filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211721] via-[#211721]/70 to-[#211721]/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Subtitle / Brand Kicker */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D8BC91] font-medium px-4 py-1.5 rounded-full bg-[#29252A]/80 border border-[#D8BC91]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BC91]" />
            <span>AI Event Studio · Big moments. Thoughtfully made.</span>
          </div>

          {/* Expressive Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#F4EEE5] tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Your vision. Every detail. <br />
            <span className="italic font-normal text-[#D8BC91]">Beautifully in place.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-[#F4EEE5]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Transform natural-language briefs into editable, budget-aware, multi-vendor event plans with real-time what-if simulations and living timelines.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenCreateGeneral}
              className="px-8 py-4 rounded-xl bg-[#D8BC91] text-[#211721] font-semibold text-base hover:bg-[#E5C384] transition-all shadow-xl hover:shadow-[#D8BC91]/20 flex items-center gap-2 group"
            >
              <span>Create Your Event</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#demos"
              className="px-8 py-4 rounded-xl bg-[#29252A]/90 text-[#F4EEE5] border border-[#3B333B] hover:border-[#D8BC91]/60 font-medium text-base hover:bg-[#3B333B] transition-all backdrop-blur-md"
            >
              Explore Demo Scenarios
            </a>
          </div>

          {/* Unboxed Metadata Trust Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#A7B49A] font-medium">
            <span>Deterministic Budget Simulator</span>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <span>Living Milestones</span>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <span>Context-Aware EVAN. Intelligence</span>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <span>Zero AI Slop Guarantee</span>
          </div>
        </div>
      </section>

      {/* 2. EVENT TYPE SELECTOR CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#3B333B]/50">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F4EEE5]">Crafted for any milestone</h2>
          <p className="text-sm text-gray-400 mt-2">Select an event category to launch a tailored onboarding studio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              type: 'wedding' as EventType,
              title: 'Weddings & Receptions',
              desc: 'Heritage palaces, beachside retreats, or intimate luxury banquets with cultural decor.',
              tag: 'Full Multi-Vendor Suite',
            },
            {
              type: 'birthday' as EventType,
              title: 'Milestone Birthdays',
              desc: 'Rooftop cocktail soirees, themed galas, and bespoke dinner celebrations.',
              tag: 'Curated Guest Roster',
            },
            {
              type: 'community' as EventType,
              title: 'Community & Fairs',
              desc: 'Sustainable zero-waste festivals, artisanal markets, and regional gatherings.',
              tag: 'Eco & Zero-Plastic Focus',
            },
            {
              type: 'custom' as EventType,
              title: 'Bespoke Celebrations',
              desc: 'Anniversaries, gallery launches, executive retreats, and private dinners.',
              tag: 'Flexible Parameter Studio',
            },
          ].map((card) => (
            <div
              key={card.type}
              onClick={() => onOpenCreateWithType(card.type)}
              className="group cursor-pointer p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91] transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-[#D8BC91] uppercase tracking-wider mb-2">
                  {card.tag}
                </div>
                <h3 className="text-xl font-serif text-[#F4EEE5] group-hover:text-[#D8BC91] transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#3B333B] flex items-center justify-between text-xs font-semibold text-[#D8BC91] group-hover:translate-x-1 transition-transform">
                <span>Start Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DEMO PLAN SHOWCASE (ONE-CLICK JUDGE LOADERS) */}
      <section id="demos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-semibold">
              Live Showcase · One-Click Exploration
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F4EEE5] mt-1">
              Explore production event plans
            </h2>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            Click any demo scenario to immediately enter the complete workspace with live budget calculations, living timeline, vendor matchbook, and AI copilot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sampleEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectSampleEvent(event)}
              className="group cursor-pointer rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91] overflow-hidden transition-all hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <SafeImage
                  src={event.concept.moodboardImage}
                  alt={event.title}
                  fallbackTitle={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#29252A] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#211721]/80 backdrop-blur-md text-xs font-medium text-[#D8BC91] capitalize border border-[#3B333B]">
                  {event.type}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif text-[#F4EEE5] group-hover:text-[#D8BC91] transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{event.brief}</p>
                </div>

                {/* Unboxed Metadata */}
                <div className="text-xs text-gray-300 font-medium flex items-center gap-2 pt-2 border-t border-[#3B333B]">
                  <span>{event.currency}{event.budget.toLocaleString()} Total</span>
                  <span aria-hidden="true" className="text-gray-600">·</span>
                  <span>{event.guestCount} Guests</span>
                  <span aria-hidden="true" className="text-gray-600">·</span>
                  <span>{event.location.split(',')[0]}</span>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-[#3B333B] group-hover:bg-[#D8BC91] text-xs font-semibold text-[#F4EEE5] group-hover:text-[#211721] transition-all flex items-center justify-center gap-2">
                  <span>Open Full Event Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUCT DEMONSTRATION & ARCHITECTURE STORYTELLING */}
      <section className="bg-[#29252A]/60 border-y border-[#3B333B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F4EEE5]">
              Engineered for absolute plan integrity
            </h2>
            <p className="text-sm text-gray-400 mt-3">
              How EVAN. combines generative AI personalization with rigorous deterministic financial logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#211721] border border-[#3B333B] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8BC91]/10 flex items-center justify-center text-[#D8BC91]">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#F4EEE5]">Budget Reality Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Deterministic calculation of estimated vs actual costs, vendor deposits, and contingency reserves. Overspending is flagged instantly with what-if trade-off suggestions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#211721] border border-[#3B333B] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A7B49A]/10 flex items-center justify-center text-[#A7B49A]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#F4EEE5]">Living Milestones</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Date-aware task generator with dependencies and calendar tracking. If your event date shifts, EVAN. recalculates target dates and flags scheduling conflicts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#211721] border border-[#3B333B] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5C384]/10 flex items-center justify-center text-[#E5C384]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-[#F4EEE5]">EVAN. Intelligence Copilot</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Context-aware conversational assistant powered by Gemini 3.8 Flash. Analyzes stored event data to simulate headcount changes, trim costs by 15%, or draft vendor enquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 border-t border-[#3B333B]/40">
        <div className="font-serif text-[#D8BC91] text-lg">EVAN. — Big moments. Thoughtfully made.</div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <span>Powered by Gemini 3.8 Flash</span>
          <span>·</span>
          <span>React + TypeScript + Tailwind</span>
        </div>
      </footer>

    </div>
  );
};
