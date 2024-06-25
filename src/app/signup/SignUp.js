import * as React from 'react';
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
import Tooltip from '@mui/material/Tooltip';

import { useState } from 'react';

import { validateEmail } from '../../../verification.js';
import { validateUsername } from '../../../verification.js';


export default function SignUp() {
  const passwordStrengthDescriptions = [
    'very weak', 'weak', 'medium', 'strong', 'very strong'
  ]
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [emailIsValid, setEmailIsValid] = useState(true);

  const [usernameIsValid, setUsernameIsValid] = useState(true);

  // https://medium.com/@anthonyzhang220/form-validation-with-material-ui-textfield-component-and-react-29f0f0b26849
  function handlePasswordValidation(e) {
    let password = e.target.value;
    let zxcvbn = require('zxcvbn');
    let score = zxcvbn(password).score;

    setPasswordStrength(score);
  }

  function handleEmailValidation(e) {
    setEmailIsValid(validateEmail(e.target.value));
  }

  function handleUsernameValidation(e) {
    setUsernameIsValid(validateUsername(e.target.value));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                autoComplete="username"
                onChange={(e) => handleUsernameValidation(e)}
                error={!usernameIsValid}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => handleEmailValidation(e)}
                error={!emailIsValid}
              />
            </Grid>
            <Grid item xs={12}>
              <Tooltip title={passwordStrengthDescriptions[passwordStrength]} placement="right" arrow>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => handlePasswordValidation(e)}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="../signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}