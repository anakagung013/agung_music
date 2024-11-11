import React, { useEffect, useState } from 'react';
import { 
  Stack, 
  Typography, 
  IconButton, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Slide, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem as MuiMenuItem, 
  FormControlLabel, 
  Switch,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../utils/constant';
import SearchBar from './SearchBar';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings'; // Tambahkan impor ini
import { gapi } from 'gapi-script';
import { locales } from '../locales';
import { useTheme, useMediaQuery } from '@mui/material';

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
  const [language, setLanguage] = useState('en');
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
          // fetchPlaylists(); // Fetch playlists after login
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
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Toggle dark mode class on body
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);
  
  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

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
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2}
        >
          {/* Tambahkan ikon settings */}
          <Tooltip title={texts.settings}>
            <IconButton 
              onClick={handleOpenSettings}
              sx={{ 
                color: darkMode ? 'white' : 'black',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'rotate(45deg)'
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Avatar 
            src={profile?.imageUrl} 
            alt={profile?.name} 
            onClick={handleMenuOpen} 
            sx={{ 
              cursor: 'pointer', 
              border: `2px solid ${darkMode ? 'white' : 'primary.main'}` 
            }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignOut}>{texts.signOut}</MenuItem>
          </Menu>
        </Stack>
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

      {/* Dialog Settings */}
      <Dialog
        open={openSettings}
        onClose={handleCloseSettings}
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: darkMode ? '#1e1e1e' : 'white',
            color: darkMode ? 'white' : 'black'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>{texts.settings}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: darkMode ? 'white' : 'black' }}>
              {texts.language}
            </InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{ 
                color: darkMode ? 'white' : 'black',
                '& .MuiSelect-icon': {
                  color: darkMode ? 'white' : 'black'
                }
              }}
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
            sx={{ 
              color: darkMode ? 'white' : 'black' 
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseSettings}
            sx={{ 
              color: darkMode ? 'white' : 'primary.main' 
            }}
          >
            {texts.close}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Navbar;
