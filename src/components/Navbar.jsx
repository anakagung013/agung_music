import { Stack, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { logo } from '../utils/constant';
import SearchBar from './SearchBar';
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon

const Navbar = ({ toggleSidebar }) => ( // Tambahkan toggleSidebar prop
  <Stack
    direction='row'
    alignItems='center'
    p={2}
    sx={{
      position: 'sticky',
      background: '#ffffff',
      top: 0,
      borderBottom: '1px solid #dddddd',
      justifyContent: 'space-between',
      zIndex: 10
    }}
  >
    <IconButton
      onClick={toggleSidebar} // Panggil toggleSidebar saat tombol diklik
      sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }} // Munculkan hanya di layar kecil
    >
      <MenuIcon />
    </IconButton>
    <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} alt='AGUNG MUSIC' height={45} />
      <Typography
        variant='h5'
        fontWeight='700'
        sx={{ ml: '10px', display: { xs: 'none', md: 'block' } }}
      >
        
      </Typography>
    </Link>
    <SearchBar />
  </Stack>
);

export default Navbar;
