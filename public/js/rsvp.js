// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Handle RSVP form submission
  const rsvpForm = document.querySelector('.rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', rsvpFormHandler);
  }

  // Character counter functionality
  const answerTextarea = document.querySelector('#answer');
  const charCount = document.querySelector('.char-count');

  if (answerTextarea && charCount) {
    answerTextarea.addEventListener('input', () => {
      const length = answerTextarea.value.length;
      charCount.textContent = `${length}/500 characters`;
      
      // Change color if approaching limit
      if (length > 450) {
        charCount.style.color = '#EF4444'; // red
      } else if (length > 400) {
        charCount.style.color = '#F59E0B'; // orange
      } else {
        charCount.style.color = '#6B7280'; // default gray
      }
    });
  }
});

// RSVP form handler
const rsvpFormHandler = async (event) => {
  event.preventDefault();

  const answer = document.querySelector('#answer').value.trim();
  const eventId = document.querySelector('.rsvp-form').dataset.eventId;

  if (!answer) {
    alert('Please provide an answer to the icebreaker question.');
    return;
  }

  if (answer.length > 500) {
    alert('Your answer must be 500 characters or less.');
    return;
  }

  if (eventId) {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace(`/event/${eventId}/success`);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit RSVP. Please try again.');
      }
    } catch (err) {
      console.error('RSVP error:', err);
      alert('An error occurred. Please try again.');
    }
  } else {
    alert('Event information is missing. Please try again.');
  }
};