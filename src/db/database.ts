import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Event } from '../types/event';
import { SAMPLE_EVENTS } from '../data/sampleEvents';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to data file in workspace root /data/events.json
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

/**
 * Database abstraction service for EVAN. Event Planner backend.
 * Provides persistence, CRUD operations, seeding, and backup features.
 */
export class EventsDatabase {
  private static instance: EventsDatabase;
  private events: Event[] = [];

  private constructor() {
    this.ensureDataDirectoryExists();
    this.events = this.loadFromDisk();
  }

  public static getInstance(): EventsDatabase {
    if (!EventsDatabase.instance) {
      EventsDatabase.instance = new EventsDatabase();
    }
    return EventsDatabase.instance;
  }

  private ensureDataDirectoryExists() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromDisk(): Event[] {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed reading events database file:', err);
    }
    // Initialize with default sample data
    this.saveToDisk(SAMPLE_EVENTS);
    return SAMPLE_EVENTS;
  }

  private saveToDisk(events: Event[]): boolean {
    try {
      this.ensureDataDirectoryExists();
      fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed saving events to database file:', err);
      return false;
    }
  }

  public getAll(): Event[] {
    return [...this.events];
  }

  public getById(id: string): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  public save(event: Event): Event {
    const existingIndex = this.events.findIndex((e) => e.id === event.id);
    const updatedEvent = {
      ...event,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.events[existingIndex] = updatedEvent;
    } else {
      this.events.unshift(updatedEvent);
    }

    this.saveToDisk(this.events);
    return updatedEvent;
  }

  public delete(id: string): boolean {
    const initialLength = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    if (this.events.length !== initialLength) {
      this.saveToDisk(this.events);
      return true;
    }
    return false;
  }

  public seed(): Event[] {
    this.events = [...SAMPLE_EVENTS];
    this.saveToDisk(this.events);
    return this.events;
  }

  public reset(): boolean {
    return this.saveToDisk(SAMPLE_EVENTS);
  }

  public exportBackup(): string {
    return JSON.stringify(this.events, null, 2);
  }

  public getStats() {
    return {
      totalEvents: this.events.length,
      totalBudget: this.events.reduce((sum, e) => sum + (e.budget || 0), 0),
      totalVendors: this.events.reduce((sum, e) => sum + (e.vendors ? e.vendors.length : 0), 0),
      dataFile: DATA_FILE,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const db = EventsDatabase.getInstance();
