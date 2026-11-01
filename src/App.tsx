import React, { useState, useEffect } from 'react';
import { Event, EventType, OnboardingInput, WhatIfProposal } from './types/event';
import { SAMPLE_EVENTS } from './data/sampleEvents';
import { fetchEvents, createAiEvent, updateEventApi, fetchIntegrityReport } from './services/api';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { OverviewDashboard } from './components/OverviewDashboard';
import { BudgetRealityEngine } from './components/BudgetRealityEngine';
import { LivingTimeline } from './components/LivingTimeline';
import { VendorMatchbook } from './components/VendorMatchbook';
import { MoodboardStudio } from './components/MoodboardStudio';
import { GuestManager } from './components/GuestManager';
import { CommandCenter } from './components/CommandCenter';
import { ElanCopilotDrawer } from './components/ElanCopilotDrawer';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [activeEvent, setActiveEvent] = useState<Event | null>(SAMPLE_EVENTS[0]);
  const [isLanding, setIsLanding] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals & Drawers
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [onboardingType, setOnboardingType] = useState<EventType>('wedding');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('');

  // Integrity report state
  const [integrityReport, setIntegrityReport] = useState<{ healthScore: number; issues: any[] }>({
    healthScore: 92,
    issues: [],
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Load from API
  useEffect(() => {
    async function loadData() {
      const data = await fetchEvents();
      if (data && data.length > 0) {
        setEvents(data);
        setActiveEvent(data[0]);
      }
    }
    loadData();
  }, []);

  // Update Integrity Report whenever active event changes
  useEffect(() => {
    if (activeEvent) {
      fetchIntegrityReport(activeEvent.id).then((rep) => {
        if (rep) setIntegrityReport(rep);
      });
    }
  }, [activeEvent]);

  // Handlers
  const handleSelectEvent = (event: Event) => {
    setActiveEvent(event);
    setIsLanding(false);
    showToast(`Loaded "${event.title}" plan workspace.`);
  };

  const handleOpenCreateWithType = (type: EventType) => {
    setOnboardingType(type);
    setShowOnboardingModal(true);
  };

  const handleOpenCreateGeneral = () => {
    setOnboardingType('wedding');
    setShowOnboardingModal(true);
  };

  const handleCreateOnboardingSubmit = async (input: OnboardingInput) => {
    setIsGeneratingPlan(true);
    const newEvt = await createAiEvent(input);
    setEvents((prev) => [newEvt, ...prev]);
    setActiveEvent(newEvt);
    setIsGeneratingPlan(false);
    setShowOnboardingModal(false);
    setIsLanding(false);
    setActiveTab('overview');
    showToast(`Plan created successfully for "${newEvt.title}"!`);
  };

  const handleUpdateActiveEvent = (updated: Event) => {
    setActiveEvent(updated);
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    updateEventApi(updated);
  };

  const handleOpenCopilotWithQuery = (query: string) => {
    setCopilotQuery(query);
    setCopilotOpen(true);
  };

  // Apply What-If Proposal to stored data
  const handleApplyProposal = (proposal: WhatIfProposal) => {
    if (!activeEvent) return;

    let updatedBudgetItems = [...activeEvent.budgetItems];
    if (proposal.budgetDeltas && proposal.budgetDeltas.length > 0) {
      proposal.budgetDeltas.forEach((delta) => {
        updatedBudgetItems = updatedBudgetItems.map((item) => {
          if (item.category.toLowerCase().includes(delta.category.toLowerCase())) {
            return { ...item, estimatedCost: delta.newAmount };
          }
          return item;
        });
      });
    }

    const updatedEvent: Event = {
      ...activeEvent,
      budget: proposal.newBudgetTotal || activeEvent.budget,
      guestCount: proposal.newGuestCount || activeEvent.guestCount,
      budgetItems: updatedBudgetItems,
    };

    handleUpdateActiveEvent(updatedEvent);
    setCopilotOpen(false);
    showToast(`Applied proposal: "${proposal.summary}"`);
  };

  return (
    <div className="min-h-screen bg-[#211721] text-[#F4EEE5] font-sans selection:bg-[#D8BC91] selection:text-[#211721] flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-[#29252A] border border-[#D8BC91] shadow-2xl text-xs text-[#F4EEE5] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#D8BC91]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Luxury Navigation Top Bar */}
      <Navigation
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenCreate={handleOpenCreateGeneral}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenCopilot={() => handleOpenCopilotWithQuery('')}
        integrityScore={integrityReport.healthScore}
        onOpenIntegrity={() => setActiveTab('overview')}
        isLanding={isLanding}
        onGoHome={() => setIsLanding(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLanding ? (
          <LandingPage
            sampleEvents={events}
            onSelectSampleEvent={handleSelectEvent}
            onOpenCreateWithType={handleOpenCreateWithType}
            onOpenCreateGeneral={handleOpenCreateGeneral}
          />
        ) : (
          activeEvent && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'overview' && (
                <OverviewDashboard
                  event={activeEvent}
                  onNavigateTab={setActiveTab}
                  integrityReport={integrityReport}
                  onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetRealityEngine
                  event={activeEvent}
                  onUpdateEvent={handleUpdateActiveEvent}
                  onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'timeline' && (
                <LivingTimeline
                  event={activeEvent}
                  onUpdateEvent={handleUpdateActiveEvent}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'vendors' && (
                <VendorMatchbook
                  event={activeEvent}
                  onUpdateEvent={handleUpdateActiveEvent}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'moodboard' && (
                <MoodboardStudio
                  event={activeEvent}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'guests' && (
                <GuestManager
                  event={activeEvent}
                  onUpdateEvent={handleUpdateActiveEvent}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'command' && (
                <CommandCenter
                  event={activeEvent}
                  onUpdateEvent={handleUpdateActiveEvent}
                  onNavigateTab={setActiveTab}
                />
              )}
            </div>
          )
        )}
      </main>

      {/* Intelligent Onboarding Wizard Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          initialType={onboardingType}
          onClose={() => setShowOnboardingModal(false)}
          onSubmit={handleCreateOnboardingSubmit}
          isLoading={isGeneratingPlan}
        />
      )}

      {/* Persistent ÉLAN Intelligence Copilot Drawer */}
      {activeEvent && (
        <ElanCopilotDrawer
          event={activeEvent}
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          onApplyProposal={handleApplyProposal}
          initialQuery={copilotQuery}
        />
      )}
    </div>
  );
}
