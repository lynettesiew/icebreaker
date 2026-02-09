const router = require('express').Router();
const { User } = require('../../models');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const userData = await User.create({
      username,
      email,
      password,
    });

    // IMPORTANT: Save BOTH user_id AND username to session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;  // ← This is critical!
      req.session.logged_in = true;

      res.status(200).json({ user: userData, message: 'Account created successfully!' });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    const validPassword = userData.checkPassword(password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    // IMPORTANT: Save BOTH user_id AND username to session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;  // ← This is critical!
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;