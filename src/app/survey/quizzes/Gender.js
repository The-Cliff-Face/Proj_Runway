'use client';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Logo from "/public/RunwayLogo.png";
import "./styles.css";
import { motion } from 'framer-motion';

export default function Gender({ setClickedOrder2 }) {
  const [clickedButtons2, setClickedButtons2] = useState({
    male: false,
    female: false,
    other: false,
  });

  const [clickedOrder2, setLocalClickedOrder2] = useState([]);

  const handleClick2 = (gender) => {
    setClickedButtons2((prevState) => {
      const newClickedState2 = !prevState[gender];
      let newClickedOrder2 = [...clickedOrder2];

      if (newClickedState2) {
        if (newClickedOrder2.length >= 1) {
          const firstClicked2 = newClickedOrder2.shift();
          prevState[firstClicked2] = false;
        }
        newClickedOrder2.push(gender);
      } else {
        newClickedOrder2 = newClickedOrder2.filter((item) => item !== gender);
      }

      setLocalClickedOrder2(newClickedOrder2);
      setClickedOrder2(newClickedOrder2);

      return {
        ...prevState,
        [gender]: newClickedState2,
      };
    });
  };


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <img src={Logo.src} loading="lazy" style={{ width: '15vw' }} />
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.75 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75vh',
          }}
        >
          <Box mb={3} textAlign="center">
            <p1>Lastly, what is your gender?</p1>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick2('male')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons2.male ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
                male
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick2('female')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons2.female ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              female
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick2('other')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons2.other ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
                other
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
