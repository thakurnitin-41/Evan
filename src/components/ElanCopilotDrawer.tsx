import React, { useState } from 'react';
import { Event, WhatIfProposal } from '../types/event';
import { askCopilotApi } from '../services/api';
import { Sparkles, X, Send, Sliders, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface ElanCopilotDrawerProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onApplyProposal: (proposal: WhatIfProposal) => void;
  initialQuery?: string;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  proposal?: WhatIfProposal | null;
}

export const ElanCopilotDrawer: React.FC<ElanCopilotDrawerProps> = ({
  event,
  isOpen,
  onClose,
  onApplyProposal,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am EVAN. Intelligence, your context-aware event strategist. I have analyzed "${event.title}" (${event.guestCount} guests, ${event.currency}${event.budget.toLocaleString()} budget). How can I optimize your plan today?`,
    },
  ]);
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll ref
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If initialQuery changes from props
  React.useEffect(() => {
    if (initialQuery) {
      setInputText(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Prevent duplicate sending if last message by user was identical
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'user' && lastMsg.text === text) {
      return;
    }

    const userMsg: MessageItem = { id: `m-${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const { reply, proposal } = await askCopilotApi(event.id, text);

    const assistantMsg: MessageItem = {
      id: `m-bot-${Date.now()}`,
      sender: 'assistant',
      text: reply,
      proposal,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const presetQueries = [
    'Reduce my estimated costs by 15% without losing the premium feel',
    'What happens to the budget if I add 30 guests?',
    'Create a seven-day priority checklist',
    'Suggest an alternative if my outdoor venue becomes unavailable',
    'Make this celebration more sustainable',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#211721] border-l border-[#3B333B] shadow-2xl flex flex-col text-[#F4EEE5] animate-slideIn">
      
      {/* Header */}
      <div className="p-4 bg-[#29252A] border-b border-[#3B333B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D8BC91]" />
          <div>
            <h2 className="text-base font-serif font-semibold text-[#F4EEE5]">EVAN. Intelligence</h2>
            <div className="text-[10px] text-[#A7B49A]">Context-aware plan strategist</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#3B333B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-2 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#D8BC91] text-[#211721] font-medium rounded-tr-none'
                  : 'bg-[#29252A] text-gray-200 border border-[#3B333B] rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>

            {/* WHAT-IF SIMULATION PROPOSAL CARD */}
            {msg.proposal && (
              <div className="w-full p-4 rounded-xl bg-[#29252A] border border-[#D8BC91]/60 space-y-3 shadow-lg">
                <div className="flex items-center gap-1.5 text-[#D8BC91] font-semibold">
                  <Sliders className="w-4 h-4" />
                  <span>Proposed What-If Simulation</span>
                </div>

                <div className="text-sm font-serif font-bold text-white">{msg.proposal.summary}</div>
                <p className="text-xs text-gray-300 font-light">{msg.proposal.explanation}</p>

                {/* Trade-offs List */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-mono text-[#A7B49A] uppercase tracking-wider">
                    Trade-offs & Impacts
                  </div>
                  {msg.proposal.tradeOffs.map((to, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                      <span className="text-[#D8BC91]">·</span>
                      <span>{to}</span>
                    </div>
                  ))}
                </div>

                {/* Delta Breakdown */}
                {msg.proposal.budgetDeltas && msg.proposal.budgetDeltas.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#3B333B]">
                    <div className="text-[10px] font-mono text-gray-400">Budget Reallocations</div>
                    {msg.proposal.budgetDeltas.map((d, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-mono">
                        <span className="text-gray-300">{d.category}:</span>
                        <span className="text-[#D8BC91]">
                          {event.currency}{d.oldAmount.toLocaleString()} → {event.currency}{d.newAmount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Explicit Approval Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onApplyProposal(msg.proposal!)}
                    className="w-full py-2 rounded-xl bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Apply Plan Changes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#D8BC91]" />
            <span>Analyzing stored event ledger...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Preset Query Chips */}
      <div className="p-3 bg-[#29252A] border-t border-[#3B333B] overflow-x-auto flex gap-2 shrink-0">
        {presetQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-[#211721] border border-[#3B333B] hover:border-[#D8BC91] text-[11px] text-gray-300 whitespace-nowrap shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-[#29252A] border-t border-[#3B333B] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask ÉLAN Intelligence..."
          className="flex-1 px-3 py-2 rounded-xl bg-[#211721] border border-[#3B333B] focus:border-[#D8BC91] text-xs text-white outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#D8BC91] text-[#211721] disabled:opacity-50 font-bold hover:bg-[#E5C384] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
