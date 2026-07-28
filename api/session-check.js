const { isAuthenticated } = require('../lib/auth');

module.exports = async (req, res) => {
  try {
    const authenticated = await isAuthenticated(req);
    res.status(200).json({ authenticated });
  } catch (err) {
    console.error(err);
    res.status(200).json({ authenticated: false });
  }
};
