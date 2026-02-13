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

// Dashboard - View all user's RSVPs (READ)
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userRSVPs = await RSVP.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'date', 'location', 'prompt'],
        }
      ],
      order: [['created_at', 'DESC']],
    });

    const rsvps = userRSVPs.map(rsvp => {
      const rsvpData = rsvp.get({ plain: true });
      const eventData = rsvpData.event || rsvpData.Event || {};
      return {
        id: rsvpData.id,
        event_id: rsvpData.event_id,
        answer: rsvpData.answer,
        event_title: eventData.title,
        event_date: eventData.date,
        event_location: eventData.location,
        event_prompt: eventData.prompt,
      };
    });

    res.render('dashboard', {
      rsvps,
      username: req.session.username,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Error loading dashboard', error: err.message });
  }
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

// Edit RSVP page - UPDATE (requires authentication)
router.get('/event/:id/edit', withAuth, async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id);

    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get user's RSVP
    const rsvp = await RSVP.findOne({
      where: {
        user_id: req.session.user_id,
        event_id: req.params.id
      }
    });

    if (!rsvp) {
      return res.redirect(`/event/${req.params.id}/rsvp`);
    }

    const event = eventData.get({ plain: true });

    res.render('edit-rsvp', {
      event,
      currentAnswer: rsvp.answer,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Edit RSVP error:', err);
    res.status(500).json({ message: 'Error loading edit page', error: err.message });
  }
});

// Success page - requires authentication
router.get('/event/:id/success', withAuth, async (req, res) => {
  try {
    console.log('Success page - User ID:', req.session.user_id);
    console.log('Success page - Username in session:', req.session.username);
    
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

    // Get ALL attendees including current user - with better error handling
    const attendeesData = await RSVP.findAll({
      where: { event_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
          required: true, // This ensures we only get RSVPs that have associated users
        }
      ],
    });

    console.log('Total RSVPs found:', attendeesData.length);

    // Filter out current user to show only other attendees
    const attendees = attendeesData
      .filter(rsvp => rsvp.user_id !== req.session.user_id)
      .map(rsvp => {
        // Safely access the User association
        const userData = rsvp.User || rsvp.user;
        
        if (!userData) {
          console.error('Missing User data for RSVP:', rsvp.id);
          return null;
        }
        
        return {
          username: userData.username,
          answer: rsvp.answer,
        };
      })
      .filter(attendee => attendee !== null); // Remove any null entries

    console.log('Attendees to display:', attendees.length);

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