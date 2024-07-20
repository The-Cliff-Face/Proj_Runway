'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ProductPopup from './ProductPopup.js';
import Button from '@mui/material/Button';

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
    setMessage
}) {

  const minimize = () => {
    setExpand(false);
  }

    return (
        <>
        {isExpanded ? <Button onClick={minimize}>Minimize</Button>: <></>}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            
             
            <ImageList sx={{ width: '90vw', height: '50vw', gap: 0 }} cols={4} rowHeight={'15vw'}>
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
                    ></ProductPopup>
              ))}
            </ImageList>
          </Box>
        </>
    );

}
