// src/components/History.jsx
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Stack, Typography, List, ListItem, ListItemText } from '@mui/material';

const clientId = '478166253401-1rri0qbpf5fllm8niqhb5g7kutkrss78.apps.googleusercontent.com';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = () => {
      gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
      }).then(() => {
        gapi.client.youtube.activities.list({
          mine: true,
          part: 'snippet,contentDetails',
          maxResults: 10,
        }).then(response => {
          setHistory(response.result.items || []);
        }).catch(error => {
          console.error('Error fetching history: ', error);
        });
      });
    };

    gapi.load('client:auth2', fetchHistory);
  }, []);

  return (
    <Stack spacing={2} p={3}>
      <Typography variant="h4">Your Video History</Typography>
      <List>
        {history.length > 0 ? (
          history.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.snippet.title}
                secondary={new Date(item.snippet.publishedAt).toLocaleDateString()}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No history found" />
          </ListItem>
        )}
      </List>
    </Stack>
  );
};

export default History;
