'use client';

import * as React from 'react';
import Logo from "/public/RunwayLogo.png";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import "./styles.css";
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import Head from 'next/head';

function WelcomeLogin() {
    return (
        <React.Fragment>
            <CssBaseline />
        
            <Container maxWidth="sm" component="main" style={{ height: '52vw', fontFamily: 'Raleway, Arial, sans-serif' }}>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="flex-start" 
                    alignItems="center" 
                    height="85%"
                    textAlign="center"
                >
                    <img
                        src={Logo.src}
                        loading="lazy"
                        style={{ width: '15vw', marginBottom: '20px', marginTop: '20px' }}
                    />
                    <Box 
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="center" 
                        alignItems="center" 
                        flex="1"
                    >
                        <motion.div 
                            className="container"
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.75 }}
                            style={{ fontFamily: 'Raleway' }}
                        >
                            <p1><strong>Welcome Username!</strong></p1>
                            <br></br>
                            <p1>Please take a quick survey to help us personalize your browsing experience on our website.</p1>
                        </motion.div>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default WelcomeLogin;
