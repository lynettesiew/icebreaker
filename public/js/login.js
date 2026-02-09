// Handle login form submission
const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Check if there's an event ID in the URL to redirect to
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event');
        
        if (eventId) {
          document.location.replace(`/event/${eventId}/rsvp`);
        } else {
          document.location.replace('/');
        }
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred. Please try again.');
    }
  }
};

// Handle signup form submission
const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Check if there's an event ID in the URL to redirect to
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event');
        
        if (eventId) {
          document.location.replace(`/event/${eventId}/rsvp`);
        } else {
          document.location.replace('/');
        }
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to sign up. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('An error occurred. Please try again.');
    }
  }
};

// Attach event listeners
document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);