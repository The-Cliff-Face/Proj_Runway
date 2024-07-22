import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';
import { useRouter } from 'next/router';

// The current app bar is designed for a logged in user.
// We need to keep track of whether or not the user is signed in
// somehow and conditionally render a different navbar if they are
// not signed in, as they cannot access the gallery home page, profile page, or logout.
// I think a good setup would be the home page redirects to the root (welcome) page,
// my profile changes to login, and logout can change to signup.

// https://mui.com/material-ui/react-app-bar/
export default function RunwayAppBar() {
  const {logout } = React.useContext(AuthContext);
  var bp = require('/src/app/Path.js');


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button sx={{ mr: 'auto' }} href="/home" startIcon={<HomeIcon />} size="large" color="inherit">Home</Button>
          <Button href="/profile" startIcon={<PersonIcon />} size="large" color="inherit">My Profile</Button>
          <Button href="/info" startIcon={<InfoIcon />} size="large" color="inherit">About Us</Button>
          <Button href='/' onClick={(logout)} startIcon={<LogoutIcon />} size="large" color="inherit">Log Out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
