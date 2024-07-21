'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ProductPopup from './ProductPopup.js';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

export default function ListFull({itemData,comments,popupHandler,
    toggleLike,
    postComment,
    isLiked,
    likes,
    truncateTitle,
    isExpanded,
    doExpand,
    setExpand,
    whatToExpand,
    setWhatToExpand,
    setMessage,
    shadowColor,
    borderColor

}) {

  const minimize = () => {
    setExpand(false);
  }

    return (
        <>
        {isExpanded && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button variant="outlined" onClick={minimize}>Minimize</Button>
        </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            
             
            {typeof itemData !== 'undefined' ? <ImageList sx={{ width: '90vw', height: '50vw', gap: 0 }} cols={4} rowHeight={'15vw'}>
              {itemData.map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    truncateTitle={truncateTitle}
                    setMessage={setMessage}
                    borderColor={borderColor}
                    shadowColor={shadowColor}
                    ></ProductPopup>
              ))}
            </ImageList>: <></>}
          </Box>
          
        </>
    );

}
