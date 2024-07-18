'use client';

import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { motion } from 'framer-motion';
import Stack from '@mui/material/Stack';
import appicon1 from "/public/appicon1.png";
import Button from '@mui/material/Button';
import { AuthContext } from '/src/app/AuthContext.js';
import "./styles.css";


export default function Profile() {
  var bp = require('/src/app/Path.js');
  let { token } = useContext(AuthContext);
  const { setToken } = useContext(AuthContext);
  const { refreshToken } = useContext(AuthContext);

  const grabProfile = async event => {

    if (!token) {
      const newToken = await refreshToken();
      setToken(newToken);
      token = newToken;
      
    }

    let response = await fetch(bp.buildPath('api/getProfile'),
      {method:'POST', 
      headers:{
          'Content-Type': 'application/json',
          "authorization": token,
      }});
      var txt = await response.text();
      console.log(txt);
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
          height: '36vw',
          background: '#000000',
          boxShadow: '0px 0px 70vw rgba(188, 113, 223, 0.6)',
          marginTop: '10vw',
          border: '1.5px solid rgba(188, 113, 223, 1)',
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
          <img
            src={appicon1.src}
            loading="lazy"
            style={{ width: '4.5vw', marginBottom: '20px'}}
            />

          <Typography component="h1" variant="h5" class="h1">
            Your Profile
          </Typography>
          
          <Box component="form" >
            
            <Grid container>
              <Grid item xs>
                <Link variant="body2" class="body2">
                  Reset Password?
                </Link>
              </Grid>
              <Grid item>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <p>Your Wishlist:</p>
            <Button onClick={grabProfile} >View</Button>
          </Box>

          <Link variant="body2" class="body2"><strong>
            Retake Survey
          </strong></Link>

          <Link variant="body2" class="body2">
            Logout
          </Link>



        </Box>
        
      </Container>
  
    </motion.div>
    </Stack>
    
  );
}
