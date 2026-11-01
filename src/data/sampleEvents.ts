import { Event } from '../types/event';

export const SAMPLE_EVENTS: Event[] = [
  {
    id: 'demo-royal-wedding',
    title: 'The Udaipur Royal Heritage Wedding',
    type: 'wedding',
    date: '2026-11-28',
    location: 'Fateh Garh Palace, Udaipur, Rajasthan',
    guestCount: 150,
    budget: 1200000,
    currency: '₹',
    culturalPreferences: 'Traditional North Indian Royal Rajputana aesthetics with Shehnai musicians and Phoolon ki Holi.',
    styleVibe: 'Regal Heritage Luxury & Twilight Elegance',
    priorities: ['Atmospheric Palace Lighting', 'Royal Rajasthani Banquet', 'Cinematic Photography', 'Cultural Music Ensemble'],
    dietaryAccessibility: 'Multi-cuisine pure vegetarian Rajasthani Thali, Jain options, ramp access for senior family members.',
    sustainability: true,
    brief: 'A grand yet intimate royal wedding celebration for 150 guests set in an old palace courtyard overlooking the lake, featuring warm candlelit decor, antique brass urns, marigold garlands, and authentic Rajasthani folk artists.',
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-30T14:20:00Z',

    concept: {
      title: 'Fateh Royal Twilight',
      headline: 'Heritage grandeur soaked in warm amber candlelight and marigold gold.',
      description: 'An immersive celebration blending 17th-century Rajasthani architecture with refined modern editorial dining. Velvet drapery in aubergine and deep champagne frame open palace arches.',
      moodboardImage: '/src/assets/images/elan_moodboard_palace_1793474323686.jpg',
      colorPalette: [
        { name: 'Royal Aubergine', hex: '#211721', role: 'Dominant Canvas & Drapery' },
        { name: 'Palace Gold', hex: '#D8BC91', role: 'Accents & Brass Fixtures' },
        { name: 'Marigold Amber', hex: '#E59B38', role: 'Floral Centerpieces' },
        { name: 'Muted Sage', hex: '#A7B49A', role: 'Foliage & Garden Borders' },
        { name: 'Warm Ivory', hex: '#F4EEE5', role: 'Stationery & Linen' },
      ],
      decorDirections: [
        { category: 'Lighting', title: 'Low-slung Brass Lanterns & Taper Candles', description: 'Tiered brass diya stands and amber candle clusters along marble pathways.' },
        { category: 'Floral', title: 'Local Marigold Cascades & White Jasmine', description: 'Heavy fragrant marigold arches framing the Mandap with suspended tuberose garlands.' },
        { category: 'Tablescape', title: 'Hand-hammered Copper & Velvet Runners', description: 'Aubergine velvet runners topped with brass charger plates and hand-calligraphed menu scrolls.' },
      ],
    },

    budgetItems: [
      { id: 'b1', category: 'Venue & Stay', name: 'Fateh Garh Palace Courtyard & 15 Guest Rooms', estimatedCost: 450000, actualCost: 435000, paidAmount: 200000, status: 'booked', payeeName: 'Fateh Garh Palace Heritage Events', paymentDate: '2026-10-15', paymentMethod: 'Bank Wire Transfer', notes: 'Includes 2-night stay for core family' },
      { id: 'b2', category: 'Catering & Spirits', name: 'Royal Rajputana Feast & Gourmet Live Counters (150 Pax)', estimatedCost: 320000, actualCost: 310000, paidAmount: 150000, status: 'quoted', payeeName: 'Saffron & Spice Gourmet Caterers', paymentDate: '2026-10-20', paymentMethod: 'UPI / NEFT', notes: 'Pure veg menu with 4 starters, 8 mains, 4 desserts' },
      { id: 'b3', category: 'Decor & Floral', name: 'Mandap Setup, Lighting & Marigold Installations', estimatedCost: 180000, actualCost: 190000, paidAmount: 80000, status: 'quoted', payeeName: 'Rawal & Co. Floral Atelier', paymentDate: '2026-10-22', paymentMethod: 'Cheque', notes: 'Includes generator backup & torchbearers' },
      { id: 'b4', category: 'Photography & Cinema', name: '3-Day Documentary Film & Editorial Photography', estimatedCost: 110000, actualCost: 110000, paidAmount: 50000, status: 'booked', payeeName: 'Lumière Stories Wedding Cinema', paymentDate: '2026-10-25', paymentMethod: 'Card Payment', notes: 'Includes drone footage and drone permit' },
      { id: 'b5', category: 'Entertainment & Music', name: 'Folk Manganiyar Troupe & Sitar Ensemble', estimatedCost: 50000, actualCost: 45000, paidAmount: 20000, status: 'booked', payeeName: 'Udaipur Folk Cultural Ensemble', paymentDate: '2026-10-28', paymentMethod: 'Cash Advance', notes: '4-hour evening performance' },
      { id: 'b6', category: 'Contingency Reserve', name: 'Emergency Emergency Funds & Vendor Tips', estimatedCost: 90000, actualCost: 0, paidAmount: 0, status: 'unallocated', payeeName: 'Unallocated Buffer', isContingency: true, notes: '7.5% contingency buffer' },
    ],

    tasks: [
      { id: 't1', title: 'Finalize Tasting & Menu Customization', category: 'Catering', dueDate: '2026-11-05', priority: 'high', status: 'completed', owner: 'Aarav (Groom)', notes: 'Confirm Jain thali count' },
      { id: 't2', title: 'Approve Mandap Floral Architecture Blueprint', category: 'Decor', dueDate: '2026-11-10', priority: 'high', status: 'in_progress', owner: 'Priya (Bride)', dependencies: ['b3'], notes: 'Ensure amber warm lights instead of cool white LEDs' },
      { id: 't3', title: 'Collect RSVP & Finalize Room Allocation Grid', category: 'Guests', dueDate: '2026-11-15', priority: 'high', status: 'in_progress', owner: 'Ananya (Planner)', notes: '98 out of 150 confirmed so far' },
      { id: 't4', title: 'Schedule Palace Audio Setup Walkthrough', category: 'Entertainment', dueDate: '2026-11-20', priority: 'medium', status: 'todo', owner: 'Ananya (Planner)', notes: 'Sound restriction check post 10 PM' },
      { id: 't5', title: 'Distribute Event Day Run Sheet to Key Relatives', category: 'Execution', dueDate: '2026-11-25', priority: 'low', status: 'todo', owner: 'Aarav (Groom)' },
    ],

    vendors: [
      { id: 'v1', name: 'Fateh Garh Palace Heritage Events', category: 'Venue', status: 'booked', quotedPrice: 435000, depositAmount: 200000, depositPaid: true, rating: 4.9, source: 'verified', phone: '+91 98290 12345', email: 'events@fatehgarh.com', notes: 'Heritage property rules apply for fireworks' },
      { id: 'v2', name: 'Saffron & Spice Gourmet Caterers', category: 'Catering', status: 'quoted', quotedPrice: 310000, depositAmount: 150000, depositPaid: true, rating: 4.8, source: 'verified', phone: '+91 98291 98765', email: 'contact@saffronspice.in', notes: 'Tasting completed on Oct 20' },
      { id: 'v3', name: 'Rawal & Co. Floral Atelier', category: 'Decor', status: 'quoted', quotedPrice: 190000, depositAmount: 80000, depositPaid: true, rating: 4.7, source: 'verified', phone: '+91 98292 44332', email: 'design@rawalflorals.com' },
      { id: 'v4', name: 'Lumière Stories Wedding Cinema', category: 'Photography', status: 'booked', quotedPrice: 110000, depositAmount: 50000, depositPaid: true, rating: 5.0, source: 'verified', phone: '+91 98293 88112', email: 'hello@lumierestories.com' },
    ],

    guests: [
      { id: 'g1', name: 'Rajesh & Kavita Sharma', group: 'VIP', status: 'attending', plusOne: true, dietary: 'Jain Vegetarian', tableAssignment: 'Royal Table 1' },
      { id: 'g2', name: 'Vikramaditya Singh', group: 'Family', status: 'attending', plusOne: false, dietary: 'No mushrooms', accessibility: 'Wheelchair ramp required', tableAssignment: 'Royal Table 1' },
      { id: 'g3', name: 'Rohan & Simran Mehta', group: 'Friend', status: 'attending', plusOne: true, tableAssignment: 'Table 4' },
      { id: 'g4', name: 'Deepak Kapoor', group: 'Colleague', status: 'invited', plusOne: true },
      { id: 'g5', name: 'Sunita & Arvind Varma', group: 'Family', status: 'invited', plusOne: false, dietary: 'Nut allergy' },
      { id: 'g6', name: 'Maya Lin', group: 'Friend', status: 'attending', plusOne: false, dietary: 'Vegan' },
    ],

    risks: [
      { id: 'r1', title: 'Palace Outdoor Sound Limit post 10:00 PM', severity: 'medium', mitigation: 'Transition post 10 PM acoustic musical performance into the indoor Darbar Hall.' },
      { id: 'r2', title: 'Unexpected Evening Temperature Dip', severity: 'low', mitigation: 'Arrange 12 vintage copper patio heaters and pashmina shawls for guests.' },
    ],

    nextSteps: [
      { id: 'ns1', title: 'Confirm final caterer contract deposit', reason: 'Secures menu locked price ahead of market ingredient surge.', deadline: '2026-11-05', priority: 'high' },
      { id: 'ns2', title: 'Lock 150-guest seat plan with decor vendor', reason: 'Ensures custom linen orders arrive 10 days before event date.', deadline: '2026-11-10', priority: 'high' },
    ],

    runSheet: [
      { id: 'rs1', time: '14:00', activity: 'Guest Check-in & Traditional Welcoming Shehnai', owner: 'Hospitality Desk', vendorContact: '+91 98290 12345', location: 'Palace Courtyard' },
      { id: 'rs2', time: '16:30', activity: 'Baraat Procession & Folk Dancers Entry', owner: 'Groom Family Lead', vendorContact: '+91 98293 88112', location: 'Main Palace Gates' },
      { id: 'rs3', time: '18:00', activity: 'Sunset Mandap Ceremony & Pheras', owner: 'Pandit ji & Planner', location: 'Lakeview Pavilion' },
      { id: 'rs4', time: '20:00', activity: 'Royal Royal Banquet Dinner & Manganiyar Performance', owner: 'Catering Captain', vendorContact: '+91 98291 98765', location: 'Grand Courtyard' },
      { id: 'rs5', time: '22:15', activity: 'Acoustic After-hours & Dessert Counter', owner: 'Ananya (Planner)', location: 'Indoor Darbar Hall' },
    ],
  },

  {
    id: 'demo-21st-birthday',
    title: 'Midnight Eclipse — 21st Birthday Soirée',
    type: 'birthday',
    date: '2026-12-12',
    location: 'Aer Rooftop Lounge, Mumbai',
    guestCount: 40,
    budget: 100000,
    currency: '₹',
    styleVibe: 'Chic Noir, Amber Glow & Atmospheric Beats',
    priorities: ['Signature Cocktail Bar', 'Live DJ & Lighting FX', 'Custom Black Velvet Cake', 'Aesthetic Photo Corner'],
    dietaryAccessibility: 'Gourmet tapas, keto-friendly skewers, vegan slides, gluten-free dessert bites.',
    sustainability: false,
    brief: 'A high-energy, stylish 21st birthday gathering for 40 close friends on a city skyline rooftop with ambient string lights, signature mixology, deep house grooves, and a dark velvet birthday cake.',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-31T10:00:00Z',

    concept: {
      title: 'Midnight Eclipse Noir',
      headline: 'Dramatic city skyline silhouette with moody amber neon accents.',
      description: 'An intimate rooftop lounge transformation with dark charcoal lounge seating, amber light globes, and bespoke mixology.',
      moodboardImage: '/src/assets/images/elan_moodboard_rooftop_1793474324352.jpg',
      colorPalette: [
        { name: 'Charcoal Noir', hex: '#1C1917', role: 'Dominant Backdrop' },
        { name: 'Amber Filament', hex: '#F59E0B', role: 'Ambient Lighting' },
        { name: 'Champagne Gold', hex: '#D8BC91', role: 'Glassware & Metallic Highlights' },
        { name: 'Deep Aubergine', hex: '#211721', role: 'Velvet Soft Seating' },
      ],
      decorDirections: [
        { category: 'Lighting', title: 'Custom Amber Neon Signature Installation', description: 'Photo backdrop featuring "21 & Unstoppable" in warm amber neon tube.' },
        { category: 'Bar', title: 'Smoked Botanical Cocktail Bar', description: 'Custom cocktail menu featuring smoked rosemary gin fizz and espresso martinis.' },
      ],
    },

    budgetItems: [
      { id: 'b21', category: 'Rooftop Lounge Deposit', name: 'Aer Skyline Deck Minimum Spend', estimatedCost: 45000, actualCost: 45000, paidAmount: 25000, status: 'booked', notes: 'Includes food & beverage credit' },
      { id: 'b22', category: 'Mixology & Drinks', name: 'Custom Artisanal Cocktail Bar & Champagne Toast', estimatedCost: 20000, actualCost: 18500, paidAmount: 10000, status: 'quoted' },
      { id: 'b23', category: 'DJ & Sound System', name: 'Deep House DJ Set & Ambient Lighting Rig', estimatedCost: 15000, actualCost: 15000, paidAmount: 5000, status: 'booked' },
      { id: 'b24', category: 'Bakery & Cake', name: '3-Tier Black Velvet Berry Sculpted Cake', estimatedCost: 8000, actualCost: 8500, paidAmount: 8500, status: 'paid' },
      { id: 'b25', category: 'Decor & Photo Wall', name: 'Amber Neon Sign & Charcoal Velvet Lounge Accents', estimatedCost: 7000, actualCost: 6500, paidAmount: 3000, status: 'quoted' },
      { id: 'b26', category: 'Contingency', name: 'Late Night Rides & Buffer', estimatedCost: 5000, actualCost: 0, paidAmount: 0, status: 'unallocated', isContingency: true },
    ],

    tasks: [
      { id: 't21', title: 'Finalize DJ Setlist & High-Energy Tracks', category: 'Entertainment', dueDate: '2026-11-25', priority: 'medium', status: 'completed', owner: 'Kabir (Birthday Host)' },
      { id: 't22', title: 'Send digital animated invitation links', category: 'Guests', dueDate: '2026-11-20', priority: 'high', status: 'completed', owner: 'Kabir (Host)' },
      { id: 't23', title: 'Approve signature cocktail menu cards', category: 'Bar', dueDate: '2026-12-01', priority: 'medium', status: 'in_progress', owner: 'Kabir' },
    ],

    vendors: [
      { id: 'v21', name: 'Aer Rooftop Lounge', category: 'Venue', status: 'booked', quotedPrice: 45000, depositAmount: 25000, depositPaid: true, rating: 4.9, source: 'verified', phone: '+91 98111 22334', email: 'events@aerlounge.com' },
      { id: 'v22', name: 'DJ Zayd Deep House', category: 'Entertainment', status: 'booked', quotedPrice: 15000, depositAmount: 5000, depositPaid: true, rating: 4.8, source: 'verified', phone: '+91 98222 33445' },
      { id: 'v23', name: 'Luxe Confections Mumbai', category: 'Bakery', status: 'booked', quotedPrice: 8500, depositAmount: 8500, depositPaid: true, rating: 5.0, source: 'verified' },
    ],

    guests: [
      { id: 'g21', name: 'Tara Sharma', group: 'VIP', status: 'attending', plusOne: false, dietary: 'Vegan' },
      { id: 'g22', name: 'Dev & Natasha', group: 'Friend', status: 'attending', plusOne: true },
      { id: 'g23', name: 'Karan Mehra', group: 'Friend', status: 'attending', plusOne: false },
      { id: 'g24', name: 'Siddharth Roy', group: 'Friend', status: 'invited', plusOne: true },
    ],

    risks: [
      { id: 'r21', title: 'Rooftop breezes past 11 PM', severity: 'low', mitigation: 'Keep outdoor gas warmers on standby with venue team.' }
    ],

    nextSteps: [
      { id: 'ns21', title: 'Lock final headcount with bar captain', reason: 'Guarantees adequate craft spirits inventory.', deadline: '2026-12-05', priority: 'high' }
    ],

    runSheet: [
      { id: 'rs21', time: '20:00', activity: 'Guest Welcome Drinks & Tapas Platters', owner: 'Kabir & Venue Host', location: 'Rooftop North Bar' },
      { id: 'rs22', time: '21:30', activity: 'DJ Zayd Main Set Begins', owner: 'DJ Zayd', location: 'DJ Booth Deck' },
      { id: 'rs23', time: '23:45', activity: 'Midnight Cake Cutting & Champagne Toast', owner: 'Kabir & Friends', location: 'Center Lounge' },
    ],
  },

  {
    id: 'demo-community-festival',
    title: 'Solstice Harvest & Artisanal Community Fair',
    type: 'community',
    date: '2026-11-15',
    location: 'Oakridge Eco Botanical Park, Bengaluru',
    guestCount: 200,
    budget: 75000,
    currency: '₹',
    styleVibe: 'Zero-Waste Organic Botanical Elegance',
    priorities: ['Compostable / Zero-Plastic Setup', 'Local Farmers Market Stalls', 'Acoustic Folk Jam Stage', 'Children Workshops'],
    dietaryAccessibility: '100% Organic plant-based, nut-labeled stalls, fully accessible unpaved walkways.',
    sustainability: true,
    brief: 'A vibrant, eco-conscious community harvest gathering under ancient oak trees featuring wooden communal dining, organic local food vendors, acoustic musicians, zero-waste composting stations, and artisanal craft booths.',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-29T16:30:00Z',

    concept: {
      title: 'Earth & Sun Harvest',
      headline: 'Golden hour warmth, unbleached linen, and botanical simplicity.',
      description: 'A zero-waste gathering celebrating local artisans with sun-dappled communal seating, terracotta planters, and wildflower arrangements.',
      moodboardImage: '/src/assets/images/elan_moodboard_community_1793474324079.jpg',
      colorPalette: [
        { name: 'Muted Sage', hex: '#A7B49A', role: 'Dominant Canvas' },
        { name: 'Terracotta Clay', hex: '#C86D51', role: 'Ceramic & Signage Accents' },
        { name: 'Warm Linen Ivory', hex: '#F4EEE5', role: 'Table Linens & Banners' },
        { name: 'Deep Oak Charcoal', hex: '#29252A', role: 'Structure & Type' },
      ],
      decorDirections: [
        { category: 'Sustainability', title: 'Zero Single-Use Plastics Guarantee', description: 'Banana leaf plates, clay kulhads, and stainless steel refill stations.' },
        { category: 'Seating', title: 'Communal Pine Benches & Hemp Cushions', description: 'Long 20-person wooden tables promoting neighborhood conversation.' },
      ],
    },

    budgetItems: [
      { id: 'b31', category: 'Park Permit & Green Fee', name: 'Oakridge Eco Botanical Grounds Permit', estimatedCost: 20000, actualCost: 20000, paidAmount: 20000, status: 'paid' },
      { id: 'b32', category: 'Infrastructure & Furniture', name: 'Wooden Picnic Benches & Bamboo Tents (200 Pax)', estimatedCost: 25000, actualCost: 24000, paidAmount: 12000, status: 'booked' },
      { id: 'b33', category: 'Zero-Waste & Sanitation', name: 'Composting Stations & Eco Wash Basins', estimatedCost: 12000, actualCost: 11000, paidAmount: 5000, status: 'booked' },
      { id: 'b34', category: 'Sound & Acoustic Stage', name: 'Solar-Powered Audio System & Mics', estimatedCost: 10000, actualCost: 10000, paidAmount: 5000, status: 'quoted' },
      { id: 'b35', category: 'Contingency', name: 'Weather Protection Canvas Covers', estimatedCost: 8000, actualCost: 0, paidAmount: 0, status: 'unallocated', isContingency: true },
    ],

    tasks: [
      { id: 't31', title: 'Register 12 local organic food stall vendors', category: 'Vendors', dueDate: '2026-11-01', priority: 'high', status: 'completed', owner: 'Community Board' },
      { id: 't32', title: 'Verify Solar Power Inverter Capacity with Sound Team', category: 'Tech', dueDate: '2026-11-08', priority: 'high', status: 'in_progress', owner: 'Ramesh (Tech Lead)' },
      { id: 't33', title: 'Post volunteer shift schedule for composting bays', category: 'Execution', dueDate: '2026-11-12', priority: 'medium', status: 'todo', owner: 'Divya' },
    ],

    vendors: [
      { id: 'v31', name: 'Oakridge Eco Parks', category: 'Venue', status: 'booked', quotedPrice: 20000, depositAmount: 20000, depositPaid: true, rating: 4.9, source: 'verified' },
      { id: 'v32', name: 'GreenEarth Bamboo Rentals', category: 'Infrastructure', status: 'booked', quotedPrice: 24000, depositAmount: 12000, depositPaid: true, rating: 4.8, source: 'verified' },
    ],

    guests: [
      { id: 'g31', name: 'Dr. Alok Verma', group: 'Community', status: 'attending', plusOne: true },
      { id: 'g32', name: 'Greenwood Resident Assoc (45 members)', group: 'Community', status: 'attending', plusOne: false },
    ],

    risks: [
      { id: 'r31', title: 'Sudden rain shower during outdoor acoustic set', severity: 'medium', mitigation: 'Bamboo canopy structures installed over stage area.' }
    ],

    nextSteps: [
      { id: 'ns31', title: 'Conduct volunteer briefing on waste segregation', reason: 'Ensures 100% zero-waste target is met.', deadline: '2026-11-10', priority: 'high' }
    ],

    runSheet: [
      { id: 'rs31', time: '10:00', activity: 'Artisanal Stall Vendor Setup & Power Check', owner: 'Vendor Lead', location: 'Main Lawn' },
      { id: 'rs32', time: '12:00', activity: 'Community Gates Open & Acoustic Folk Jam', owner: 'Sound Lead', location: 'Solar Stage' },
      { id: 'rs33', time: '15:00', activity: 'Kids Organic Seed Planting Workshop', owner: 'Divya', location: 'Botanical Shed' },
      { id: 'rs34', time: '17:30', activity: 'Sunset Harvest Ceremonial Toast & Clean-up', owner: 'Community Board', location: 'Communal Benches' },
    ],
  },
];
