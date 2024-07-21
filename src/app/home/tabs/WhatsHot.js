'use client';


import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { Connectors } from '/src/app/home/Connectors.js'
import ListFull from './components/ListFull';
import loader from '/public/loading.gif';
import './styles.css';



export default function WhatsHot() {

  const { toggleLike, fetchComments, postComment, search,comments, setMessage } = useContext(Connectors)
  const { whatisHotData,isLiked,likes,truncateTitle,grabWhatsHot  } = useContext(Connectors);
  const [ searchWord, setWord ] = useState(""); 
  const [ isLoading, setLoading ] = useState(true);

  const popupHandler = async (id) => {
    const dLike = await fetchComments(id);
    if (dLike && !isLiked) {
      toggleLike();
    } else if (isLiked && !dLike) {
      toggleLike();

    }

  };
  const grabWrapper = async () => {
    const re = await grabWhatsHot();
    if (re) {
      setLoading(false);
    }

  }
  useEffect(() => {
    const start = () => {
      grabWrapper();
      
    };
    start();
  }, []);

//<Button onClick={()=>search("shirts")} >Search</Button>

  
  return (
          <>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          {isLoading ? <img src={loader.src} alt="loading..." style={{ maxWidth:"15vw", alignSelf: "center"}}/>:<></>}
          </Box>
              
          <ListFull
          itemData={whatisHotData}
          comments={comments}
          toggleLike={toggleLike}
          popupHandler={popupHandler}
          postComment={postComment}
          isLiked={isLiked}
          likes={likes}
          truncateTitle={truncateTitle}
          isExpanded={false}
          setMessage={setMessage}
          borderColor= {"#d6b36c"}
          shadowColor= {"#d6b36c99"}
          >
          </ListFull>

          </>
      );
}

