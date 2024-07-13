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

  const handleOkay = () => {
    window.location.href = 'https://shop.agungdev.online/product/agung-music/'; // Redirect URL
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
            This website is specifically for Desktop devices and not for mobile devices. Please purchase the Agung Music application.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkay} color='primary'>
            Buy Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
