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
import { motion, useReducedMotion } from 'framer-motion';
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
import Carousel from 'react-material-ui-carousel';
import { AuthContext } from '/src/app/AuthContext.js';
import { useContext } from 'react';
import { useRef } from 'react';
import './styles.css';
import ListCategory from './components/ListCategory';
import ListFull from './components/ListFull';
import { Connectors } from '/src/app/home/Connectors.js'

export default function ForYou() {

  const { toggleLike, fetchComments, postComment, grabRecommendedClusters, comments } = useContext(Connectors)
  const { itemData,isLiked,likes,truncateTitle, clusterNames,clusterItemData   } = useContext(Connectors);
  const [ searchWord, setWord ] = useState(""); 
  const [ doExpand, setExpand ] = useState(false);
  const [ whatToExpand, setWhatToExpand ] = useState(0);
     

  const retrieve = async () => {
    await grabRecommendedClusters();
  };

  const popupHandler = async (id) => {
    const dLike = await fetchComments(id);
    if (dLike && !isLiked) {
      toggleLike();
    } else if (isLiked && !dLike) {
      toggleLike();

    }
};

   return (
       <>
       <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
            
          <Button onClick={retrieve} >Display</Button>
       </Box>

       {!doExpand ? <ListCategory
          itemData={clusterItemData}
          comments={comments}
          toggleLike={toggleLike}
          popupHandler={popupHandler}
          postComment={postComment}
          isLiked={isLiked}
          likes={likes}
          clusterNames={clusterNames}
          truncateTitle={truncateTitle}
          doExpand = {doExpand}
          setExpand={setExpand}
          whatToExpand = {whatToExpand}
          setWhatToExpand={setWhatToExpand}

       >
       </ListCategory>: <></>}
      
      {doExpand ? <ListFull
          itemData={clusterItemData[whatToExpand]}
          comments={comments}
          toggleLike={toggleLike}
          popupHandler={popupHandler}
          postComment={postComment}
          isLiked={isLiked}
          likes={likes}
          isExpanded={true}
          doExpand = {doExpand}
          setExpand={setExpand}
          whatToExpand = {whatToExpand}
          setWhatToExpand={setWhatToExpand}
          truncateTitle={truncateTitle}
        >
        </ListFull>: <></>}
       </>
   );
}

