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
    // Open the app if installed, otherwise redirect to website
    const appUrl = 'agungmusic://';
    const webUrl = 'https://agungdev.com';

    // Check if the app is installed
    const ifr = document.createElement('iframe');
    ifr.src = appUrl;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);

    setTimeout(() => {
      document.body.removeChild(ifr);
      window.location.href = webUrl;
    }, 2500); // Wait for 2.5 seconds
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
