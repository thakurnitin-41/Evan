import React, { useState } from 'react';
import { EventType, OnboardingInput } from '../types/event';
import { Sparkles, X, Wand2, Calendar, DollarSign, Users, MapPin, Check, Loader2 } from 'lucide-react';

interface OnboardingModalProps {
  initialType?: EventType;
  onClose: () => void;
  onSubmit: (input: OnboardingInput) => Promise<void>;
  isLoading: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialType = 'wedding',
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState<'brief' | 'details'>('brief');
  const [eventType, setEventType] = useState<EventType>(initialType);

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budget, setBudget] = useState<number>(500000);
  const [currency, setCurrency] = useState('₹');
  const [styleVibe, setStyleVibe] = useState('Atmospheric Luxury & Warm Candlelight');
  const [culturalPreferences, setCulturalPreferences] = useState('');
  const [dietaryAccessibility, setDietaryAccessibility] = useState('');
  const [sustainability, setSustainability] = useState(false);
  const [brief, setBrief] = useState('');

  // Selected Priorities
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Atmospheric Staging',
    'Curated Menu',
    'Documentary Photography',
  ]);

  const priorityOptionsMap: Record<EventType, string[]> = {
    wedding: ['Atmospheric Staging', 'Curated Menu', 'Documentary Photography', 'Live Acoustic Music', 'Palace Stay'],
    birthday: ['Signature Cocktails', 'Live DJ & Lighting', 'Custom Birthday Cake', 'VIP Lounge', 'Photo Backdrop'],
    community: ['Zero-Waste Setup', 'Local Food Stalls', 'Kids Workshops', 'Acoustic Stage', 'Volunteer Station'],
    custom: ['Premium Catering', 'Private Venue', 'Custom Styling', 'Audio-Visual Tech', 'Guest Keepsakes'],
  };

  const togglePriority = (p: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleQuickPreset = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTitle('Royal Udaipur Palace Wedding');
      setLocation('Fateh Garh Palace, Udaipur');
      setBudget(1200000);
      setGuestCount(150);
      setCurrency('₹');
      setStyleVibe('Regal Heritage & Twilight Candlelight');
      setBrief('A grand royal wedding in a heritage palace courtyard featuring warm candlelit decor, marigold garlands, and authentic Rajasthani folk music.');
    } else if (type === 'birthday') {
      setTitle('Midnight Skyline 21st Birthday');
      setLocation('Rooftop Lounge, Mumbai');
      setBudget(100000);
      setGuestCount(40);
      setCurrency('₹');
      setStyleVibe('Chic Noir & Amber Filament Glow');
      setBrief('A stylish 21st birthday gathering on a city rooftop with ambient fairy lights, artisanal cocktails, and a deep house DJ.');
    } else if (type === 'community') {
      setTitle('Solstice Community Harvest Fair');
      setLocation('Botanical Eco Park, Bengaluru');
      setBudget(75000);
      setGuestCount(200);
      setCurrency('₹');
      setStyleVibe('Zero-Waste Organic Botanical Simplicity');
      setSustainability(true);
      setBrief('An eco-conscious community festival with zero single-use plastics, local artisanal stalls, acoustic folk jams, and wooden picnic benches.');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `${eventType.toUpperCase()} Celebration`;
    const finalLocation = location.trim() || 'City Venue';

    await onSubmit({
      title: finalTitle,
      type: eventType,
      date,
      location: finalLocation,
      guestCount,
      budget,
      currency,
      culturalPreferences,
      styleVibe,
      priorities: selectedPriorities,
      dietaryAccessibility,
      sustainability,
      brief: brief.trim() || `A ${eventType} event planned for ${guestCount} guests at ${finalLocation}.`,
    });
  };

  const [loadingStep, setLoadingStep] = useState(0);

  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const loadingStepsText = [
    'Synthesizing atmospheric theme & color directions...',
    'Calculating itemized budget & contingency reserve...',
    'Curating living milestones & task dependencies...',
    'Finalizing ÉLAN Intelligence event blueprint...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#211721] border border-[#3B333B] rounded-2xl shadow-2xl overflow-hidden my-8 text-[#F4EEE5]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3B333B] bg-[#29252A]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D8BC91]" />
            <h2 className="text-xl font-serif text-[#F4EEE5]">ÉLAN Event Studio</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#3B333B] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay State */}
        {isLoading ? (
          <div className="p-12 text-center space-y-6 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#D8BC91] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#A7B49A] absolute" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-[#F4EEE5]">Designing Your Event Concept</h3>
              <p className="text-xs text-[#D8BC91] font-mono transition-all font-medium">
                {loadingStepsText[loadingStep]}
              </p>
            </div>
            {/* Rapid Skeleton Preview */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-[#29252A] border border-[#3B333B] space-y-3">
              <div className="h-4 bg-[#3B333B] rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-[#3B333B] rounded w-1/2 animate-pulse" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-8 bg-[#3B333B] rounded animate-pulse" />
                <div className="h-8 bg-[#3B333B] rounded animate-pulse" />
                <div className="h-8 bg-[#3B333B] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
            
            {/* Event Type Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-[#A7B49A] uppercase tracking-wider mb-2">
                1. Event Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'wedding' as EventType, label: 'Wedding' },
                  { type: 'birthday' as EventType, label: 'Birthday' },
                  { type: 'community' as EventType, label: 'Community' },
                  { type: 'custom' as EventType, label: 'Custom' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleQuickPreset(item.type)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      eventType === item.type
                        ? 'bg-[#D8BC91] text-[#211721] border-[#D8BC91] font-semibold'
                        : 'bg-[#29252A] text-gray-300 border-[#3B333B] hover:border-[#D8BC91]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Natural Language Vision Brief */}
            <div>
              <label className="block text-xs font-semibold text-[#A7B49A] uppercase tracking-wider mb-1">
                2. Natural-Language Vision Brief
              </label>
              <p className="text-[11px] text-gray-400 mb-2">
                Describe your vision in plain English — aesthetic goals, key moments, dietary needs, or vibe.
              </p>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. A sunset garden wedding for 150 guests with warm candlelight, pure vegetarian feast, acoustic music, and no plastic waste..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-[#F4EEE5] placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            {/* Key Event Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Event Name / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Udaipur Royal Heritage Wedding"
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Destination / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fateh Garh Palace, Udaipur"
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Event Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Guest Count</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  min={5}
                  max={2000}
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Total Budget</label>
                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-[#D8BC91] font-semibold outline-none"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="AED">AED</option>
                  </select>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    step={5000}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Style / Vibe Direction</label>
                <input
                  type="text"
                  value={styleVibe}
                  onChange={(e) => setStyleVibe(e.target.value)}
                  placeholder="e.g. Minimalist Editorial Chic"
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Cultural & Dietary Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Cultural Preferences</label>
                <input
                  type="text"
                  value={culturalPreferences}
                  onChange={(e) => setCulturalPreferences(e.target.value)}
                  placeholder="e.g. Sangeet + Phoolon ki Holi traditions"
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Dietary & Accessibility Needs</label>
                <input
                  type="text"
                  value={dietaryAccessibility}
                  onChange={(e) => setDietaryAccessibility(e.target.value)}
                  placeholder="e.g. Jain Veg, Nut Allergy, Ramp access"
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Priorities Selector Chips */}
            <div>
              <label className="block text-xs font-semibold text-[#A7B49A] uppercase tracking-wider mb-2">
                3. Key Priorities
              </label>
              <div className="flex flex-wrap gap-2">
                {(priorityOptionsMap[eventType] || []).map((p) => {
                  const isSelected = selectedPriorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePriority(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#3B333B] text-[#D8BC91] border border-[#D8BC91]'
                          : 'bg-[#29252A] text-gray-400 border border-[#3B333B] hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sustainability Checkbox */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#3B333B]">
              <input
                type="checkbox"
                id="sustainability-check"
                checked={sustainability}
                onChange={(e) => setSustainability(e.target.checked)}
                className="w-4 h-4 accent-[#D8BC91] rounded"
              />
              <label htmlFor="sustainability-check" className="text-xs text-gray-300 cursor-pointer">
                Enforce Zero-Waste & Sustainable Procurement Standards
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3B333B]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#29252A] text-gray-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] font-semibold text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Generate Plan with ÉLAN Intelligence</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
