'use client';


import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
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

