'use client';

import * as React from 'react';
import Logo from "/public/RunwayLogo.png";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import "./styles.css";
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import gitLogo from "/public/gitLogo.png";


function AboutUs() {

    return (
        <React.Fragment>
            <CssBaseline />
        
            <Container maxWidth="sm" component="main" style={{ height: '100vh', fontFamily: 'Raleway, Arial, sans-serif' }}>
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
                            <h2>About Us</h2>
                            <br></br>
                            <p><strong>This is our Large Project for COP4331.</strong></p>
                            <br></br>
                            <p><strong>Members</strong></p>
                            <p>Clifford St. John: Project Manager</p>
                            <p>Nicholas Mistry: API and Database</p>
                            <p>Jacob Plotz: API and Database</p>
                            <p>Tanishqa Sahay: Frontend</p>
                            <p>Steven Hyunh: Mobile</p>
                            <p>Daniel Balasquide: API</p>
                            <br></br>

                            <img 
                                src={gitLogo.src} 
                                alt="GitHub" 
                                loading="lazy"
                                style={{ width: '6vw', cursor: 'pointer'}}
                                onClick={() => window.open('https://github.com/The-Cliff-Face/Proj_Runway/tree/main', '_blank')}
                            />


                        </motion.div>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default AboutUs;
