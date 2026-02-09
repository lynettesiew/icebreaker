const User = require('./User');
const Event = require('./Event');
const RSVP = require('./RSVP');

// User and Event associations (for event ownership)
User.hasMany(Event, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Event.belongsTo(User, {
  foreignKey: 'user_id'
});

// RSVP associations - CRITICAL for success page
RSVP.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(RSVP, {
  foreignKey: 'user_id'
});

RSVP.belongsTo(Event, {
  foreignKey: 'event_id'
});

Event.hasMany(RSVP, {
  foreignKey: 'event_id'
});

// Many-to-many relationship through RSVP
User.belongsToMany(Event, {
  through: RSVP,
  foreignKey: 'user_id'
});

Event.belongsToMany(User, {
  through: RSVP,
  foreignKey: 'event_id'
});

module.exports = { User, Event, RSVP };