// seeds/seed.js
const sequelize = require('../config/connection');
const { User, Event, RSVP } = require('../models');
const userData = require('./users.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // ⚠️ This wipes the database

  // Create users from JSON
  const users = await User.bulkCreate(userData);
  console.log(`${users.length} users seeded!`);

  // Create the first event
  const event = await Event.create({
    title: 'NYC Tech Mixer',
    description: 'An evening of meaningful connections with fellow builders, designers, and dreamers.',
    date: new Date('2025-03-15T18:00:00'),
    location: 'The Loft, 123 Main St, Brooklyn',
    host_name: 'Alex Chen',
    prompt: "What's your superpower?",
  });

  console.log(`Event created: ${event.title} (ID: ${event.id})`);
  
  process.exit(0);
};

seedDatabase();