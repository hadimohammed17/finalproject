const express = require('express');
const router = express.Router();

console.log('🟢 likedMovies.js loaded');

router.get('/test', (req, res) => {
  console.log('🟢 /api/saved/test hit');
  res.json({ message: '✅ likedMovies test works' });
});

module.exports = router;
