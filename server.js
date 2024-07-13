// server.js atau app.js

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Jika belum diinstall, install dulu dengan npm install cors

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Izinkan CORS untuk semua route

// Endpoint untuk mengambil lirik lagu
app.get('/api/lyrics', async (req, res) => {
  const { title, artist } = req.query;
  const apiKey = '89dd0750ccd99920201b3781d84f4839';
  const lyricsURL = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${title}&q_artist=${artist}&apikey=${apiKey}`;

  try {
    const response = await axios.get(lyricsURL);
    if (response.data.message.body.lyrics) {
      const formattedLyrics = response.data.message.body.lyrics.lyrics_body.replace(/\n{2,}/g, '\n\n');
      const lines = formattedLyrics.split('\n').filter(line => line.trim() !== '');
      res.send(lines.join('\n'));
    } else {
      res.status(404).send('Lyrics not available');
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    res.status(500).send('Error fetching lyrics');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


