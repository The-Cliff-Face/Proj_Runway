'use client';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Logo from "/public/RunwayLogo.png";
import "./styles.css";
import { motion } from 'framer-motion';

export default function Colors({ setClickedOrder }) {
  const [clickedButtons, setClickedButtons] = useState({
    red: false,
    blue: false,
    black: false,
    yellow: false,
    pink: false,
    white: false,
    brown: false,
    green: false,
    purple: false,
    orange: false,
    gray: false,
    teal: false,
  });

  const [clickedOrder, setLocalClickedOrder] = useState([]);
  

  const handleClick = (color) => {
    setClickedButtons((prevState) => {
      const newClickedState = !prevState[color];
      let newClickedOrder = [...clickedOrder];

      if (newClickedState) {
        if (newClickedOrder.length >= 3) {
          const firstClicked = newClickedOrder.shift();
          prevState[firstClicked] = false;
        }
        newClickedOrder.push(color);
      } else {
        newClickedOrder = newClickedOrder.filter((item) => item !== color);
      }

      setLocalClickedOrder(newClickedOrder);
      setClickedOrder(newClickedOrder);
      
      return {
        ...prevState,
        [color]: newClickedState,
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
          <Box mb={4} textAlign="center">
            <p1>What is your favorite color? (Choose up to 3)</p1>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('red')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.red ? `0 0 10px 5px #FF0000` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #FF0000`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
            red
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('blue')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.blue ? `0 0 10px 5px #0084FF` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #0084FF`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              blue
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('black')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.black ? `0 0 10px 8px #000000` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 8px #000000`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              black
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('yellow')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.yellow ? `0 0 10px 5px #FFEE22` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #FFEE22`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              yellow
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('pink')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.pink ? `0 0 10px 5px #FF6EDB` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #FF6EDB`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              pink
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('white')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.white ? `0 0 10px 4px #FFFFFF` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 4px #FFFFFF`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              white
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('brown')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.brown ? `0 0 10px 7px #68412D` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 7px #68412D`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              brown
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('green')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.green ? `0 0 10px 5px #00B219` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #00B219`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              green
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('purple')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.purple ? `0 0 10px 5px #AE60C9` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #AE60C9`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              purple
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('orange')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.orange ? `0 0 10px 5px #FF8A35` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #FF8A35`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              orange
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('gray')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.gray ? `0 0 10px 5px #888888` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #888888`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              gray
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick('teal')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons.teal ? `0 0 10px 5px #57D2B8` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #57D2B8`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              teal
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
