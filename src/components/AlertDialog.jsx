import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export default function AlertDialog() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
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
          {'This is NOT REAL Youtube'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            This site is not the real Youtube. I created this site for
            educational purposes only. Under no circumstance shall I have any
            liability to you for any loss or damage of any kind incurred as a
            result of the use of the site or reliance on any information
            provided on the site. Your use of the site and your reliance on any
            information on the site is solely at your own risk.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
