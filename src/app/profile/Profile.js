'use client';

import * as React from 'react';
import { useState, useContext } from 'react';
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
import Popup from 'reactjs-popup';
import heartClicked from "/public/heartClicked.png";
import surveyIcon from "/public/surveyIcon.png";
import { useRouter } from 'next/navigation';
import "./styles.css";


export default function Profile() {
  var bp = require('/src/app/Path.js');
  const router = useRouter();
  let { token } = useContext(AuthContext);
  const { setToken } = useContext(AuthContext);
  const { refreshToken } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const grabProfile = async event => {
    if (!token) {
      const newToken = await refreshToken();
      setToken(newToken);
      token = newToken;
    }

    let response = await fetch(bp.buildPath('api/getProfile'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": token,
      }
    });
    var txt = await response.text();
    console.log(txt);
  };

  const openSurvey = async () => {
    router.push('/survey');
  };

  const openPopup = async () => {
    await grabProfile();
    setOpen(true);
  };

  return (
    <Stack direction="column" sx={{ justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
        sx={{ justifyContent: 'center', display: 'flex' }}
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
              style={{ width: '5vw', marginBottom: '20px' }}
            />

            <Typography component="h1" variant="h5" className="h1">
              Your Name
            </Typography>

            <br></br>
            <br></br>

            <Button
                variant="outlined"
                onClick={openPopup}
                startIcon={<img src={heartClicked.src} style={{ width: '1.8vw', height: '1.8vw' }} />}
              >
                View your Favorites
              </Button>

            <br></br>
            <br></br>
            <br></br>

            <Button
                variant="outlined"
                onClick={openSurvey}
                startIcon={<img src={surveyIcon.src} style={{ width: '1.7vw', height: '1.7vw' }} />}
              >
                Retake Survey
            </Button>

            <br></br>
            <br></br>
            <br></br>

            <Link variant="body2" className="body2">
              Reset Password?
            </Link>

            <br></br>

            <Link variant="body2" className="body2">
              Logout
            </Link>

          </Box>
        </Container>

        <Popup open={open} onClose={() => setOpen(false)} modal nested>
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          > 
          <div 
            style={{ 
              padding: '20px', 
              backgroundColor: 'black',
              width: '75vw',
              height: '50vw',
              overflowY: 'auto', 
              color: 'white',
              boxShadow: '0px 0px 70vw rgba(188, 113, 223, 0.6)',
              border: '2px solid rgba(188, 113, 223, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>

            <Typography component="h1" variant="h5" className="h1">
              Your Favorites
            </Typography>
            
            <Button onClick={() => setOpen(false)} style={{ maxWidth: '20vw', alignSelf: 'center' }}>Close</Button>
          </div>
          </motion.div>
        </Popup>
      </motion.div>
    </Stack>
  );
}
