import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { AuthContext } from '/src/app/AuthContext.js';


export default function SignIn() {
  const router = useRouter();
  const [showError, willShowError] = useState(false); 
  const [message, setMessage] = useState(''); 
  const { setToken, getUsername } = useContext(AuthContext);
  var bp = require('/src/app/Path.js');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);


    let obj = {
      email: data.get('email'),
      password: data.get('password')
    };
    let js = JSON.stringify(obj);

    const response = await fetch(
      bp.buildPath('api/signin'),
      {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      }
    );

    let res = JSON.parse(await response.text());
    if (res.hasOwnProperty('accessToken')) {
      setToken(res.accessToken);
      await getUsername(res.accessToken);
      router.push('/home');
    }

    else {
      setMessage("Incorrect Email or Password");
      willShowError(true);
      console.log("failed login");
    }
    
  };

  return (
    <Stack direction="column" sx={{justifyContent: 'center'}}>
      <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0 }}
      sx={{justifyContent: 'center', display: 'flex'}}
    >

      <Container component="main" maxWidth="xs"
        sx={{
          height: '25vw',
          background: '#000000',
          boxShadow: '0px 0px 70vw rgba(188, 113, 223, 0.6)',
          marginTop: '14vw',
          border: '1px solid rgba(188, 113, 223, 1)',
          boxSizing: 'border-box'
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1.7,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', boxShadow: '0px 0px 20px rgba(188, 113, 223, 0.9)'}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="../signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
  
    </motion.div>
    <Container sx={{alignItems: 'flex-start', width: '28%', justifyContent: 'center'}}>
        {showError ? <Alert sx={{ mt:1, display:'flex' }} variant="outlined" severity="error">{message}</Alert>: <></>}
      </Container>
    </Stack>
    
  );
}
