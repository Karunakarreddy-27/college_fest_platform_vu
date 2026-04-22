const Event = require('../models/Event');
const { buildDefaultEvents } = require('../data/defaultEvents');

const seedDefaultEvents = async ({ onlyIfNoActiveEvents = false } = {}) => {
  if (onlyIfNoActiveEvents) {
    const existingActiveEvents = await Event.countDocuments({ isActive: true });
    if (existingActiveEvents > 0) {
      return {
        inserted: 0,
        totalActive: existingActiveEvents,
        skipped: true
      };
    }
  }

  const defaultEvents = buildDefaultEvents();
  let inserted = 0;

  for (const event of defaultEvents) {
    const result = await Event.updateOne(
      { name: event.name },
      { $setOnInsert: event },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    }
  }

  const totalActive = await Event.countDocuments({ isActive: true });
  return {
    inserted,
    totalActive,
    skipped: false
  };
};

module.exports = {
  seedDefaultEvents
};
