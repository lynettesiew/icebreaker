// Handle logout
const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/login');
    } else {
      alert('Failed to log out. Please try again.');
    }
  } catch (err) {
    console.error('Logout error:', err);
    alert('An error occurred. Please try again.');
  }
};

// Attach event listener
const logoutButton = document.querySelector('#logout');
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}