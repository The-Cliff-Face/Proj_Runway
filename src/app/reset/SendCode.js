'use client';

import * as React from 'react';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { AuthContext } from '../AuthContext';
import Popup from 'reactjs-popup';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import ErrorPopup from '../home/tabs/components/ErrorPopup';
import "./styles.css";

export default function SendCode({ setPageNumber, email, setEmail }) {
    const router = useRouter();
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    var bp = require('/src/app/Path.js');

    const handleError = (message="Invalid email") => {
        setErrorMessage(message);
        setIsErrorPopupOpen(true);
    };
    
    async function sender() {
        
        let js = JSON.stringify({ email: email });

        const response = await fetch(
            bp.buildPath('api/initiate_reset_password'),
            {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        let res = JSON.parse(await response.text());

        if (res.error === "") {
            console.log("we sent something");
            setPageNumber(1);
        } else {
            console.log(res.error);
            handleError(res.error);
        }
    };

  return (
    <Container 
        maxWidth="sm"
        component="main"
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}
    >
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5" className="h1">
          Reset Password
        </Typography>

        <Typography variant="body1" align="center" gutterBottom>
            Please follow the following instructions to successfully reset your password.
        </Typography>

        <TextField
            margin="normal"
            required
            fullWidth
            label="Enter your email"
            onChange={(e) => {setEmail(e.target.value);}}
        />

        <Typography variant="body1" align="center" gutterBottom>
            A code will be sent to your registered email.
        </Typography>

        <br></br>

        <Button
          variant="outlined"
          onClick={sender}
          style={{ maxWidth: '20vw', marginTop: '2rem' }}
        >
          Send Code
        </Button>
      </motion.div>
    </Container>
  );
}
