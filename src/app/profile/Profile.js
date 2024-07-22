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
//import { AuthContext } from '/src/app/AuthContext.js';
import { AuthContext } from '../AuthContext';
import Popup from 'reactjs-popup';
import heartClicked from "/public/heartClicked.png";
import surveyIcon from "/public/surveyIcon.png";
import { useRouter } from 'next/navigation';
import FavoritesPopup from './FavoritesPopup';
import { Connectors } from '/src/app/home/Connectors.js';
import Cookies from 'js-cookie';


import "./styles.css";


export default function Profile() {

  const { toggleLike, fetchComments, postComment, comments, setMessage } = useContext(Connectors)
  const { isLiked,likes,truncateTitle  } = useContext(Connectors);
  

  var bp = require('/src/app/Path.js');
  const router = useRouter();
  let { token } = useContext(AuthContext);
  const { setToken } = useContext(AuthContext);
  const { refreshToken, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  let { username, getUsername, setUsername } = React.useContext(AuthContext);
  const [ localUsername, setLocalUsername] = React.useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setToken("");
    await logout();
    router.push('/signin');

  }

  const refresh = () => {
    if (!username) {
      username = getUsername();
      setLocalUsername(username);
            
    } else {
      setLocalUsername(username);
    }
  }
  const popupHandler = async (id) => {

    const dLike = await fetchComments(id);
    if (dLike && !isLiked) {
      toggleLike();
    } else if (isLiked && !dLike) {
      toggleLike();
    }
  };

  React.useEffect(() => {
    const start = () => {
        refresh();
        setData([]);
    };
    start();
  }, []);

  const grabProfile = async event => {
    if (!token) {
      const newToken = await refreshToken();
      setToken(newToken);
      token = newToken;
    }
    try {
      let response = await fetch(bp.buildPath('api/getUserLikes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "authorization": token,
        }
      });
      var txt = await response.text();
      var res = JSON.parse(txt);
      const results = res.results;
      
      var entries = [];
      for( var i=0; i<results.length; i++ )
      {   
                
            const product = results[i];
            if (!product) {continue;}
            
            let images = "";
            if (Array.from(product.images)[0] == '[') {
                images = product.images.slice(1, -1).split(',').map(item => item.slice(1, -1));
                for (let j=0;j<images.length;j++) {
                    const temp = images[j];
                    if (temp[0] == "'") {
                        let h = temp.split("'");
                        images[j] = h[1];
                    }
                }
  
            } else {
                images = [product.images];
            }
                
            const image = images;
            const entry = {
                "img":image,
                "title":product.name,
                "id":product.id,
                "url":product.url,
            }
            entries.push(entry);
              
      }
      setData(entries);
    } catch (error) {
      console.log(error);
    }
    
  };

  const openSurvey = async () => {
    router.push('/survey');
  };

  const openPopup = async () => {
    try {
      setData([]);
      setOpen(true);
      setLoading(true);
      await grabProfile();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setOpen(false);
    }
    
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
              {localUsername}
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

            <Link variant="body2" className="body2" onClick={logoutHandler} >
              Logout
            </Link>

          </Box>
        </Container>

        <FavoritesPopup
          open={open}
          setOpen={setOpen}
          itemData={data}
          comments={comments}
          toggleLike={toggleLike}
          popupHandler={popupHandler}
          postComment={postComment}
          isLiked={isLiked}
          likes={likes}
          truncateTitle={truncateTitle}
          isExpanded={false}
          setMessage={setMessage}
          borderColor= {"#ff78c7"}
          shadowColor= {"#ff78c7"}
          isLoading = {isLoading}

        >
        </FavoritesPopup>
        
      </motion.div>
    </Stack>
  );
}
