const User = require('./User');
const Event = require('./Event');
const RSVP = require('./RSVP');

// Define associations
User.hasMany(Event, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Event.belongsTo(User, {
  foreignKey: 'user_id'
});

User.belongsToMany(Event, {
  through: RSVP,
  foreignKey: 'user_id'
});

Event.belongsToMany(User, {
  through: RSVP,
  foreignKey: 'event_id'
});

module.exports = { User, Event, RSVP };