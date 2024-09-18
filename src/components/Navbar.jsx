import React, { useEffect, useState } from 'react';
import { Stack, Typography, IconButton, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Slide, FormControl, InputLabel, Select, MenuItem as MuiMenuItem, FormControlLabel, Switch } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../utils/constant';
import SearchBar from './SearchBar';
import MenuIcon from '@mui/icons-material/Menu';
import { gapi } from 'gapi-script';
import { locales } from '../locales'; // Import objek locales
import { useTheme, useMediaQuery } from '@mui/material'; // Add this import

const clientId = '478166253401-1rri0qbpf5fllm8niqhb5g7kutkrss78.apps.googleusercontent.com';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = ({ toggleSidebar }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); // State untuk bahasa
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen is mobile

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl',
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();
        if (user.isSignedIn()) {
          const profile = user.getBasicProfile();
          setProfile({
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
            email: profile.getEmail(),
          });
          setLoggedIn(true);
          fetchPlaylists(); // Fetch playlists after login
        }
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const fetchPlaylists = () => {
    gapi.client.youtube.playlists.list({
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 10
    }).then(response => {
      setPlaylists(response.result.items);
    }).catch(error => {
      console.error('Error fetching playlists:', error);
    });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(googleUser => {
      const profile = googleUser.getBasicProfile();
      setProfile({
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail(),
      });
      setLoggedIn(true);
      fetchPlaylists(); // Fetch playlists after sign in
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setProfile(null);
      setLoggedIn(false);
      setPlaylists([]); // Clear playlists on sign out
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // Ambil teks sesuai bahasa
  const texts = locales[language];

  return (
    <Stack
      direction='row'
      alignItems='center'
      p={2}
      sx={{
        position: 'sticky',
        background: darkMode ? '#333' : '#ffffff',
        top: 0,
        borderBottom: '1px solid #dddddd',
        justifyContent: 'space-between',
        zIndex: 10
      }}
    >
      {/* <IconButton
        onClick={toggleSidebar}
        sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
      >
        <MenuIcon />
      </IconButton> */}
      <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
        {!isMobile && (
          <img src={logo} alt='AGUNG MUSIC' height={45} />
        )}
        <Typography
          variant='h5'
          fontWeight='700'
          sx={{ ml: '10px', display: { xs: 'none', md: 'block' } }}
        >
          {/* Your title or text here */}
        </Typography>
      </Link>
      <SearchBar />
      {loggedIn ? (
        <>
          <Avatar 
            src={profile?.imageUrl} 
            alt={profile?.name} 
            onClick={handleMenuOpen} 
            sx={{ cursor: 'pointer', ml: 2 }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleOpenSettings}>{texts.settings}</MenuItem>
            <MenuItem onClick={handleSignOut}>{texts.signOut}</MenuItem>
          </Menu>
          <Dialog
            open={openSettings}
            onClose={handleCloseSettings}
            TransitionComponent={Transition}
          >
            <DialogTitle>{texts.settings}</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>{texts.language}</InputLabel>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <MuiMenuItem value="en">English</MuiMenuItem>
                  <MuiMenuItem value="id">Indonesian</MuiMenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                  />
                }
                label={texts.darkMode}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSettings}>{texts.close}</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleSignIn} 
          sx={{ ml: 2 }}
        >
          Sign In to YouTube
        </Button>
      )}
    </Stack>
  );
};

export default Navbar;
