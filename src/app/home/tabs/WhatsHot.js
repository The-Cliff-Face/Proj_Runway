'use client';


import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Popup from 'reactjs-popup';
import { motion } from 'framer-motion';
import heartOutline from "/public/heartOutline.png";
import heartClicked from "/public/heartClicked.png";
import { useState } from 'react';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Carousel from 'react-material-ui-carousel'
import { AuthContext } from '/src/app/AuthContext.js';
import { useContext } from 'react';
import { Connectors } from '/src/app/home/Connectors.js'
import ListFull from './components/ListFull';
import './styles.css';


export default function WhatsHot() {

  const { toggleLike, fetchComments, postComment, search,comments } = useContext(Connectors)
  const { itemData,isLiked,likes,truncateTitle, setData  } = useContext(Connectors);
  const [ searchWord, setWord ] = useState(""); 

   const popupHandler = async (id) => {
    const dLike = await fetchComments(id);
    if (dLike && !isLiked) {
      toggleLike();
    } else if (isLiked && !dLike) {
      toggleLike();

    }

    useEffect(() => {
      search("shirts");
      return () => {
      };
    });
  };
//<Button onClick={()=>search("shirts")} >Search</Button>

  
  return (
          <>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          <p>DEMO: the search just has "shirts" in a search function, need to do api - nick</p>
          <Button onClick={()=>search("shirts")} >Display</Button>

          </Box>
              
          <ListFull
          itemData={itemData}
          comments={comments}
          toggleLike={toggleLike}
          popupHandler={popupHandler}
          postComment={postComment}
          isLiked={isLiked}
          likes={likes}
          truncateTitle={truncateTitle}
          isExpanded={false}
          >
          </ListFull>
          </>
      );
}

