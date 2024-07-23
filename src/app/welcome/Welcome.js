'use client';

import * as React from 'react';
import styles from "./styles.css";
import Logo from "/public/RunwayLogo.png";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { motion } from 'framer-motion';


console.log(Logo);

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
);

function Welcome() {
    function SignIn() {
        window.location.href = "/signin";
    }

    function SignUp(){
        window.location.href = "/signup";
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
            <motion.div 
                className="container"
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.75 }}
            >
                <p1>Welcome to</p1>
                <img
                    alt="Runway"
                    src={Logo.src}
                    loading="lazy"
                />
                <p2>FIND WHAT SPEAKS TO YOU</p2>
            </motion.div>
        </Container>

        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
      >
        <ButtonGroup className="buttonText" variant="text" aria-label="Basic button group">
          <Button onClick={SignIn}>Login</Button>
          <Button onClick={SignUp}>Signup</Button>
        </ButtonGroup>
      </Box>
        
      </React.Fragment>
    );
}

export default Welcome;