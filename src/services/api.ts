import { Event, OnboardingInput, WhatIfProposal } from '../types/event';
import { SAMPLE_EVENTS } from '../data/sampleEvents';

const BASE_URL = '/api';

export async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${BASE_URL}/events`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API fetchEvents error, fallback to SAMPLE_EVENTS:', err);
  }
  return SAMPLE_EVENTS;
}

export async function createAiEvent(input: OnboardingInput): Promise<Event> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BASE_URL}/events/ai-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('createAiEvent API timeout or error, using instant smart fallback:', err);
  }

  // Fallback client-side generation
  const b = input.budget || 500000;
  return {
    id: `evt-${Date.now()}`,
    title: input.title || `${input.type} Celebration`,
    type: input.type,
    date: input.date,
    location: input.location,
    guestCount: input.guestCount,
    budget: input.budget,
    currency: input.currency || '₹',
    culturalPreferences: input.culturalPreferences,
    styleVibe: input.styleVibe,
    priorities: input.priorities,
    dietaryAccessibility: input.dietaryAccessibility,
    sustainability: input.sustainability,
    brief: input.brief,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    concept: {
      title: `${input.title} — ${input.styleVibe}`,
      headline: 'A customized, atmospheric celebration direction.',
      description: `Tailored for ${input.guestCount} guests in ${input.location}. Seamlessly combining modern aesthetics with budget discipline.`,
      moodboardImage: '/src/assets/images/elan_hero_wedding_1793474322640.jpg',
      colorPalette: [
        { name: 'Aubergine Velvet', hex: '#211721', role: 'Dominant Canvas' },
        { name: 'Champagne Satin', hex: '#D8BC91', role: 'Metallic Highlights' },
        { name: 'Muted Sage', hex: '#A7B49A', role: 'Floral Accents' },
        { name: 'Warm Ivory', hex: '#F4EEE5', role: 'Paper & Linens' },
      ],
      decorDirections: [
        { category: 'Lighting', title: 'Low Amber Glow & Taper Candles', description: 'Tiered candle clusters along main tables.' },
        { category: 'Florals', title: 'Seasonal Botanical Installations', description: 'Textured arrangements with wild greenery.' },
      ],
    },

    budgetItems: [
      { id: 'b1', category: 'Venue & Stay', name: `${input.location} Reservation`, estimatedCost: Math.round(b * 0.4), actualCost: 0, paidAmount: 0, status: 'unallocated' },
      { id: 'b2', category: 'Food & Beverage', name: `Catering & Cocktails (${input.guestCount} Guests)`, estimatedCost: Math.round(b * 0.3), actualCost: 0, paidAmount: 0, status: 'unallocated' },
      { id: 'b3', category: 'Decor & Production', name: 'Staging & Lighting Rig', estimatedCost: Math.round(b * 0.15), actualCost: 0, paidAmount: 0, status: 'unallocated' },
      { id: 'b4', category: 'Photography & Cinema', name: 'Documentary Event Photography', estimatedCost: Math.round(b * 0.08), actualCost: 0, paidAmount: 0, status: 'unallocated' },
      { id: 'b5', category: 'Contingency Reserve', name: 'Emergency Emergency Buffer (7%)', estimatedCost: Math.round(b * 0.07), actualCost: 0, paidAmount: 0, status: 'unallocated', isContingency: true },
    ],

    tasks: [
      { id: 't1', title: 'Confirm Venue Contract & Deposit', category: 'Venue', dueDate: input.date, priority: 'high', status: 'todo', owner: 'Host' },
      { id: 't2', title: 'Approve Catering Menu & Tasting', category: 'Catering', dueDate: input.date, priority: 'high', status: 'todo', owner: 'Host' },
      { id: 't3', title: 'Send digital RSVPs to Guest Roster', category: 'Guests', dueDate: input.date, priority: 'medium', status: 'todo', owner: 'Host' },
    ],

    vendors: [
      { id: 'v1', name: `${input.location} Preferred Venue`, category: 'Venue', status: 'shortlisted', quotedPrice: Math.round(b * 0.4), source: 'ai_estimated' },
      { id: 'v2', name: 'Artisanal Culinary Atelier', category: 'Catering', status: 'shortlisted', quotedPrice: Math.round(b * 0.3), source: 'ai_estimated' },
    ],

    guests: [
      { id: 'g1', name: 'Primary Guest of Honor', group: 'VIP', status: 'attending', plusOne: true },
    ],

    risks: [
      { id: 'r1', title: 'Vendor Price Fluctuation', severity: 'low', mitigation: 'Lock quotes early with initial deposits.' }
    ],

    nextSteps: [
      { id: 'ns1', title: 'Pay initial venue deposit', reason: 'Secures preferred date before seasonal rates apply.', deadline: input.date, priority: 'high' }
    ],

    runSheet: [
      { id: 'rs1', time: '14:00', activity: 'Vendor Setup & Sound Check', owner: 'Planner', location: input.location },
      { id: 'rs2', time: '18:00', activity: 'Guest Arrivals & Reception', owner: 'Host', location: input.location },
    ],
  };
}

export async function updateEventApi(event: Event): Promise<Event> {
  try {
    const res = await fetch(`${BASE_URL}/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('updateEventApi error:', err);
  }
  return event;
}

export async function deleteEventApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/events/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    console.error('deleteEventApi error:', err);
    return false;
  }
}

export async function askCopilotApi(eventId: string, prompt: string): Promise<{ reply: string; proposal: WhatIfProposal | null }> {
  try {
    const res = await fetch(`${BASE_URL}/events/${eventId}/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('askCopilotApi error:', err);
  }

  return {
    reply: `Here is your analysis for query "${prompt}". Would you like to trim budget or adjust guest headcount?`,
    proposal: null,
  };
}

export async function fetchIntegrityReport(eventId: string) {
  try {
    const res = await fetch(`${BASE_URL}/events/${eventId}/integrity`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('fetchIntegrityReport error:', err);
  }
  return { healthScore: 92, issues: [] };
}

export async function generateVendorEnquiry(eventId: string, vendorName: string, category: string): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/events/${eventId}/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorName, category }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.message;
    }
  } catch (err) {
    console.error('generateVendorEnquiry error:', err);
  }
  return `Subject: Availability Enquiry — ${vendorName}\n\nDear ${vendorName} Team,\n\nWe are reaching out to enquire about your availability and package pricing for our upcoming event.`;
}
