import { db } from './database';

console.log('Seeding EVAN. Events Database...');
const seededEvents = db.seed();
console.log(`Database seeded successfully with ${seededEvents.length} events:`);
seededEvents.forEach((evt) => {
  console.log(`- [${evt.id}] ${evt.title} (${evt.type}, Budget: ${evt.currency}${evt.budget.toLocaleString()})`);
});
console.log('Database location:', db.getStats().dataFile);
