'use client';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Logo from "/public/RunwayLogo.png";
import "./styles.css";
import { motion } from 'framer-motion';

export default function Clothes({ setClickedOrder1 }) {
  const [clickedButtons1, setClickedButtons1] = useState({
    trousers: false,
    tshirts: false,
    blouses: false,
    dresses: false,
    jeans: false,
    shorts: false,
    tanks: false,
    skirts: false,
    sweatpants: false,
    hoodies: false,
    sweaters: false,
    coats: false,
  });

  /*
  const { setRec } = useContext(RecContext);
  const { recMatrix } = useContext(RecContext);

  const tantan = {
    "trousers": 1,
    "tshirts": 0,
    "blouses": 0,
  };
  let newRec = recMatrix;
  newRec['Clothes'] =  tantan;
  setRec()
  */

  const [clickedOrder1, setLocalClickedOrder1] = useState([]);

  const handleClick1 = (article) => {
    setClickedButtons1((prevState) => {
      const newClickedState1 = !prevState[article];
      let newClickedOrder1 = [...clickedOrder1];

      if (newClickedState1) {
        if (newClickedOrder1.length >= 3) {
          const firstClicked1 = newClickedOrder1.shift();
          prevState[firstClicked1] = false;
        }
        newClickedOrder1.push(article);
      } else {
        newClickedOrder1 = newClickedOrder1.filter((item) => item !== article);
      }

      setLocalClickedOrder1(newClickedOrder1);
      setClickedOrder1(newClickedOrder1);

      return {
        ...prevState,
        [article]: newClickedState1,
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
            <p1>Which of these do you prefer wearing? (Choose up to 3)</p1>
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
              onClick={() => handleClick1('trousers')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.trousers ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
                trousers
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('tshirts')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.tshirts ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              tshirts
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('blouses')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.blouses ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
                blouses
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('dresses')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.dresses ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              dresses
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('jeans')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.jeans ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              jeans
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('shorts')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.shorts ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              shorts
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('tanks')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.tanks ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              tanks
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('skirts')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.skirts ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              skirts
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('sweatpants')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.sweatpants ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              sweatpants
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('hoodies')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.hoodies ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              hoodies
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('sweaters')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.sweaters ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              sweaters
            </Button>
            <Button
              size="md"
              variant="outlined"
              onClick={() => handleClick1('coats')}
              sx={{
                color: '#FFFFFF',
                borderColor: '#BC72DF',
                boxShadow: clickedButtons1.coats ? `0 0 10px 5px #BE6CD6` : 'none',
                '&:hover': {
                  boxShadow: `0 0 10px 5px #BE6CD6`,
                  borderColor: '#FFFFFF',
                },
              }}
            >
              coats
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
