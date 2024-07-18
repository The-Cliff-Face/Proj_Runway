'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchLogo from "/public/searchlogo.png";
import Button from '@mui/material/Button';
import './styles.css';
import { Connectors } from '/src/app/home/Connectors.js'
import ListFull from './components/ListFull';



export default function Explore() {

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
  };
  
    

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
               <img
                   src={SearchLogo.src}
                   loading="lazy"
                   style={{ width: 32, height: 32, marginRight: 5 }}
               />
           <TextField id="input-with-sx" label="Search" variant="standard"  onChange={(e) => { setWord(e.target.value); }}/>
           <Button onClick={()=>search(searchWord)} >Search</Button>
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