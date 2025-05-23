const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// test endpoint to make sure it's working
router.get('/test', (req, res) => {
  res.json({ message: 'likedMovies test works' });
});

// save a movie to supabase
router.post('/', async (req, res) => {
  const { title, overview, genres } = req.body;

  const { data, error } = await supabase
    .from('likedMovies')
    .insert([{ title, overview, genres }]);

  if (error) {
    console.error('supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'movie saved!', data });
});

// get all saved movies
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('likedMovies')
    .select('*');

  if (error) {
    console.error('supabase fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

module.exports = router;
