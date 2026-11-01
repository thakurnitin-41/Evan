import React, { useState } from 'react';
import { Event, Guest, GuestGroup, RsvpStatus } from '../types/event';
import { Users, UserPlus, Search, Download, Upload, Share2, CheckCircle2, AlertCircle, Trash2, Check, ArrowLeft } from 'lucide-react';

interface GuestManagerProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onNavigateTab?: (tab: string) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({ event, onUpdateEvent, onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New Guest Form State
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<GuestGroup>('Friend');
  const [newPlusOne, setNewPlusOne] = useState(false);
  const [newDietary, setNewDietary] = useState('');
  const [newAccessibility, setNewAccessibility] = useState('');

  // Shareable RSVP Modal State
  const [showRsvpShareModal, setShowRsvpShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Statistics
  const totalGuestsInRoster = event.guests.length;
  const attendingCount = event.guests.filter((g) => g.status === 'attending').length;
  const declinedCount = event.guests.filter((g) => g.status === 'declined').length;
  const pendingCount = event.guests.filter((g) => g.status === 'invited' || g.status === 'not_sent').length;
  const plusOneCount = event.guests.filter((g) => g.plusOne).length;

  // Estimated Catering per Head Cost Impact
  const perHeadCost = Math.round((event.budget * 0.3) / (event.guestCount || 1));
  const estimatedGuestCostTotal = (attendingCount + plusOneCount) * perHeadCost;

  // Handlers
  const handleRsvpStatusChange = (id: string, status: RsvpStatus) => {
    const updated = event.guests.map((g) => (g.id === id ? { ...g, status } : g));
    onUpdateEvent({ ...event, guests: updated });
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      group: newGroup,
      status: 'invited',
      plusOne: newPlusOne,
      dietary: newDietary.trim() || undefined,
      accessibility: newAccessibility.trim() || undefined,
    };

    onUpdateEvent({ ...event, guests: [...event.guests, newGuest] });
    setShowAddGuestModal(false);
    setNewName('');
    setNewDietary('');
    setNewAccessibility('');
  };

  const handleDeleteGuest = (id: string) => {
    onUpdateEvent({ ...event, guests: event.guests.filter((g) => g.id !== id) });
  };

  const handleExportCsv = () => {
    const headers = ['Name', 'Group', 'Status', 'PlusOne', 'Dietary', 'Accessibility', 'Table'];
    const rows = event.guests.map((g) => [
      `"${g.name}"`,
      g.group,
      g.status,
      g.plusOne ? 'Yes' : 'No',
      `"${g.dietary || ''}"`,
      `"${g.accessibility || ''}"`,
      `"${g.tableAssignment || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Guest_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = event.guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' || g.group === groupFilter;
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="space-y-8 text-[#F4EEE5]">
      {onNavigateTab && (
        <button
          onClick={() => onNavigateTab('overview')}
          className="inline-flex items-center gap-1.5 text-xs text-[#D8BC91] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      )}
      
      {/* 1. HEADER & ACTIONS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
            Guest Management & Dietary Roster
          </div>
          <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Guests & RSVP Studio</h1>
          <p className="text-xs text-gray-400 mt-1">
            Track invitation status, dietary restrictions, accessibility needs, and calculate real-time catering cost impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRsvpShareModal(true)}
            className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs font-semibold text-[#D8BC91] transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Shareable RSVP Link</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddGuestModal(true)}
            className="px-4 py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] space-y-1">
          <div className="text-xs text-gray-400">Total Confirmed</div>
          <div className="text-2xl font-serif text-[#A7B49A] font-bold font-mono">
            {attendingCount} <span className="text-xs font-sans font-normal text-gray-400">(+{plusOneCount} +1s)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] space-y-1">
          <div className="text-xs text-gray-400">Pending RSVPs</div>
          <div className="text-2xl font-serif text-[#D8BC91] font-bold font-mono">{pendingCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] space-y-1">
          <div className="text-xs text-gray-400">Declined</div>
          <div className="text-2xl font-serif text-gray-400 font-bold font-mono">{declinedCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] space-y-1">
          <div className="text-xs text-gray-400">Catering Cost Impact</div>
          <div className="text-2xl font-serif text-[#E5C384] font-bold font-mono">
            {event.currency}{estimatedGuestCostTotal.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#29252A] border border-[#3B333B]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-gray-300 outline-none"
          >
            <option value="all">All Groups</option>
            <option value="VIP">VIP</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Colleague">Colleague</option>
            <option value="Community">Community</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-gray-300 outline-none"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="attending">Attending</option>
            <option value="invited">Invited</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* 4. GUEST LIST TABLE */}
      <div className="rounded-2xl bg-[#29252A] border border-[#3B333B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#211721] text-[#A7B49A] uppercase tracking-wider font-semibold border-b border-[#3B333B]">
              <tr>
                <th className="py-3 px-4">Guest Name & Group</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">+1 Allowed</th>
                <th className="py-3 px-4">Dietary & Accessibility</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B333B]">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#3B333B]/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{guest.name}</div>
                    <div className="text-[10px] text-gray-400">{guest.group}</div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={guest.status}
                      onChange={(e) => handleRsvpStatusChange(guest.id, e.target.value as RsvpStatus)}
                      className={`px-2.5 py-1 rounded text-[11px] outline-none ${
                        guest.status === 'attending'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : guest.status === 'declined'
                          ? 'bg-red-950/60 text-red-300 border border-red-800'
                          : 'bg-[#211721] text-gray-300 border border-[#3B333B]'
                      }`}
                    >
                      <option value="not_sent">Not Sent</option>
                      <option value="invited">Invited</option>
                      <option value="attending">Attending</option>
                      <option value="declined">Declined</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    {guest.plusOne ? (
                      <span className="text-[#D8BC91]">Yes (+1)</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {guest.dietary || guest.accessibility ? (
                      <div className="space-y-0.5">
                        {guest.dietary && <div className="text-amber-300">🥗 {guest.dietary}</div>}
                        {guest.accessibility && <div className="text-blue-300">♿ {guest.accessibility}</div>}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Standard</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddGuest} className="w-full max-w-md bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white border-b border-[#3B333B] pb-3">Add Guest to Roster</h3>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Guest Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Dr. Alok Verma"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Group Classification</label>
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value as GuestGroup)}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              >
                <option value="VIP">VIP</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="plus-one-check"
                checked={newPlusOne}
                onChange={(e) => setNewPlusOne(e.target.checked)}
                className="w-4 h-4 accent-[#D8BC91]"
              />
              <label htmlFor="plus-one-check" className="text-xs text-gray-300 cursor-pointer">
                Allow Guest +1 Attendance
              </label>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Dietary Requirements</label>
              <input
                type="text"
                value={newDietary}
                onChange={(e) => setNewDietary(e.target.value)}
                placeholder="e.g. Jain Veg, Nut Allergy, Vegan"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Accessibility Needs</label>
              <input
                type="text"
                value={newAccessibility}
                onChange={(e) => setNewAccessibility(e.target.value)}
                placeholder="e.g. Wheelchair Ramp required"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3B333B]">
              <button
                type="button"
                onClick={() => setShowAddGuestModal(false)}
                className="px-4 py-2 rounded-xl bg-[#29252A] text-xs text-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] text-xs font-semibold"
              >
                Save Guest
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. SHAREABLE RSVP LINK PREVIEW MODAL */}
      {showRsvpShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#3B333B] pb-3">
              <h3 className="text-lg font-serif text-white">Shareable Public RSVP Card</h3>
              <button onClick={() => setShowRsvpShareModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 rounded-xl bg-[#29252A] border border-[#D8BC91]/40 text-center space-y-3">
              <div className="text-xs uppercase font-mono text-[#D8BC91]">{event.type} Invitation</div>
              <h4 className="text-xl font-serif text-white">{event.title}</h4>
              <p className="text-xs text-gray-400">{event.date} · {event.location}</p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://elan-events.app/rsvp/${event.id}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] font-semibold text-xs flex items-center justify-center gap-2 mx-auto"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy RSVP Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
