import React, { useState } from 'react';
import { Event, BudgetItem, BudgetItemStatus, VendorPaymentAlert } from '../types/event';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Sliders,
  ArrowRight,
  ShieldAlert,
  Check,
  RefreshCw,
  ArrowLeft,
  Building2,
  Receipt,
  CreditCard,
  UserCheck,
  Calendar,
  Layers,
  BarChart3,
  Download,
  Bell,
  BellRing,
  CheckCircle2,
} from 'lucide-react';

interface BudgetRealityEngineProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onOpenCopilotWithQuery: (query: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const BudgetRealityEngine: React.FC<BudgetRealityEngineProps> = ({
  event,
  onUpdateEvent,
  onOpenCopilotWithQuery,
  onNavigateTab,
}) => {
  // What-If Simulator Interactive Controls
  const [simGuests, setSimGuests] = useState<number>(event.guestCount);
  const [simBudget, setSimBudget] = useState<number>(event.budget);
  const [showSimDrawer, setShowSimDrawer] = useState(false);

  // Add Transaction Modal State
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [txItemId, setTxItemId] = useState<string>(event.budgetItems[0]?.id || '');
  const [txPayee, setTxPayee] = useState<string>(event.budgetItems[0]?.payeeName || '');
  const [txAmount, setTxAmount] = useState<number>(25000);
  const [txMethod, setTxMethod] = useState<string>('Bank Wire Transfer');
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [txNotes, setTxNotes] = useState<string>('Deposit payment');

  // Add Line Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Venue & Stay');
  const [newItemEst, setNewItemEst] = useState<number>(10000);
  const [newItemPayee, setNewItemPayee] = useState('');
  const [newItemMethod, setNewItemMethod] = useState('Bank Wire Transfer');

  // Sync Payee when selected item changes
  const handleTxItemSelect = (itemId: string) => {
    setTxItemId(itemId);
    const selected = event.budgetItems.find((i) => i.id === itemId);
    if (selected && selected.payeeName) {
      setTxPayee(selected.payeeName);
    }
  };

  const handleLogTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txItemId || !txAmount) return;

    const updatedItems = event.budgetItems.map((item) => {
      if (item.id === txItemId) {
        const currentPaid = item.paidAmount || 0;
        const newPaid = currentPaid + Number(txAmount);
        const currentAct = item.actualCost || item.estimatedCost || 0;
        const newAct = Math.max(currentAct, newPaid);
        const newStatus: BudgetItemStatus = newPaid >= (item.estimatedCost || 0) ? 'paid' : 'booked';

        return {
          ...item,
          paidAmount: newPaid,
          actualCost: newAct,
          status: newStatus,
          payeeName: txPayee.trim() || item.payeeName || 'Vendor Payee',
          paymentMethod: txMethod,
          paymentDate: txDate,
          notes: txNotes.trim() || item.notes,
        };
      }
      return item;
    });

    onUpdateEvent({ ...event, budgetItems: updatedItems });
    setShowTransactionModal(false);
    setTxNotes('Deposit payment');
  };

  // Recalculations (Deterministic)
  const totalEst = event.budgetItems.reduce((acc, b) => acc + (b.estimatedCost || 0), 0);
  const totalAct = event.budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
  const totalAllocated = Math.max(totalEst, totalAct);
  const remainingFunds = event.budget - totalAllocated;
  const totalBalanceOwed = Math.max(0, totalAllocated - totalPaid);
  const isOverBudget = remainingFunds < 0;

  // Handlers for Inline Edits
  const handleItemChange = (id: string, field: keyof BudgetItem, val: any) => {
    const updatedItems = event.budgetItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onUpdateEvent({ ...event, budgetItems: updatedItems });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: BudgetItem = {
      id: `bi-${Date.now()}`,
      category: newItemCategory,
      name: newItemName.trim(),
      estimatedCost: Number(newItemEst),
      actualCost: 0,
      paidAmount: 0,
      status: 'unallocated',
      payeeName: newItemPayee.trim() || 'Pending Vendor Selection',
      paymentMethod: newItemMethod,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    onUpdateEvent({
      ...event,
      budgetItems: [...event.budgetItems, newItem],
    });

    setNewItemName('');
    setNewItemPayee('');
    setNewItemEst(10000);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateEvent({
      ...event,
      budgetItems: event.budgetItems.filter((i) => i.id !== id),
    });
  };

  // Group items by category for visual cards
  const categoriesList = Array.from(new Set(event.budgetItems.map((b) => b.category)));
  const categorySummaries = categoriesList.map((cat) => {
    const catItems = event.budgetItems.filter((b) => b.category === cat);
    const catEst = catItems.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
    const catAct = catItems.reduce((acc, i) => acc + (i.actualCost || 0), 0);
    const catPaid = catItems.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
    const primaryPayee = catItems.find((i) => i.payeeName)?.payeeName || 'Multiple Vendors';

    return {
      category: cat,
      est: catEst,
      act: catAct,
      paid: catPaid,
      itemsCount: catItems.length,
      primaryPayee,
      percentOfBudget: Math.round((Math.max(catEst, catAct) / (event.budget || 1)) * 100),
    };
  });

  // What-If Simulation Calculations
  const calculateSimImpact = () => {
    const guestDelta = simGuests - event.guestCount;
    const budgetDelta = simBudget - event.budget;
    const perHeadEst = Math.round((totalEst * 0.35) / (event.guestCount || 1));
    const cateringDelta = guestDelta * perHeadEst;

    return {
      guestDelta,
      budgetDelta,
      cateringDelta,
      newProjectedAlloc: totalAllocated + cateringDelta,
    };
  };

  const simImpact = calculateSimImpact();

  const applySimChanges = () => {
    let updatedItems = [...event.budgetItems];
    if (simImpact.cateringDelta !== 0) {
      updatedItems = updatedItems.map((item) => {
        if (item.category.toLowerCase().includes('catering') || item.category.toLowerCase().includes('food')) {
          return { ...item, estimatedCost: Math.max(0, item.estimatedCost + simImpact.cateringDelta) };
        }
        return item;
      });
    }

    onUpdateEvent({
      ...event,
      guestCount: simGuests,
      budget: simBudget,
      budgetItems: updatedItems,
    });

    setShowSimDrawer(false);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Line Item Name',
      'Payee Vendor Name',
      'Estimated Cost',
      'Actual / Quoted Cost',
      'Paid Deposit Amount',
      'Balance Owed',
      'Payment Status',
      'Payment Method',
      'Last Payment Date',
      'Notes',
    ];

    const rows = event.budgetItems.map((item) => {
      const estimated = item.estimatedCost || 0;
      const actual = item.actualCost || 0;
      const paid = item.paidAmount || 0;
      const balance = Math.max(0, (actual || estimated) - paid);

      return [
        `"${(item.category || '').replace(/"/g, '""')}"`,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.payeeName || 'Pending Vendor Selection').replace(/"/g, '""')}"`,
        estimated,
        actual,
        paid,
        balance,
        `"${(item.status || 'unallocated').replace(/"/g, '""')}"`,
        `"${(item.paymentMethod || 'Bank Wire Transfer').replace(/"/g, '""')}"`,
        `"${(item.paymentDate || '').replace(/"/g, '""')}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeTitle = (event.title || 'event').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.setAttribute('download', `${safeTitle}_budget_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auto-Schedule Payment Alerts for Unpaid Budget Items
  const handleAutoSchedulePaymentAlerts = () => {
    const existingAlerts = event.paymentAlerts || [];
    const eventDate = new Date(event.date || '2026-11-28');

    const newAlerts: VendorPaymentAlert[] = [];

    event.budgetItems.forEach((item) => {
      const owed = Math.max(0, (item.actualCost || item.estimatedCost) - (item.paidAmount || 0));
      if (owed > 0) {
        const daysOffset = item.category.toLowerCase().includes('venue')
          ? 14
          : item.category.toLowerCase().includes('catering')
          ? 7
          : 4;
        const dueDateObj = new Date(eventDate.getTime() - daysOffset * 24 * 60 * 60 * 1000);
        const dueDateStr = dueDateObj.toISOString().split('T')[0];

        const existing = existingAlerts.find((a) => a.budgetItemId === item.id);

        newAlerts.push({
          id: existing?.id || `pa-${item.id}-${Date.now()}`,
          budgetItemId: item.id,
          payeeName: item.payeeName || 'Vendor Payee',
          budgetItemName: item.name,
          amountOwed: owed,
          dueDate: item.paymentDate || dueDateStr,
          status: owed > 0 ? 'due_soon' : 'settled',
          category: item.category,
          notes: `Auto-scheduled reminder for balance payment of ${event.currency}${owed.toLocaleString()}`,
        });
      }
    });

    onUpdateEvent({
      ...event,
      paymentAlerts: newAlerts,
    });
  };

  // Toggle Payment Alert for an individual line item
  const handleTogglePaymentAlert = (item: BudgetItem) => {
    const existingAlerts = event.paymentAlerts || [];
    const found = existingAlerts.find((a) => a.budgetItemId === item.id);

    let updated: VendorPaymentAlert[];
    if (found) {
      updated = existingAlerts.filter((a) => a.budgetItemId !== item.id);
    } else {
      const owed = Math.max(0, (item.actualCost || item.estimatedCost) - (item.paidAmount || 0));
      const eventDate = new Date(event.date || '2026-11-28');
      const dueDateObj = new Date(eventDate.getTime() - 5 * 24 * 60 * 60 * 1000);
      const dueDateStr = dueDateObj.toISOString().split('T')[0];

      const newAlert: VendorPaymentAlert = {
        id: `pa-${item.id}-${Date.now()}`,
        budgetItemId: item.id,
        payeeName: item.payeeName || 'Vendor Payee',
        budgetItemName: item.name,
        amountOwed: owed,
        dueDate: item.paymentDate || dueDateStr,
        status: owed > 0 ? 'due_soon' : 'settled',
        category: item.category,
        notes: `Payment alert for ${item.payeeName || item.name}`,
      };
      updated = [...existingAlerts, newAlert];
    }

    onUpdateEvent({
      ...event,
      paymentAlerts: updated,
    });
  };

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

      {/* 1. TOP FINANCIAL LEDGER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
              Deterministic Financial Engine
            </div>
            <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Budget Reality Ledger</h1>
            <p className="text-xs text-gray-400 mt-1">
              Detailed tracking of how much was spent, where funds were reallocated, and to which vendors payments went.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (event.budgetItems.length > 0) {
                  setTxItemId(event.budgetItems[0].id);
                  setTxPayee(event.budgetItems[0].payeeName || '');
                }
                setShowTransactionModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Log Transaction</span>
            </button>
            <button
              onClick={handleAutoSchedulePaymentAlerts}
              className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs font-semibold text-[#D8BC91] transition-all flex items-center gap-1.5 border border-[#3B333B]"
              title="Auto-schedule vendor payment reminders to Command Center based on timeline dates"
            >
              <BellRing className="w-4 h-4 text-[#D8BC91]" />
              <span>Schedule Payment Alerts</span>
            </button>
            <button
              onClick={() => setShowSimDrawer(!showSimDrawer)}
              className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs font-semibold text-[#D8BC91] transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>{showSimDrawer ? 'Close Simulator' : 'What-If Simulator'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs font-semibold text-[#F4EEE5] transition-all flex items-center gap-1.5 border border-[#3B333B]"
              title="Download budget ledger as CSV spreadsheet"
            >
              <Download className="w-4 h-4 text-[#D8BC91]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => onOpenCopilotWithQuery('Optimize my budget allocation')}
              className="px-4 py-2 rounded-xl bg-[#3B333B] text-gray-200 hover:text-white border border-[#3B333B] text-xs font-semibold transition-all"
            >
              AI Optimization
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Strips */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-[#3B333B]">
          <div className="space-y-1">
            <div className="text-xs text-gray-400">Total Target Budget</div>
            <div className="text-2xl font-serif text-[#F4EEE5] font-semibold font-mono">
              {event.currency}{event.budget.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-400">Total Quoted / Spent</div>
            <div className="text-2xl font-serif text-[#D8BC91] font-semibold font-mono">
              {event.currency}{totalAllocated.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-400">Deposits Paid</div>
            <div className="text-2xl font-serif text-[#A7B49A] font-semibold font-mono">
              {event.currency}{totalPaid.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-400">Balance Owed to Payees</div>
            <div className="text-2xl font-serif text-amber-300 font-semibold font-mono">
              {event.currency}{totalBalanceOwed.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1 col-span-2 lg:col-span-1">
            <div className="text-xs text-gray-400">Remaining Reserve</div>
            <div
              className={`text-2xl font-serif font-semibold font-mono ${
                isOverBudget ? 'text-red-400' : 'text-[#E5C384]'
              }`}
            >
              {event.currency}{remainingFunds.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Overbudget Warning */}
        {isOverBudget && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 flex items-center justify-between gap-4 text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Overspending Warning:</strong> Estimated expenditure exceeds budget target by{' '}
                {event.currency}{Math.abs(remainingFunds).toLocaleString()}.
              </span>
            </div>
            <button
              onClick={() => onOpenCopilotWithQuery('Reduce estimated costs by 15%')}
              className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium shrink-0"
            >
              Auto-Trim 15%
            </button>
          </div>
        )}
      </div>

      {/* 2. WHAT-IF SIMULATOR DRAWER */}
      {showSimDrawer && (
        <div className="p-6 rounded-2xl bg-[#29252A] border border-[#D8BC91]/50 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D8BC91]" />
              <h2 className="text-xl font-serif text-[#F4EEE5]">Interactive What-If Simulator</h2>
            </div>
            <span className="text-xs text-gray-400">Real-time trade-off modeling</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Simulated Guest Count</span>
                <span className="font-mono text-[#D8BC91] font-semibold">{simGuests} Guests</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={simGuests}
                onChange={(e) => setSimGuests(Number(e.target.value))}
                className="w-full accent-[#D8BC91]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Simulated Target Budget ({event.currency})</span>
                <span className="font-mono text-[#D8BC91] font-semibold">
                  {event.currency}{simBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={3000000}
                step={25000}
                value={simBudget}
                onChange={(e) => setSimBudget(Number(e.target.value))}
                className="w-full accent-[#D8BC91]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] space-y-3">
            <div className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">
              Before vs After Comparison
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Headcount Delta:</span>
                <div className="font-mono font-semibold text-white">
                  {simImpact.guestDelta >= 0 ? `+${simImpact.guestDelta}` : simImpact.guestDelta} guests
                </div>
              </div>

              <div>
                <span className="text-gray-400">Estimated Catering Shift:</span>
                <div className="font-mono font-semibold text-[#D8BC91]">
                  {simImpact.cateringDelta >= 0 ? '+' : ''}
                  {event.currency}{simImpact.cateringDelta.toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-gray-400">Projected Balance:</span>
                <div className="font-mono font-semibold text-[#A7B49A]">
                  {event.currency}{(simBudget - simImpact.newProjectedAlloc).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSimGuests(event.guestCount);
                  setSimBudget(event.budget);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#3B333B] text-xs text-gray-300 hover:text-white"
              >
                Reset
              </button>
              <button
                onClick={applySimChanges}
                className="px-4 py-1.5 rounded-lg bg-[#D8BC91] text-[#211721] text-xs font-semibold hover:bg-[#E5C384]"
              >
                Approve & Apply Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 RECHARTS VENDOR CATEGORY BAR CHART */}
      <div className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B333B] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D8BC91]" />
              <h2 className="text-xl font-serif text-[#F4EEE5]">Vendor Category Budget Analysis</h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Visualizing target estimated budget versus actual logged expenditure per category.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#D8BC91] inline-block" />
              <span className="text-gray-300">Estimated Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#A7B49A] inline-block" />
              <span className="text-gray-300">Actual / Quoted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#E5C384] inline-block" />
              <span className="text-gray-300">Deposits Paid</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categorySummaries.map((cat) => ({
                category: cat.category.length > 18 ? `${cat.category.substring(0, 15)}...` : cat.category,
                fullCategory: cat.category,
                Estimated: cat.est,
                Actual: cat.act > 0 ? cat.act : cat.est,
                Paid: cat.paid,
              }))}
              margin={{ top: 20, right: 20, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3B333B" vertical={false} />
              <XAxis
                dataKey="category"
                stroke="#A7B49A"
                tick={{ fill: '#A7B49A', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3B333B' }}
              />
              <YAxis
                stroke="#A7B49A"
                tick={{ fill: '#A7B49A', fontSize: 11 }}
                tickFormatter={(val) =>
                  `${event.currency}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                }
                tickLine={false}
                axisLine={{ stroke: '#3B333B' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-[#211721] border border-[#3B333B] rounded-xl shadow-2xl text-xs space-y-1.5 font-mono">
                        <p className="font-serif font-semibold text-[#F4EEE5] text-sm">{data.fullCategory}</p>
                        <div className="space-y-1 pt-1 border-t border-[#3B333B]">
                          <p className="text-[#D8BC91]">
                            Estimated Target: {event.currency}{Number(data.Estimated).toLocaleString()}
                          </p>
                          <p className="text-[#A7B49A]">
                            Actual / Quoted: {event.currency}{Number(data.Actual).toLocaleString()}
                          </p>
                          <p className="text-[#E5C384]">
                            Deposits Paid: {event.currency}{Number(data.Paid).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: 'rgba(216, 188, 145, 0.05)' }}
              />
              <Bar dataKey="Estimated" name="Estimated Budget" fill="#D8BC91" radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Bar dataKey="Actual" name="Actual / Quoted" fill="#A7B49A" radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Bar dataKey="Paid" name="Deposits Paid" fill="#E5C384" radius={[4, 4, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. CATEGORY EXPENDITURE BREAKDOWN CARDS ("WHERE MONEY WAS SPENT") */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D8BC91]" />
          <h2 className="text-xl font-serif text-[#F4EEE5]">Expenditure Distribution by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorySummaries.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#29252A] border border-[#3B333B] hover:border-[#D8BC91]/50 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#A7B49A] uppercase tracking-wider">
                    Category Breakdown
                  </div>
                  <h3 className="text-base font-serif text-white font-semibold">{cat.category}</h3>
                </div>
                <span className="text-xs font-mono text-[#D8BC91] bg-[#211721] px-2 py-1 rounded border border-[#3B333B]">
                  {cat.percentOfBudget}% of Budget
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#3B333B] text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Allocated Cost:</span>
                  <span className="text-white">{event.currency}{cat.est.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Paid to Vendor:</span>
                  <span className="text-[#A7B49A] font-semibold">{event.currency}{cat.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance Owed:</span>
                  <span className="text-amber-300 font-semibold">{event.currency}{(cat.est - cat.paid).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 pt-1 flex items-center justify-between">
                <span>Payee: <strong className="text-gray-200">{cat.primaryPayee}</strong></span>
                <span className="text-[10px] text-gray-500">({cat.itemsCount} line items)</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#211721] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D8BC91]"
                  style={{ width: `${Math.min(100, Math.round((cat.paid / (cat.est || 1)) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ITEMIZED LINE LEDGER ("TO WHOM MONEY WAS SPENT") */}
      <div className="rounded-2xl bg-[#29252A] border border-[#3B333B] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3B333B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif text-[#F4EEE5]">Itemized Line Ledger & Vendor Payees</h2>
            <p className="text-xs text-gray-400">Specify exactly who received payment, amount paid, and payment method.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">Click figures to edit inline</span>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#211721] hover:bg-[#3B333B] text-[#D8BC91] border border-[#3B333B] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#211721] text-[#A7B49A] uppercase tracking-wider font-semibold border-b border-[#3B333B]">
              <tr>
                <th className="py-3 px-4">Line Item / Category</th>
                <th className="py-3 px-4">Paid To Whom (Payee Vendor)</th>
                <th className="py-3 px-4 text-right">Quoted ({event.currency})</th>
                <th className="py-3 px-4 text-right">Paid Deposit ({event.currency})</th>
                <th className="py-3 px-4 text-right">Balance Owed ({event.currency})</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B333B]">
              {event.budgetItems.map((item) => {
                const balance = Math.max(0, (item.actualCost || item.estimatedCost) - (item.paidAmount || 0));
                return (
                  <tr key={item.id} className="hover:bg-[#3B333B]/40 transition-colors">
                    
                    {/* Item Name & Category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {item.category} {item.isContingency && '· (Contingency Reserve)'}
                      </div>
                    </td>

                    {/* Payee / Vendor Recipient Editable */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.payeeName || ''}
                        onChange={(e) => handleItemChange(item.id, 'payeeName', e.target.value)}
                        placeholder="Payee Name..."
                        className="w-44 px-2 py-1 bg-[#211721] border border-[#3B333B] focus:border-[#D8BC91] rounded text-xs text-white outline-none"
                      />
                    </td>

                    {/* Estimated/Quoted Cost */}
                    <td className="py-3 px-4 text-right font-mono">
                      <input
                        type="number"
                        value={item.estimatedCost}
                        onChange={(e) => handleItemChange(item.id, 'estimatedCost', Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-[#211721] border border-[#3B333B] focus:border-[#D8BC91] text-right rounded text-xs text-[#F4EEE5] outline-none"
                      />
                    </td>

                    {/* Paid Deposit Amount */}
                    <td className="py-3 px-4 text-right font-mono">
                      <input
                        type="number"
                        value={item.paidAmount || 0}
                        onChange={(e) => handleItemChange(item.id, 'paidAmount', Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-[#211721] border border-[#3B333B] focus:border-[#D8BC91] text-right rounded text-xs text-[#A7B49A] font-semibold outline-none"
                      />
                    </td>

                    {/* Balance Owed */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-amber-300">
                      {event.currency}{balance.toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4">
                      <select
                        value={item.paymentMethod || 'Bank Wire Transfer'}
                        onChange={(e) => handleItemChange(item.id, 'paymentMethod', e.target.value)}
                        className="px-2 py-1 bg-[#211721] border border-[#3B333B] rounded text-[11px] text-gray-300 outline-none"
                      >
                        <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                        <option value="UPI / NEFT">UPI / NEFT</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Card Payment">Card Payment</option>
                        <option value="Cash Advance">Cash Advance</option>
                      </select>
                    </td>

                    {/* Action Buttons: Alert & Delete */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleTogglePaymentAlert(item)}
                          className={`p-1 transition-colors ${
                            (event.paymentAlerts || []).some((a) => a.budgetItemId === item.id)
                              ? 'text-[#D8BC91]'
                              : 'text-gray-500 hover:text-[#D8BC91]'
                          }`}
                          title={
                            (event.paymentAlerts || []).some((a) => a.budgetItemId === item.id)
                              ? 'Payment Alert Active (Synced to Command Center)'
                              : 'Set Payment Alert in Command Center'
                          }
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete Line Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add New Line Item Form */}
        <form onSubmit={handleAddItem} className="p-4 bg-[#211721] border-t border-[#3B333B] flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="New Line Item Name..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
          />
          <input
            type="text"
            placeholder="Payee / Vendor Name..."
            value={newItemPayee}
            onChange={(e) => setNewItemPayee(e.target.value)}
            className="w-44 px-3 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-gray-300 outline-none"
          >
            <option value="Venue & Stay">Venue & Stay</option>
            <option value="Catering & Spirits">Catering & Spirits</option>
            <option value="Decor & Floral">Decor & Floral</option>
            <option value="Photography & Cinema">Photography & Cinema</option>
            <option value="Entertainment & Music">Entertainment & Music</option>
            <option value="Contingency">Contingency</option>
          </select>
          <input
            type="number"
            value={newItemEst}
            onChange={(e) => setNewItemEst(Number(e.target.value))}
            placeholder="Amount"
            className="w-28 px-3 py-1.5 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* 4.5 SCHEDULED VENDOR PAYMENT ALERTS (COMMAND CENTER SYNCED) */}
      <div className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B333B] pb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#D8BC91]" />
            <div>
              <h2 className="text-xl font-serif text-[#F4EEE5]">Vendor Payment Alerts (Command Center Synced)</h2>
              <p className="text-xs text-gray-400">Automatic timeline-based payment reminders sent directly to your Event Day Command Center.</p>
            </div>
          </div>
          <button
            onClick={handleAutoSchedulePaymentAlerts}
            className="px-3.5 py-1.5 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto-Sync All Reminders</span>
          </button>
        </div>

        {(!event.paymentAlerts || event.paymentAlerts.length === 0) ? (
          <div className="p-5 rounded-xl bg-[#211721] border border-[#3B333B] text-center text-xs text-gray-400 space-y-2">
            <Bell className="w-6 h-6 text-gray-500 mx-auto" />
            <p>No vendor payment alerts scheduled yet.</p>
            <button
              onClick={handleAutoSchedulePaymentAlerts}
              className="px-3 py-1.5 rounded-lg bg-[#3B333B] text-[#D8BC91] text-xs font-semibold hover:bg-[#D8BC91] hover:text-[#211721] transition-all"
            >
              Auto-Schedule Timeline Payment Reminders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.paymentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A7B49A] font-semibold">{alert.payeeName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    Due {alert.dueDate}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{alert.budgetItemName}</div>
                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-[#3B333B]">
                  <span className="text-gray-400">Balance Owed:</span>
                  <span className="text-amber-300 font-semibold">{event.currency}{alert.amountOwed.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-gray-400 pt-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Synced to Command Center
                  </span>
                  <button
                    onClick={() => {
                      setTxItemId(alert.budgetItemId);
                      setTxPayee(alert.payeeName);
                      setTxAmount(alert.amountOwed);
                      setShowTransactionModal(true);
                    }}
                    className="text-[#D8BC91] hover:underline font-semibold"
                  >
                    Log Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. VENDOR RECIPIENTS & PAYMENT RECEIPTS SUMMARY ("TO WHOM PAID") */}
      <div className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B333B] pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#A7B49A]" />
            <h2 className="text-xl font-serif text-[#F4EEE5]">Vendor Recipients & Paid Deposits Ledger</h2>
          </div>
          <button
            onClick={() => {
              if (event.budgetItems.length > 0) {
                setTxItemId(event.budgetItems[0].id);
                setTxPayee(event.budgetItems[0].payeeName || '');
              }
              setShowTransactionModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.budgetItems.filter((i) => (i.paidAmount || 0) > 0).map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A7B49A] font-semibold">{item.payeeName || 'Vendor Payee'}</span>
                <span className="text-[10px] text-gray-400 font-mono">{item.paymentDate || 'Paid'}</span>
              </div>
              <div className="text-sm font-semibold text-white">{item.name}</div>
              <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-[#3B333B]">
                <span className="text-gray-400">Paid: <strong className="text-[#A7B49A]">{event.currency}{item.paidAmount.toLocaleString()}</strong></span>
                <span className="text-gray-400">Rem: <strong className="text-amber-300">{event.currency}{((item.actualCost || item.estimatedCost) - item.paidAmount).toLocaleString()}</strong></span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono pt-1">
                Via: {item.paymentMethod || 'Bank Transfer'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. LOG TRANSACTION MODAL */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleLogTransaction}
            className="w-full max-w-lg bg-[#211721] border border-[#3B333B] rounded-2xl p-6 space-y-4 shadow-2xl text-[#F4EEE5] animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-[#3B333B] pb-3">
              <div className="flex items-center gap-2 text-[#D8BC91]">
                <Receipt className="w-5 h-5" />
                <h3 className="text-lg font-serif">Log Vendor Payment Transaction</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Log a payment or deposit made to a vendor. This automatically updates your actual spent total, paid deposit ledger, and remaining vendor balance.
            </p>

            {/* Select Budget Line Item */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Select Budget Line Item</label>
              <select
                value={txItemId}
                onChange={(e) => handleTxItemSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91]"
                required
              >
                {event.budgetItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category}) — Est: {event.currency}{item.estimatedCost.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Payee / Vendor Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Payee / Vendor Name</label>
              <input
                type="text"
                value={txPayee}
                onChange={(e) => setTxPayee(e.target.value)}
                placeholder="e.g. Fateh Garh Palace / Saffron & Spice"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Payment Amount ({event.currency})
                </label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  min={100}
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91] font-mono"
                  required
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none focus:border-[#D8BC91]"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                value={txMethod}
                onChange={(e) => setTxMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              >
                <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                <option value="UPI / NEFT">UPI / NEFT</option>
                <option value="Cheque">Cheque</option>
                <option value="Card Payment">Card Payment</option>
                <option value="Cash Advance">Cash Advance</option>
              </select>
            </div>

            {/* Notes / Receipt Ref */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Notes / Receipt Reference</label>
              <input
                type="text"
                value={txNotes}
                onChange={(e) => setTxNotes(e.target.value)}
                placeholder="e.g. Invoice #2026-104 deposit"
                className="w-full px-3 py-2 rounded-lg bg-[#29252A] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3B333B]">
              <button
                type="button"
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 rounded-xl bg-[#29252A] text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] font-semibold text-xs transition-all shadow-md"
              >
                Record Payment Transaction
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
