export type EventType = 'wedding' | 'birthday' | 'community' | 'custom';

export type BudgetItemStatus = 'unallocated' | 'quoted' | 'booked' | 'paid';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type VendorStatus = 'shortlisted' | 'contacted' | 'quoted' | 'booked';
export type VendorSource = 'verified' | 'user_added' | 'ai_estimated';
export type GuestGroup = 'VIP' | 'Family' | 'Friend' | 'Colleague' | 'Community';
export type RsvpStatus = 'not_sent' | 'invited' | 'attending' | 'declined' | 'maybe';

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: BudgetItemStatus;
  vendorId?: string;
  payeeName?: string;
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  isContingency?: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: string;
  dependencies?: string[];
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  quotedPrice?: number;
  depositAmount?: number;
  depositPaid?: boolean;
  rating?: number;
  source: VendorSource;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Guest {
  id: string;
  name: string;
  group: GuestGroup;
  status: RsvpStatus;
  plusOne: boolean;
  dietary?: string;
  accessibility?: string;
  tableAssignment?: string;
}

export interface ColorChip {
  name: string;
  hex: string;
  role: string;
}

export interface DecorDirection {
  category: string;
  title: string;
  description: string;
}

export interface ConceptMoodboard {
  title: string;
  headline: string;
  description: string;
  moodboardImage: string;
  colorPalette: ColorChip[];
  decorDirections: DecorDirection[];
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface NextStepItem {
  id: string;
  title: string;
  reason: string;
  deadline: string;
  priority: TaskPriority;
}

export interface RunSheetItem {
  id: string;
  time: string;
  activity: string;
  owner: string;
  vendorId?: string;
  vendorContact?: string;
  location?: string;
  criticalNotes?: string;
}

export interface VendorPaymentAlert {
  id: string;
  budgetItemId: string;
  payeeName: string;
  budgetItemName: string;
  amountOwed: number;
  dueDate: string;
  status: 'pending' | 'due_soon' | 'overdue' | 'settled';
  category: string;
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  currency: string;
  culturalPreferences?: string;
  styleVibe: string;
  priorities: string[];
  dietaryAccessibility?: string;
  sustainability: boolean;
  brief: string;
  createdAt: string;
  updatedAt: string;
  
  concept: ConceptMoodboard;
  budgetItems: BudgetItem[];
  tasks: Task[];
  vendors: Vendor[];
  guests: Guest[];
  risks: RiskItem[];
  nextSteps: NextStepItem[];
  runSheet: RunSheetItem[];
  paymentAlerts?: VendorPaymentAlert[];
}

export interface WhatIfProposal {
  id: string;
  summary: string;
  explanation: string;
  tradeOffs: string[];
  newBudgetTotal: number;
  budgetDeltas: {
    category: string;
    oldAmount: number;
    newAmount: number;
    reason?: string;
  }[];
  newGuestCount?: number;
  taskChanges: string[];
  appliedStatePartial?: Partial<Event>;
  recommended?: boolean;
}

export interface IntegrityCheckItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  suggestedAction?: string;
}

export interface OnboardingInput {
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  currency: string;
  culturalPreferences?: string;
  styleVibe: string;
  priorities: string[];
  dietaryAccessibility?: string;
  sustainability: boolean;
  brief: string;
}
