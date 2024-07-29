import axios from 'axios';

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {
  url: BASE_URL,
  params: {
    maxResults: '20'
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  }
};

const allowedCategories = ['Official Music Video', 'Official Music Audio'];

export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);
  const filteredData = data.items.filter(item => {
    const title = item.snippet.title.toLowerCase();
    const channelTitle = item.snippet.channelTitle.toLowerCase();
    
    return (
      allowedCategories.some(category => title.includes(category.toLowerCase())) ||
      channelTitle.includes('topic')
    );
  });
  return filteredData;
};
