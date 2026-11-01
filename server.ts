import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db/database.ts';
import { Event, OnboardingInput, WhatIfProposal } from './src/types/event.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // System Health & Database API Routes

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      service: 'EVAN. AI Event Planner Engine',
      timestamp: new Date().toISOString(),
      db: db.getStats(),
    });
  });

  // Database Stats endpoint
  app.get('/api/db/stats', (_req, res) => {
    res.json(db.getStats());
  });

  // Export DB Backup endpoint
  app.get('/api/db/export', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="evan_database_backup.json"');
    res.send(db.exportBackup());
  });

  // Reset DB endpoint
  app.post('/api/db/reset', (_req, res) => {
    const events = db.seed();
    res.json({ success: true, message: 'Database reset to sample events', count: events.length });
  });

  // Core Events CRUD API Routes

  // 1. GET /api/events - List all events
  app.get('/api/events', (_req, res) => {
    res.json(db.getAll());
  });

  // 2. GET /api/events/:id - Get single event by ID
  app.get('/api/events/:id', (req, res) => {
    const event = db.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  });

  // 3. POST /api/events - Create new event
  app.post('/api/events', (req, res) => {
    const newEvent: Event = req.body;
    if (!newEvent.id) {
      newEvent.id = `evt-${Date.now()}`;
    }
    const saved = db.save(newEvent);
    res.json(saved);
  });

  // 4. PUT /api/events/:id - Update existing event
  app.put('/api/events/:id', (req, res) => {
    const id = req.params.id;
    const existing = db.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const updated: Event = {
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };
    const saved = db.save(updated);
    res.json(saved);
  });

  // 5. DELETE /api/events/:id - Delete event
  app.delete('/api/events/:id', (req, res) => {
    const success = db.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  });

  // AI & Advanced Engine Routes

  // 6. POST /api/events/ai-generate: Create full plan from input brief
  app.post('/api/events/ai-generate', async (req, res) => {
    const input: OnboardingInput = req.body;
    const currency = input.currency || '₹';
    const isApiKeyPresent = Boolean(process.env.GEMINI_API_KEY);

    let generatedPlan: Partial<Event> | null = null;

    if (isApiKeyPresent) {
      try {
        const prompt = `You are EVAN.'s master event planner AI. Generate a comprehensive, highly realistic event plan based on this user brief:
Title: "${input.title}"
Event Type: ${input.type}
Date: ${input.date}
Location: ${input.location}
Guest Count: ${input.guestCount}
Budget: ${currency} ${input.budget}
Style/Vibe: ${input.styleVibe}
Priorities: ${input.priorities.join(', ')}
Cultural Preferences: ${input.culturalPreferences || 'None specified'}
Dietary & Accessibility: ${input.dietaryAccessibility || 'None specified'}
Sustainability Required: ${input.sustainability}
Natural Language Brief: "${input.brief}"

Return a valid JSON object matching this structure:
{
  "concept": {
    "title": "Short poetic theme title",
    "headline": "1 line expressive headline",
    "description": "2-3 sentences explaining visual & atmospheric direction",
    "moodboardImage": "/src/assets/images/elan_hero_wedding_1793474322640.jpg",
    "colorPalette": [
      { "name": "Color 1", "hex": "#HEX", "role": "Dominant Canvas" },
      { "name": "Color 2", "hex": "#HEX", "role": "Accents & Decor" },
      { "name": "Color 3", "hex": "#HEX", "role": "Secondary Detail" },
      { "name": "Color 4", "hex": "#HEX", "role": "Highlight" }
    ],
    "decorDirections": [
      { "category": "Lighting", "title": "Title", "description": "Details" },
      { "category": "Floral & Botanicals", "title": "Title", "description": "Details" },
      { "category": "Tablescape", "title": "Title", "description": "Details" }
    ]
  },
  "budgetItems": [
    { "category": "Venue & Stay", "name": "Specific item", "estimatedCost": 0, "actualCost": 0, "paidAmount": 0, "status": "unallocated", "notes": "note" }
  ],
  "tasks": [
    { "title": "Task name", "category": "Category", "dueDate": "YYYY-MM-DD", "priority": "high", "status": "todo", "owner": "Planner / Host" }
  ],
  "vendors": [
    { "name": "Vendor Name", "category": "Category", "status": "shortlisted", "quotedPrice": 0, "source": "ai_estimated" }
  ],
  "risks": [
    { "title": "Risk description", "severity": "medium", "mitigation": "Solution action" }
  ],
  "nextSteps": [
    { "title": "Action title", "reason": "Why this matters", "deadline": "YYYY-MM-DD", "priority": "high" }
  ],
  "runSheet": [
    { "time": "14:00", "activity": "Activity name", "owner": "Lead person", "location": "Spot" }
  ]
}

Ensure sum of estimated costs equals around 90-95% of total budget ${input.budget}, allocating 5-10% to Contingency Reserve!`;

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        // Race with a 2.5 second timeout so the user never waits long
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        if (response && response.text) {
          generatedPlan = JSON.parse(response.text);
        }
      } catch (err) {
        console.error('Gemini generateContent error or timeout, using instant smart template:', err);
      }
    }

    // Smart template fallback if AI call wasn't made or failed
    if (!generatedPlan) {
      const b = input.budget || 500000;
      const moodImage =
        input.type === 'wedding'
          ? '/src/assets/images/elan_moodboard_palace_1793474323686.jpg'
          : input.type === 'birthday'
          ? '/src/assets/images/elan_moodboard_rooftop_1793474324352.jpg'
          : '/src/assets/images/elan_moodboard_community_1793474324079.jpg';

      generatedPlan = {
        concept: {
          title: `${input.title} — ${input.styleVibe || 'Thoughtful Elegance'}`,
          headline: `A personalized ${input.type} vision beautifully brought to life.`,
          description: `Designed for ${input.guestCount} guests in ${input.location}. Combining ${input.styleVibe} aesthetics with seamless timeline execution.`,
          moodboardImage: moodImage,
          colorPalette: [
            { name: 'Aubergine Velvet', hex: '#211721', role: 'Dominant Surface' },
            { name: 'Champagne Satin', hex: '#D8BC91', role: 'Metallic Accents' },
            { name: 'Botanical Sage', hex: '#A7B49A', role: 'Foliage & Florals' },
            { name: 'Warm Ivory', hex: '#F4EEE5', role: 'Linens & Paperwork' },
          ],
          decorDirections: [
            { category: 'Atmosphere & Lighting', title: 'Warm Filament Globes & Candle Tiering', description: 'Layered warm ambient lights highlighting venue textures.' },
            { category: 'Floral & Accents', title: 'Curated Seasonal Botanicals', description: 'Textured arrangements aligned with sustainability goals.' },
            { category: 'Dining & Hospitality', title: 'Custom Curated Menu & Bar', description: `Specially catering to ${input.dietaryAccessibility || 'diverse guest preferences'}.` },
          ],
        },
        budgetItems: [
          { id: 'b1', category: 'Venue & Infrastructure', name: `${input.location} Space Reservation`, estimatedCost: Math.round(b * 0.4), actualCost: 0, paidAmount: 0, status: 'unallocated', notes: 'Includes baseline setup' },
          { id: 'b2', category: 'Food & Beverage', name: `Catering & Drinks (${input.guestCount} Pax)`, estimatedCost: Math.round(b * 0.3), actualCost: 0, paidAmount: 0, status: 'unallocated' },
          { id: 'b3', category: 'Decor & Production', name: `${input.styleVibe} Styling & Lighting`, estimatedCost: Math.round(b * 0.15), actualCost: 0, paidAmount: 0, status: 'unallocated' },
          { id: 'b4', category: 'Media & Memories', name: 'Documentary Photography & Videography', estimatedCost: Math.round(b * 0.08), actualCost: 0, paidAmount: 0, status: 'unallocated' },
          { id: 'b5', category: 'Contingency Reserve', name: 'Unforeseen Buffer Reserve (7%)', estimatedCost: Math.round(b * 0.07), actualCost: 0, paidAmount: 0, status: 'unallocated', isContingency: true },
        ],
        tasks: [
          { id: 't1', title: 'Site Inspection & Venue Finalization', category: 'Venue', dueDate: input.date, priority: 'high', status: 'todo', owner: 'Host' },
          { id: 't2', title: 'Sample Food Tasting & Dietary Lock', category: 'Catering', dueDate: input.date, priority: 'high', status: 'todo', owner: 'Host' },
          { id: 't3', title: 'Distribute Digital RSVPs & Collect Requests', category: 'Guests', dueDate: input.date, priority: 'medium', status: 'todo', owner: 'Host' },
          { id: 't4', title: 'Lock Production Timeline with Lead Vendor', category: 'Execution', dueDate: input.date, priority: 'high', status: 'todo', owner: 'Host' },
        ],
        vendors: [
          { id: 'v1', name: `${input.location} Preferred Venue Partner`, category: 'Venue', status: 'shortlisted', quotedPrice: Math.round(b * 0.4), source: 'ai_estimated' },
          { id: 'v2', name: 'Artisanal Feast & Culinary Atelier', category: 'Catering', status: 'shortlisted', quotedPrice: Math.round(b * 0.3), source: 'ai_estimated' },
          { id: 'v3', name: 'Lumina Sound & Lighting Production', category: 'Decor', status: 'shortlisted', quotedPrice: Math.round(b * 0.15), source: 'ai_estimated' },
        ],
        guests: [
          { id: 'g1', name: 'Primary Guest of Honor', group: 'VIP', status: 'attending', plusOne: true },
          { id: 'g2', name: 'Core Family / Organizers', group: 'Family', status: 'attending', plusOne: false },
        ],
        risks: [
          { id: 'r1', title: 'Weather Fluctuation Alert', severity: 'medium', mitigation: 'Confirm waterproof backup awning with venue 5 days prior.' },
          { id: 'r2', title: 'Vendor Last-minute Overrun', severity: 'low', mitigation: 'Keep 7% contingency reserve untouched.' },
        ],
        nextSteps: [
          { id: 'ns1', title: 'Pay initial venue deposit', reason: 'Locks venue date before peak season rates apply.', deadline: input.date, priority: 'high' },
          { id: 'ns2', title: 'Finalize dietary headcount', reason: 'Avoids surplus food waste and caterer penalties.', deadline: input.date, priority: 'high' },
        ],
        runSheet: [
          { id: 'rs1', time: '12:00', activity: 'Vendor Arrival & Setup Begins', owner: 'Planner', location: input.location },
          { id: 'rs2', time: '17:00', activity: 'Guest Welcome & Apertifs', owner: 'Host', location: input.location },
          { id: 'rs3', time: '19:30', activity: 'Main Celebration & Feast', owner: 'Catering Lead', location: input.location },
        ],
      };
    }

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: input.title || `${input.type.toUpperCase()} Event`,
      type: input.type,
      date: input.date,
      location: input.location,
      guestCount: input.guestCount,
      budget: input.budget,
      currency: currency,
      culturalPreferences: input.culturalPreferences,
      styleVibe: input.styleVibe,
      priorities: input.priorities,
      dietaryAccessibility: input.dietaryAccessibility,
      sustainability: input.sustainability,
      brief: input.brief,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      concept: generatedPlan.concept!,
      budgetItems: (generatedPlan.budgetItems || []).map((bi, idx) => ({ ...bi, id: bi.id || `bi-${idx}` })),
      tasks: (generatedPlan.tasks || []).map((t, idx) => ({ ...t, id: t.id || `t-${idx}` })),
      vendors: (generatedPlan.vendors || []).map((v, idx) => ({ ...v, id: v.id || `v-${idx}` })),
      guests: (generatedPlan.guests || []).map((g, idx) => ({ ...g, id: g.id || `g-${idx}` })),
      risks: (generatedPlan.risks || []).map((r, idx) => ({ ...r, id: r.id || `r-${idx}` })),
      nextSteps: (generatedPlan.nextSteps || []).map((ns, idx) => ({ ...ns, id: ns.id || `ns-${idx}` })),
      runSheet: (generatedPlan.runSheet || []).map((rs, idx) => ({ ...rs, id: rs.id || `rs-${idx}` })),
    };

    db.save(newEvent);
    res.json(newEvent);
  });

  // 7. POST /api/events/:id/copilot: Context-aware query & What-If proposal generator
  app.post('/api/events/:id/copilot', async (req, res) => {
    const eventId = req.params.id;
    const { prompt } = req.body;
    const event = db.getById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isApiKeyPresent = Boolean(process.env.GEMINI_API_KEY);
    let replyText = '';
    let proposal: WhatIfProposal | null = null;

    if (isApiKeyPresent) {
      try {
        const sysInstruction = `You are EVAN. Intelligence, an elite AI event planner & financial strategist.
Context:
Event Title: "${event.title}" (${event.type})
Date: ${event.date}, Location: ${event.location}
Guests: ${event.guestCount}, Total Budget: ${event.currency}${event.budget}
Current Budget Breakdown: ${JSON.stringify(event.budgetItems.map(b => ({ cat: b.category, name: b.name, est: b.estimatedCost, act: b.actualCost })))}

Respond to the user prompt directly. If the prompt requests a modification to the plan (such as changing guest count, reducing budget by X%, reallocating funds, adding vendors, or changing priorities), generate a What-If Proposal in JSON format!

Return JSON structure:
{
  "reply": "Clear, direct, elegant explanation of your recommendation or response.",
  "proposal": {
    "summary": "1 sentence proposal headline",
    "explanation": "Trade-off analysis of why this decision makes sense",
    "tradeOffs": ["Trade-off 1", "Trade-off 2"],
    "newBudgetTotal": 1200000,
    "newGuestCount": 180,
    "budgetDeltas": [
      { "category": "Catering", "oldAmount": 300000, "newAmount": 350000, "reason": "Added 30 plates at ₹1666/head" }
    ],
    "taskChanges": ["Add task: Update caterer seating grid", "Adjust deposit date"]
  }
}
If no plan modification is requested (e.g. asking a question), leave "proposal": null.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: sysInstruction,
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        replyText = parsed.reply || 'Here is your EVAN. plan analysis.';
        if (parsed.proposal) {
          proposal = {
            id: `prop-${Date.now()}`,
            summary: parsed.proposal.summary,
            explanation: parsed.proposal.explanation,
            tradeOffs: parsed.proposal.tradeOffs || [],
            newBudgetTotal: parsed.proposal.newBudgetTotal || event.budget,
            newGuestCount: parsed.proposal.newGuestCount || event.guestCount,
            budgetDeltas: parsed.proposal.budgetDeltas || [],
            taskChanges: parsed.proposal.taskChanges || [],
            recommended: true,
          };
        }
      } catch (err) {
        console.error('Copilot Gemini error:', err);
      }
    }

    // Fallback logic if API key missing or parse failed
    if (!replyText) {
      const lower = (prompt || '').toLowerCase();
      if (lower.includes('guest') || lower.includes('add') || lower.includes('increase')) {
        const extraGuests = 30;
        const newCount = event.guestCount + extraGuests;
        const perHeadCost = Math.round((event.budget * 0.35) / event.guestCount);
        const extraCatering = perHeadCost * extraGuests;

        replyText = `Adding ${extraGuests} guests increases your guest count to ${newCount}. Catering and seating costs will increase by approximately ${event.currency}${extraCatering.toLocaleString()}. I have prepared a What-If simulation below to show the exact trade-offs.`;
        proposal = {
          id: `prop-${Date.now()}`,
          summary: `Expand Headcount to ${newCount} Guests`,
          explanation: `Increasing guests from ${event.guestCount} to ${newCount} requires expanding food & beverage allocation by ${event.currency}${extraCatering.toLocaleString()} while trimming non-essential floral installations.`,
          tradeOffs: [
            `Catering cost increases by ${event.currency}${extraCatering.toLocaleString()}`,
            'Decor & staging budget trimmed by 8% to maintain overall total',
            'Requires 3 extra 10-seater tables',
          ],
          newBudgetTotal: event.budget,
          newGuestCount: newCount,
          budgetDeltas: [
            { category: 'Catering & Spirits', oldAmount: Math.round(event.budget * 0.3), newAmount: Math.round(event.budget * 0.3) + extraCatering, reason: `Added ${extraGuests} plates` },
            { category: 'Decor & Production', oldAmount: Math.round(event.budget * 0.18), newAmount: Math.round(event.budget * 0.18) - extraCatering, reason: 'Reallocated to cover catering increase' },
          ],
          taskChanges: [`Update venue seating chart for ${newCount} guests`, 'Request updated dietary roster from new guests'],
          recommended: true,
        };
      } else if (lower.includes('reduce') || lower.includes('15%') || lower.includes('cut') || lower.includes('save')) {
        const savedAmount = Math.round(event.budget * 0.15);
        const newTotal = event.budget - savedAmount;

        replyText = `Reducing estimated expenditure by 15% saves ${event.currency}${savedAmount.toLocaleString()}. We achieve this by optimizing decor lighting options and negotiating weekday venue rates without compromising overall aesthetic quality.`;
        proposal = {
          id: `prop-${Date.now()}`,
          summary: `Optimize Budget by 15% (Save ${event.currency}${savedAmount.toLocaleString()})`,
          explanation: `Streamlines high-margin decor rentals and optimizes photography package hours while keeping guest hospitality at peak standard.`,
          tradeOffs: [
            `Total budget reduced from ${event.currency}${event.budget.toLocaleString()} to ${event.currency}${newTotal.toLocaleString()}`,
            'Replaces imported florals with seasonal local foliage',
            'Saves 15% on non-core vendor packages',
          ],
          newBudgetTotal: newTotal,
          newGuestCount: event.guestCount,
          budgetDeltas: [
            { category: 'Decor & Production', oldAmount: Math.round(event.budget * 0.18), newAmount: Math.round(event.budget * 0.12), reason: 'Transition to seasonal florals' },
            { category: 'Photography & Cinema', oldAmount: Math.round(event.budget * 0.1), newAmount: Math.round(event.budget * 0.08), reason: 'Optimize team hours' },
          ],
          taskChanges: ['Send renegotiated scope to Decor team', 'Update budget ledger'],
          recommended: true,
        };
      } else if (lower.includes('sustainab') || lower.includes('green') || lower.includes('eco')) {
        replyText = `I have updated your sustainability profile for "${event.title}". To achieve zero-waste standards, we recommend compostable banana-leaf tableware, solar-powered lighting rigs, and partnering with local organic farms.`;
        proposal = {
          id: `prop-${Date.now()}`,
          summary: `Enforce Zero-Waste Procurement Standards`,
          explanation: `Replaces plastic water bottles with stainless steel hydration stations and sources 100% organic local produce.`,
          tradeOffs: [
            'Reduces waste disposal fees by 40%',
            'Requires 2 volunteer waste-sorting stations',
          ],
          newBudgetTotal: event.budget,
          newGuestCount: event.guestCount,
          budgetDeltas: [],
          taskChanges: ['Confirm zero-plastic policy with catering captain', 'Order compostable trash bins'],
          recommended: true,
        };
      } else if (lower.includes('checklist') || lower.includes('task') || lower.includes('priority') || lower.includes('seven')) {
        replyText = `Here is your priority checklist for "${event.title}":\n1. Confirm final tasting menu with catering lead\n2. Approve Mandap / Stage floral architecture blueprint\n3. Finalize room allocation grid for out-of-town guests\n4. Conduct palace audio setup walkthrough\n5. Distribute Event Day Run Sheet to key relatives.`;
      } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('outdoor') || lower.includes('venue')) {
        replyText = `For outdoor weather contingencies at ${event.location}, we recommend locking a waterproof tensile awning canopy 5 days prior to ${event.date} or transitioning evening acoustic sets to the indoor pavilion after 10 PM.`;
      } else if (lower.includes('cater') || lower.includes('enquiry') || lower.includes('food')) {
        replyText = `You can generate a personalized enquiry email to caterers directly from the Vendor Matchbook tab. I have pre-filled dietary specifications for ${event.dietaryAccessibility || 'your guests'}.`;
      } else {
        replyText = `I've analyzed your stored ledger for "${event.title}". Currently, ${Math.round((event.budgetItems.reduce((acc, i) => acc + (i.actualCost || i.estimatedCost), 0) / event.budget) * 100)}% of your ${event.currency}${event.budget.toLocaleString()} budget is allocated across ${event.budgetItems.length} items. Let me know if you would like to adjust vendor quotes, edit guest RSVPs, or shift milestone deadlines!`;
      }
    }

    res.json({ reply: replyText, proposal });
  });

  // 8. GET /api/events/:id/integrity: Audit event integrity
  app.get('/api/events/:id/integrity', (req, res) => {
    const event = db.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const issues = [];
    const totalSpentOrEst = event.budgetItems.reduce((acc, b) => acc + (b.actualCost || b.estimatedCost), 0);
    const contingency = event.budgetItems.find((b) => b.isContingency);
    const contingencyEst = contingency ? contingency.estimatedCost : 0;

    // 1. Budget overrun
    if (totalSpentOrEst > event.budget) {
      issues.push({
        id: 'i-overbudget',
        type: 'error',
        title: 'Budget Overrun Detected',
        description: `Current estimated/actual expenditure (${event.currency}${totalSpentOrEst.toLocaleString()}) exceeds total budget (${event.currency}${event.budget.toLocaleString()}) by ${event.currency}${(totalSpentOrEst - event.budget).toLocaleString()}.`,
        suggestedAction: 'Use the What-If Simulator in the Budget tab to trim 10% from decor or media packages.',
      });
    }

    // 2. Low contingency
    if (contingencyEst < event.budget * 0.05) {
      issues.push({
        id: 'i-contingency',
        type: 'warning',
        title: 'Low Contingency Reserve',
        description: `Contingency reserve is ${event.currency}${contingencyEst.toLocaleString()} (${Math.round((contingencyEst / event.budget) * 100)}%). Recommended minimum is 5% (${event.currency}${Math.round(event.budget * 0.05).toLocaleString()}).`,
        suggestedAction: 'Reallocate ₹10,000 to the Emergency Reserve item.',
      });
    }

    // 3. Missing venue or caterer
    const hasVenue = event.vendors.some((v) => v.category.toLowerCase().includes('venue') && (v.status === 'booked' || v.status === 'quoted'));
    if (!hasVenue) {
      issues.push({
        id: 'i-venue',
        type: 'error',
        title: 'Unconfirmed Venue Partner',
        description: 'No venue partner is marked as booked or quoted yet.',
        suggestedAction: 'Browse shortlisted venue matchbook items and request a quotation.',
      });
    }

    // 4. Overdue tasks
    const todayStr = new Date().toISOString().split('T')[0];
    const overdueCount = event.tasks.filter((t) => t.status !== 'completed' && t.dueDate < todayStr).length;
    if (overdueCount > 0) {
      issues.push({
        id: 'i-overdue',
        type: 'warning',
        title: `${overdueCount} Overdue Action Items`,
        description: 'Certain planning milestones have passed their target deadline date.',
        suggestedAction: 'Open Living Timeline to reschedule or reassign overdue milestones.',
      });
    }

    const healthScore = Math.max(20, 100 - issues.filter((i) => i.type === 'error').length * 30 - issues.filter((i) => i.type === 'warning').length * 15);

    res.json({ healthScore, issues });
  });

  // 9. POST /api/events/:id/enquiry: Draft vendor enquiry email
  app.post('/api/events/:id/enquiry', async (req, res) => {
    const { vendorName, category } = req.body;
    const event = db.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isApiKeyPresent = Boolean(process.env.GEMINI_API_KEY);
    let message = '';

    if (isApiKeyPresent) {
      try {
        const prompt = `Draft a polite, professional, elegant business enquiry email to vendor "${vendorName}" (${category}) for an upcoming event:
Event Name: ${event.title}
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.guestCount}
Vibe: ${event.styleVibe}
Dietary/Special Needs: ${event.dietaryAccessibility || 'None'}

Include a request for portfolio samples, date availability, and an itemized quotation. Keep tone refined and warm.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        message = response.text || '';
      } catch (err) {
        console.error('Enquiry draft error:', err);
      }
    }

    if (!message) {
      message = `Subject: Enquiry regarding Availability & Quotation — ${event.title} (${event.date})

Dear ${vendorName} Team,

I hope this email finds you well.

We are currently planning "${event.title}", taking place on ${event.date} at ${event.location} for approximately ${event.guestCount} guests. We admire your work in ${category} and would love to discuss potential collaboration.

Our desired aesthetic direction is ${event.styleVibe}. Could you kindly confirm your availability for ${event.date} and share your package brochure along with estimated pricing?

Thank you for your time, and we look forward to hearing from you.

Warm regards,
Event Planning Team — EVAN.`;
    }

    res.json({ message });
  });

  // Mount Vite dev server middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EVAN. Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
