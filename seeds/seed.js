// seeds/seed.js
const sequelize = require('../config/connection');
const { User, Event, RSVP } = require('../models');
const userData = require('./usersData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // ⚠️ This wipes the database

  // Create users from JSON (password will be hashed automatically by the model)
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
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

  // Create sample RSVPs so you can see other attendees
  const sampleRSVPs = [
    {
      user_id: users[0].id,
      event_id: event.id,
      answer: "I can talk to anyone about anything - I'm a natural connector!"
    },
    {
      user_id: users[1].id,
      event_id: event.id,
      answer: "I turn coffee into code. Also, I can debug anything while half asleep."
    },
    {
      user_id: users[2].id,
      event_id: event.id,
      answer: "I remember everyone's name after meeting them once - it's my secret weapon!"
    }
  ];

  const rsvps = await RSVP.bulkCreate(sampleRSVPs);
  console.log(`${rsvps.length} sample RSVPs created!`);
  
  process.exit(0);
};

seedDatabase();