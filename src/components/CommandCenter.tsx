import React, { useState } from 'react';
import { Event, RunSheetItem } from '../types/event';
import { Clock, Phone, MapPin, User, AlertTriangle, Smartphone, Printer, Plus, Trash2, ArrowLeft, Bell, BellRing, DollarSign, CheckCircle2 } from 'lucide-react';

interface CommandCenterProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ event, onUpdateEvent, onNavigateTab }) => {
  const [isMobileMode, setIsMobileMode] = useState(false);

  // New Run Sheet Entry Form
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [newTime, setNewTime] = useState('15:00');
  const [newActivity, setNewActivity] = useState('');
  const [newOwner, setNewOwner] = useState('Planner Lead');
  const [newLocation, setNewLocation] = useState(event.location);

  const handleAddRunSheetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    const newItem: RunSheetItem = {
      id: `rs-${Date.now()}`,
      time: newTime,
      activity: newActivity.trim(),
      owner: newOwner,
      location: newLocation,
    };

    const updatedRunSheet = [...(event.runSheet || []), newItem].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    onUpdateEvent({ ...event, runSheet: updatedRunSheet });
    setShowAddEntryModal(false);
    setNewActivity('');
  };

  const handleDeleteItem = (id: string) => {
    onUpdateEvent({
      ...event,
      runSheet: (event.runSheet || []).filter((item) => item.id !== id),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-[#F4EEE5]">
      {onNavigateTab && (
        <button
          onClick={() => onNavigateTab('overview')}
          className="inline-flex items-center gap-1.5 text-xs text-[#D8BC91] hover:underline print:hidden"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      )}
      
      {/* 1. HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
            Live Execution Blueprint
          </div>
          <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Event Day Command Center</h1>
          <p className="text-xs text-gray-400 mt-1">
            Chronological run sheet with hour-by-hour timings, task owners, vendor hotlines, and contingency alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Execution View Toggle */}
          <button
            onClick={() => setIsMobileMode(!isMobileMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              isMobileMode
                ? 'bg-[#D8BC91] text-[#211721] border-[#D8BC91]'
                : 'bg-[#3B333B] text-[#D8BC91] border-[#3B333B] hover:border-[#D8BC91]/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isMobileMode ? 'Standard View' : 'Mobile Execution Mode'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Run Sheet</span>
          </button>

          <button
            onClick={() => setShowAddEntryModal(true)}
            className="px-4 py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* 2. EMERGENCY & VENDOR QUICK HOTLINES STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        {event.vendors.slice(0, 3).map((v) => (
          <div key={v.id} className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">{v.category} Lead</div>
              <div className="text-xs font-semibold text-white">{v.name}</div>
            </div>
            {v.phone && (
              <a
                href={`tel:${v.phone}`}
                className="p-2 rounded-lg bg-[#3B333B] hover:bg-[#D8BC91] text-[#D8BC91] hover:text-[#211721] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* 2.5 VENDOR PAYMENT ALERTS & MILESTONE REMINDERS */}
      {(() => {
        const paymentAlerts =
          event.paymentAlerts && event.paymentAlerts.length > 0
            ? event.paymentAlerts
            : event.budgetItems
                .filter((b) => (b.actualCost || b.estimatedCost) - (b.paidAmount || 0) > 0)
                .map((b) => ({
                  id: `pa-${b.id}`,
                  budgetItemId: b.id,
                  payeeName: b.payeeName || 'Vendor Payee',
                  budgetItemName: b.name,
                  amountOwed: Math.max(0, (b.actualCost || b.estimatedCost) - (b.paidAmount || 0)),
                  dueDate: b.paymentDate || '2026-11-20',
                  status: 'due_soon' as const,
                  category: b.category,
                }));

        if (paymentAlerts.length === 0) return null;

        const markAlertSettled = (alertId: string, budgetItemId: string) => {
          const updatedAlerts = (event.paymentAlerts || []).filter((a) => a.id !== alertId);
          const updatedBudget = event.budgetItems.map((b) => {
            if (b.id === budgetItemId) {
              const targetCost = b.actualCost || b.estimatedCost || 0;
              return { ...b, paidAmount: targetCost, status: 'paid' as const };
            }
            return b;
          });
          onUpdateEvent({ ...event, paymentAlerts: updatedAlerts, budgetItems: updatedBudget });
        };

        return (
          <div className="p-6 rounded-2xl bg-[#29252A] border border-[#D8BC91]/40 space-y-4 shadow-xl print:hidden">
            <div className="flex items-center justify-between border-b border-[#3B333B] pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#D8BC91] animate-pulse" />
                <div>
                  <h2 className="text-lg font-serif text-[#F4EEE5]">Upcoming Vendor Payment Reminders</h2>
                  <p className="text-xs text-gray-400">Automated payment milestone alerts synced from your Budget Reality Ledger.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/50 text-xs font-mono font-semibold">
                {paymentAlerts.length} Pending {paymentAlerts.length === 1 ? 'Alert' : 'Alerts'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] hover:border-[#D8BC91]/60 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A7B49A] font-semibold">{alert.payeeName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-900/40 text-amber-200 border border-amber-800/40">
                      Due: {alert.dueDate}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-white">{alert.budgetItemName}</div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#3B333B]">
                    <span className="text-gray-400">Amount Due:</span>
                    <span className="text-amber-300 font-semibold">{event.currency}{alert.amountOwed.toLocaleString()}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#3B333B]/50">
                    <button
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab('budget');
                      }}
                      className="text-[11px] text-[#D8BC91] hover:underline flex items-center gap-1"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>View in Budget</span>
                    </button>

                    <button
                      onClick={() => markAlertSettled(alert.id, alert.budgetItemId)}
                      className="px-2.5 py-1 rounded-md bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-[11px] font-semibold flex items-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Paid</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 3. CHRONOLOGICAL RUN SHEET TIMELINE */}
      <div className="space-y-4">
        {(event.runSheet || []).map((item, idx) => (
          <div
            key={item.id}
            className={`p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
              isMobileMode ? 'p-4 space-y-2' : ''
            }`}
          >
            {/* Time Slot Pill */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-[#211721] border border-[#3B333B] text-center">
                <div className="text-xl font-serif text-[#D8BC91] font-bold font-mono">{item.time}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Slot #{idx + 1}</div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">{item.activity}</h3>
                <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#A7B49A]" />
                    {item.owner}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#A7B49A]" />
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 print:hidden">
              {item.vendorContact && (
                <a
                  href={`tel:${item.vendorContact}`}
                  className="px-3 py-1.5 rounded-lg bg-[#3B333B] text-xs text-[#D8BC91] hover:bg-[#D8BC91] hover:text-[#211721] transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Lead</span>
                </a>
              )}
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. ADD ENTRY MODAL */}
      {showAddEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddRunSheetItem} className="w-full max-w-md bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white border-b border-[#3B333B] pb-3">Add Run Sheet Activity</h3>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Time (24h)</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 18:30"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Activity Description</label>
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="e.g. Cake Cutting Ceremony & Toast"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Responsible Owner / Lead</label>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="e.g. Catering Captain"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Specific Spot / Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3B333B]">
              <button
                type="button"
                onClick={() => setShowAddEntryModal(false)}
                className="px-4 py-2 rounded-xl bg-[#29252A] text-xs text-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] text-xs font-semibold"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
