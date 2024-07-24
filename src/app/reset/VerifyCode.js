'use client';

import * as React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AuthContext } from '../AuthContext';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Popup from 'reactjs-popup';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import "./styles.css";

export default function VerifyCode({ setPageNumber, email }) {
    const { setToken } = React.useContext(AuthContext);
    var bp = require('/src/app/Path.js');
    const router = useRouter();
    const [otp, setOtp] = React.useState('');
    const [codeA, setCode] = useState('');
    const passwordStrengthDescriptions = [
        'very weak', 'weak', 'medium', 'strong', 'very strong'
    ];

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleChange = (newValue) => {
        setOtp(newValue);
    };

    const codeCompletion = (value) => {
        setCode(value);
    };

    const handlePasswordValidation = (e) => {
        let password = e.target.value;
        let zxcvbn = require('zxcvbn');
        let score = zxcvbn(password).score;

        setPasswordStrength(score);
        setPassword(password);
        setPasswordMatch(password === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        let confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
        setPasswordMatch(password === confirmPassword);
    };

    async function handleComplete(value) {
        console.log(value);
        let code = Number(codeA);
        //console.log(code);

        let js = JSON.stringify({ email: email, code: code, password: password });

        const response = await fetch(
            bp.buildPath('api/terminate_reset_password'),
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
            setButtonClicked(true);
            if (!passwordMatch) {
                setTimeout(() => setButtonClicked(false), 500);
            } else {
                router.push('/signin');
                //setPageNumber(2);
            }
        } else {
            console.log(res.error);
        }
    };

    const handleValidateChar = (value, index) => {
        let matchIsNumeric = function (text) {
            const isNumber = typeof text === 'number';
            const isString = typeof text === 'string';
            return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
        };

        return matchIsNumeric(value);
    };

    return (
        <div className="center-container">
            <motion.div
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Typography variant="body1" align="center" gutterBottom>
                    Please enter the code sent to your Email
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <MuiOtpInput 
                        length={4}
                        value={otp} 
                        onChange={handleChange} 
                        validateChar={handleValidateChar}
                        onComplete={codeCompletion}
                        TextFieldsProps={{
                            size: 'small',
                            InputProps: {
                                style: {
                                    width: '4.5vw', 
                                    height: '3vw', 
                                    padding: '0',
                                    textAlign: 'center',
                                }
                            },
                            inputProps: {
                                style: {
                                    padding: '10px',
                                    textAlign: 'center',
                                }
                            }
                        }}
                    />
                </Box>

                <Container>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <Tooltip title={passwordStrengthDescriptions[passwordStrength]} placement="right" arrow>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Enter new password"
                                onChange={handlePasswordValidation}
                                type="password"
                            />
                        </Tooltip>
                        <Tooltip title={passwordStrengthDescriptions[passwordStrength]} placement="right" arrow>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Re-enter new password"
                                onChange={handleConfirmPasswordChange}
                                type="password"
                            />
                        </Tooltip>
                        <Typography
                            variant="body2"
                            color={passwordMatch ? "green" : "red"}
                            align="center"
                            sx={{ 
                                mt: 2, 
                                animation: buttonClicked && !passwordMatch ? 'wobble 0.5s ease' : 'none' 
                            }}
                        >
                            {passwordMatch ? "Passwords match" : "Passwords do not match"}
                        </Typography>
                    </Box>
                </Container>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Button
                        onClick={handleComplete}
                        variant="outlined"
                        style={{ maxWidth: '20vw' }}
                    >
                        Reset
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
