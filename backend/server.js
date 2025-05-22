require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

console.log('🟢 Booting up server.js...');

const likedMoviesRoutes = require('./routes/likedMovies');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ API is alive');
});

app.use('/api/saved', likedMoviesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
