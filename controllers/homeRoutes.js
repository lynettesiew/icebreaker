const router = require('express').Router();
const { User, Event, RSVP } = require('../models');
const withAuth = require('../utils/auth');

// Homepage - Show event WITHOUT requiring login
router.get('/', async (req, res) => {
  try {
    const eventData = await Event.findOne({
      order: [['date', 'ASC']],
    });

    if (!eventData) {
      return res.status(404).json({ message: 'No events found' });
    }

    const event = eventData.get({ plain: true });

    // Count attendees
    const attendeeCount = await RSVP.count({
      where: { event_id: event.id }
    });

    res.render('homepage', {
      event,
      attendeeCount,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// RSVP page - requires authentication
router.get('/event/:id/rsvp', withAuth, async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id);

    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has already RSVP'd
    const existingRSVP = await RSVP.findOne({
      where: {
        user_id: req.session.user_id,
        event_id: req.params.id
      }
    });

    if (existingRSVP) {
      return res.redirect(`/event/${req.params.id}/success`);
    }

    const event = eventData.get({ plain: true });

    res.render('rsvp', {
      event,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Success page - requires authentication
router.get('/event/:id/success', withAuth, async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id);

    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = eventData.get({ plain: true });

    // Get the current user's RSVP
    const userRSVP = await RSVP.findOne({
      where: {
        user_id: req.session.user_id,
        event_id: req.params.id
      }
    });

    if (!userRSVP) {
      return res.redirect(`/event/${req.params.id}/rsvp`);
    }

    // Get ALL attendees including current user
    const attendeesData = await RSVP.findAll({
      where: { event_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        }
      ],
    });

    // Filter out current user to show only other attendees
    const attendees = attendeesData
      .filter(rsvp => rsvp.user_id !== req.session.user_id)
      .map(rsvp => ({
        username: rsvp.User.username,
        answer: rsvp.answer,
      }));

    res.render('success', {
      event,
      userAnswer: userRSVP.answer,
      attendees,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Success page error:', err);
    res.status(500).json({ message: 'Error loading success page', error: err.message });
  }
});

module.exports = router;