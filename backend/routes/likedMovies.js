const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// test route
router.get('/test', (req, res) => {
  res.json({ message: 'likedMovies test works' });
});

// POST /api/saved — save a movie
router.post('/', async (req, res) => {
  const { title, overview } = req.body;

  const { data, error } = await supabase
    .from('likedMovies')
    .insert([{ title, overview }]);

  if (error) {
    console.error('Supabase insert error:', error);

    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Movie saved!', data });
});

// retrives saved movies
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('likedMovies')
    .select('*');

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

module.exports = router;
