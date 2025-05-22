const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/test', (req, res) => {
  res.json({ message: 'likedMovies test works' });
});

router.post('/', async (req, res) => {
  const { title, overview } = req.body;

  const { data, error } = await supabase
    .from('likedMovies') 
    .insert([{ title, overview }]);

  if (error) {
    console.error('Supabase insert error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Movie saved!', data });
});

module.exports = router;
