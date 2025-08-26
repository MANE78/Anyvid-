const express = require('express');
const serverless = require('serverless-http');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const router = express.Router();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

router.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'A valid YouTube URL is required.' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url, // Get highest quality thumbnail
      formats: ytdl.filterFormats(info.formats, 'videoandaudio'),
    };
    res.status(200).json(videoDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch video information: ${error.message}` });
  }
});

// Use the router for paths starting with /api
// e.g., the handler for POST /api/download is in this router
app.use('/api/', router);

// Export the handler for Netlify
module.exports.handler = serverless(app);
