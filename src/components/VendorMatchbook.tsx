import React, { useState } from 'react';
import { Event, Vendor, VendorStatus } from '../types/event';
import { generateVendorEnquiry } from '../services/api';
import { Search, Filter, Mail, Phone, Plus, Sparkles, CheckCircle2, ShieldCheck, Copy, Check, ArrowLeft } from 'lucide-react';

interface VendorMatchbookProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onNavigateTab?: (tab: string) => void;
}

export const VendorMatchbook: React.FC<VendorMatchbookProps> = ({ event, onUpdateEvent, onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // AI Enquiry Modal State
  const [enquiryModalVendor, setEnquiryModalVendor] = useState<Vendor | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [isGeneratingEnquiry, setIsGeneratingEnquiry] = useState(false);
  const [copiedEnquiry, setCopiedEnquiry] = useState(false);

  // New Vendor Form Modal
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Venue');
  const [newVendorQuoted, setNewVendorQuoted] = useState<number>(50000);
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Handlers
  const handleVendorStatusChange = (id: string, status: VendorStatus) => {
    const updated = event.vendors.map((v) => (v.id === id ? { ...v, status } : v));
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleOpenEnquiryModal = async (vendor: Vendor) => {
    setEnquiryModalVendor(vendor);
    setIsGeneratingEnquiry(true);
    const msg = await generateVendorEnquiry(event.id, vendor.name, vendor.category);
    setEnquiryMessage(msg);
    setIsGeneratingEnquiry(false);
  };

  const handleCopyEnquiry = () => {
    navigator.clipboard.writeText(enquiryMessage);
    setCopiedEnquiry(true);
    setTimeout(() => setCopiedEnquiry(false), 2000);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: newVendorName.trim(),
      category: newVendorCategory,
      status: 'shortlisted',
      quotedPrice: Number(newVendorQuoted),
      email: newVendorEmail.trim() || undefined,
      phone: newVendorPhone.trim() || undefined,
      source: 'user_added',
    };

    onUpdateEvent({ ...event, vendors: [...event.vendors, newVendor] });
    setShowAddVendorModal(false);
    setNewVendorName('');
  };

  // Filter Vendors
  const filteredVendors = event.vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(event.vendors.map((v) => v.category)));

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
      
      {/* 1. HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
            Curated Procurement Atelier
          </div>
          <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Vendor Matchbook</h1>
          <p className="text-xs text-gray-400 mt-1">
            Organize venues, caterers, photographers, and decorators with deposit tracking and AI enquiry drafting.
          </p>
        </div>

        <button
          onClick={() => setShowAddVendorModal(true)}
          className="px-4 py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Vendor</span>
        </button>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#29252A] border border-[#3B333B]">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vendor name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-gray-300 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="quoted">Quoted</option>
            <option value="booked">Booked</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-gray-300 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. VENDOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-[#A7B49A] uppercase tracking-wider">
                    {vendor.category}
                  </div>
                  <h3 className="text-lg font-serif text-[#F4EEE5] mt-0.5">{vendor.name}</h3>
                </div>

                {/* Source Tag */}
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#211721] text-gray-400 border border-[#3B333B]">
                  {vendor.source === 'verified'
                    ? 'Verified Partner'
                    : vendor.source === 'ai_estimated'
                    ? 'AI Estimated'
                    : 'User Added'}
                </span>
              </div>

              {/* Price & Deposit */}
              <div className="pt-2 border-t border-[#3B333B] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Quoted Price:</span>
                <span className="text-[#D8BC91] font-semibold">
                  {vendor.quotedPrice ? `${event.currency}${vendor.quotedPrice.toLocaleString()}` : 'Pending Quote'}
                </span>
              </div>

              {/* Status Select */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400">Booking Status:</span>
                <select
                  value={vendor.status}
                  onChange={(e) => handleVendorStatusChange(vendor.id, e.target.value as VendorStatus)}
                  className="px-2 py-1 rounded bg-[#211721] border border-[#3B333B] text-xs text-white outline-none"
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              {/* Contact Information */}
              {(vendor.phone || vendor.email) && (
                <div className="text-[11px] text-gray-400 space-y-1 pt-2 border-t border-[#3B333B]">
                  {vendor.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#A7B49A]" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#A7B49A]" />
                      <span>{vendor.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Enquiry Draft Button */}
            <button
              onClick={() => handleOpenEnquiryModal(vendor)}
              className="w-full py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] text-[#D8BC91] hover:text-[#211721] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Draft Enquiry Message</span>
            </button>
          </div>
        ))}
      </div>

      {/* 4. AI ENQUIRY GENERATOR MODAL */}
      {enquiryModalVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3B333B] pb-3">
              <div className="flex items-center gap-2 text-[#D8BC91]">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-lg font-serif">Enquiry Draft — {enquiryModalVendor.name}</h3>
              </div>
              <button
                onClick={() => setEnquiryModalVendor(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isGeneratingEnquiry ? (
              <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                <Sparkles className="w-6 h-6 text-[#D8BC91] animate-spin mx-auto" />
                <p>ÉLAN Intelligence is composing a refined enquiry email...</p>
              </div>
            ) : (
              <textarea
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-[#29252A] border border-[#3B333B] text-xs text-[#F4EEE5] outline-none font-mono leading-relaxed"
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyEnquiry}
                className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-gray-700 text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedEnquiry ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnquiry ? 'Copied to Clipboard' : 'Copy Message'}</span>
              </button>

              <button
                onClick={() => setEnquiryModalVendor(null)}
                className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD VENDOR MODAL */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddVendor} className="w-full max-w-md bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white border-b border-[#3B333B] pb-3">Add Custom Vendor</h3>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Vendor Name</label>
              <input
                type="text"
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                placeholder="e.g. Saffron & Spice Caterers"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Category</label>
              <select
                value={newVendorCategory}
                onChange={(e) => setNewVendorCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decor">Decor</option>
                <option value="Photography">Photography</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Estimated / Quoted Price ({event.currency})</label>
              <input
                type="number"
                value={newVendorQuoted}
                onChange={(e) => setNewVendorQuoted(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3B333B]">
              <button
                type="button"
                onClick={() => setShowAddVendorModal(false)}
                className="px-4 py-2 rounded-xl bg-[#29252A] text-xs text-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] text-xs font-semibold"
              >
                Save Vendor
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
