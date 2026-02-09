const router = require('express').Router();
const { Event, RSVP } = require('../../models');
const withAuth = require('../../utils/auth');

// Submit RSVP - requires authentication
router.post('/:id/rsvp', withAuth, async (req, res) => {
  try {
    const { answer } = req.body;
    const eventId = req.params.id;
    const userId = req.session.user_id;

    // Validate input
    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide an answer to the question' });
    }

    if (answer.length > 500) {
      return res.status(400).json({ message: 'Answer must be 500 characters or less' });
    }

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has already RSVP'd
    const existingRSVP = await RSVP.findOne({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });

    if (existingRSVP) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    // Create RSVP
    const newRSVP = await RSVP.create({
      user_id: userId,
      event_id: eventId,
      answer: answer.trim(),
    });

    res.status(200).json({ 
      message: 'RSVP submitted successfully!',
      rsvp: newRSVP 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit RSVP' });
  }
});

module.exports = router;