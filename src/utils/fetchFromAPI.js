// Import axios jika belum di-import
import axios from 'axios';

// URL dasar dan opsi untuk RapidAPI
const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const options = {
  params: {
    maxResults: '100'
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  }
};

// Fungsi fetchFromAPI yang ada
export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Fungsi fetchComments yang baru
export const fetchComments = async (videoId) => {
  try {
    const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
      params: {
        part: 'snippet',
        videoId,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        maxResults: 100
      }
    });
    return data.items.map(item => item.snippet.topLevelComment.snippet.textDisplay);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};


export const fetchSuggestions = async (query) => {
  const { data } = await axios.get(`${BASE_URL}/search`, {
    ...options,
    params: {
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 5 // Mengambil hanya 5 saran teratas
    }
  });
  return data.items;
};