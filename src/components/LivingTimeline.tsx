import React, { useState } from 'react';
import { Event, Task, TaskPriority, TaskStatus } from '../types/event';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Plus, Filter, AlertCircle, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';

interface LivingTimelineProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LivingTimeline: React.FC<LivingTimelineProps> = ({ event, onUpdateEvent, onNavigateTab }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Date Shift Tool State
  const [showDateShiftModal, setShowDateShiftModal] = useState(false);
  const [newTargetDate, setNewTargetDate] = useState(event.date);

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Execution');
  const [newDueDate, setNewDueDate] = useState(event.date);
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newOwner, setNewOwner] = useState('Planner');

  // Task Handlers
  const handleToggleStatus = (id: string) => {
    const updatedTasks = event.tasks.map((task) => {
      if (task.id === id) {
        const nextStatus: TaskStatus =
          task.status === 'completed'
            ? 'todo'
            : task.status === 'todo'
            ? 'in_progress'
            : 'completed';
        return { ...task, status: nextStatus };
      }
      return task;
    });
    onUpdateEvent({ ...event, tasks: updatedTasks });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate,
      priority: newPriority,
      status: 'todo',
      owner: newOwner,
    };

    onUpdateEvent({
      ...event,
      tasks: [...event.tasks, newTask],
    });

    setNewTitle('');
  };

  const handleDeleteTask = (id: string) => {
    onUpdateEvent({
      ...event,
      tasks: event.tasks.filter((t) => t.id !== id),
    });
  };

  // Handle Event Date Shift Proposal
  const handleApplyDateShift = () => {
    const oldDateObj = new Date(event.date).getTime();
    const newDateObj = new Date(newTargetDate).getTime();
    const diffDays = Math.round((newDateObj - oldDateObj) / (1000 * 3600 * 24));

    // Recalculate task due dates proportionally
    const shiftedTasks = event.tasks.map((task) => {
      const taskDateObj = new Date(task.dueDate).getTime();
      const newTime = taskDateObj + diffDays * (1000 * 3600 * 24);
      const newDueDateStr = new Date(newTime).toISOString().split('T')[0];
      return { ...task, dueDate: newDueDateStr };
    });

    onUpdateEvent({
      ...event,
      date: newTargetDate,
      tasks: shiftedTasks,
    });

    setShowDateShiftModal(false);
  };

  // Filter Tasks
  const filteredTasks = event.tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(event.tasks.map((t) => t.category)));

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
      
      {/* 1. TIMELINE HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#29252A] border border-[#3B333B] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A7B49A] font-medium">
            Dynamic Milestone Engine
          </div>
          <h1 className="text-3xl font-serif text-[#F4EEE5] mt-1">Living Timeline</h1>
          <p className="text-xs text-gray-400 mt-1">
            Event Date Target: <span className="text-[#D8BC91] font-mono font-semibold">{event.date}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Shift Tool Trigger */}
          <button
            onClick={() => setShowDateShiftModal(true)}
            className="px-4 py-2 rounded-xl bg-[#3B333B] hover:bg-[#D8BC91] hover:text-[#211721] text-xs font-semibold text-[#D8BC91] transition-all flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Shift Event Date</span>
          </button>

          {/* List / Calendar View Switcher */}
          <div className="flex items-center p-1 bg-[#211721] rounded-xl border border-[#3B333B]">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#D8BC91] text-[#211721] font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-[#D8BC91] text-[#211721] font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* 2. DATE SHIFT PROPOSAL MODAL */}
      {showDateShiftModal && (
        <div className="p-6 rounded-2xl bg-[#29252A] border border-[#D8BC91]/50 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-[#D8BC91]">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-xl font-serif text-white">Event Date Shift Blueprint</h2>
          </div>
          <p className="text-xs text-gray-300">
            Shifting your event date will proportionally recalculate target deadlines across all {event.tasks.length} active milestones and flag vendor conflicts.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">New Event Target Date</label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-white outline-none"
              />
            </div>
            <div className="text-xs text-[#A7B49A]">
              Current Date: <span className="font-mono">{event.date}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowDateShiftModal(false)}
              className="px-4 py-2 rounded-xl bg-[#3B333B] text-xs text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyDateShift}
              className="px-4 py-2 rounded-xl bg-[#D8BC91] text-[#211721] text-xs font-semibold hover:bg-[#E5C384]"
            >
              Confirm Date & Recalculate Milestones
            </button>
          </div>
        </div>
      )}

      {/* 3. FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#29252A] border border-[#3B333B]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Task Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#211721] p-1 rounded-lg border border-[#3B333B]">
            {['all', 'todo', 'in_progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md capitalize transition-colors ${
                  statusFilter === st ? 'bg-[#3B333B] text-[#D8BC91]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

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

      {/* 4. TASK CONTENT (LIST OR CALENDAR) */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.status === 'completed'
                  ? 'bg-[#211721]/60 border-[#3B333B] opacity-75'
                  : 'bg-[#29252A] border-[#3B333B] hover:border-[#D8BC91]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(task.id)}
                  className={`mt-0.5 p-1 rounded-lg border transition-all ${
                    task.status === 'completed'
                      ? 'bg-[#A7B49A]/20 border-[#A7B49A] text-[#A7B49A]'
                      : task.status === 'in_progress'
                      ? 'bg-[#D8BC91]/20 border-[#D8BC91] text-[#D8BC91]'
                      : 'border-[#3B333B] text-gray-500 hover:border-gray-400'
                  }`}
                  title="Click to advance status"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                        task.priority === 'high'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          : 'bg-[#3B333B] text-gray-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Category: <span className="text-[#A7B49A]">{task.category}</span> · Owner:{' '}
                    <span className="text-[#D8BC91]">{task.owner}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-xs text-gray-300 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Due: {task.dueDate}</span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar View Mock Grid */
        <div className="p-6 rounded-2xl bg-[#29252A] border border-[#3B333B] space-y-4">
          <div className="text-xs font-semibold text-[#A7B49A] uppercase tracking-wider">
            Calendar Timeline Grid
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.tasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-[#211721] border border-[#3B333B] space-y-2">
                <div className="text-[11px] font-mono text-[#D8BC91]">{task.dueDate}</div>
                <div className="text-sm font-semibold text-white">{task.title}</div>
                <div className="text-xs text-gray-400">{task.owner} ({task.category})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ADD TASK FORM */}
      <form onSubmit={handleAddTask} className="p-4 rounded-xl bg-[#29252A] border border-[#3B333B] flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="New Task Title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-white outline-none"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-white outline-none"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
          className="px-3 py-1.5 rounded-lg bg-[#211721] border border-[#3B333B] text-xs text-gray-300 outline-none"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-[#D8BC91] hover:bg-[#E5C384] text-[#211721] text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

    </div>
  );
};
