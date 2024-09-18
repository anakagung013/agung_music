import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function AlertDialog() {
  const [open, setOpen] = useState(false); // Initially closed

  // Simulate mobile detection
  useEffect(() => {
    const isMobile = window.innerWidth <= 600;
    if (isMobile) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const openAgungMusic = () => {
    const appUrl = 'intent://agungmusic/#Intent;scheme=agungmusic;package=com.zionhuang.music;end';
    const webUrl = 'https://agungdev.com';

    console.log('Attempting to open app URL:', appUrl);

    // Open the app using intent URL
    window.location.href = appUrl;

    // Fallback to website after a delay if the app is not opened
    setTimeout(() => {
      if (document.hasFocus()) {
        console.log('Fallback to web URL:', webUrl);
        window.location.href = webUrl;
      }
    }, 1500); // 1.5 second delay to check if app opened
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          ALERT
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You have been detected using a Mobile Device. To enjoy a good music listening experience, open Agung Music now.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Open in web
          </Button>
          <Button onClick={openAgungMusic} color='primary'>
            Open Agung Music
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
