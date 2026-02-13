// Handle RSVP cancellation
const cancelRSVP = async (eventId, eventTitle) => {
  const confirmed = confirm(
    `Are you sure you want to cancel your RSVP to "${eventTitle}"?\n\n` +
    `This will remove your icebreaker answer and you'll no longer be listed as attending.`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/events/${eventId}/rsvp`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // Show success message
      alert('RSVP cancelled successfully!');
      // Reload the page to update the list
      location.reload();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to cancel RSVP. Please try again.');
    }
  } catch (err) {
    console.error('Cancel RSVP error:', err);
    alert('An error occurred. Please try again.');
  }
};

// Attach event listeners to all cancel buttons
document.addEventListener('DOMContentLoaded', () => {
  const cancelButtons = document.querySelectorAll('.cancel-rsvp-btn');
  
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const eventId = this.dataset.eventId;
      const eventTitle = this.dataset.eventTitle;
      cancelRSVP(eventId, eventTitle);
    });
  });
});