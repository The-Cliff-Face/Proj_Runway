'use client';

import * as React from 'react';
import Popup from 'reactjs-popup';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import Box from '@mui/material/Box';
import ProductPopup from '../home/tabs/components/ProductPopup';
import loader from '/public/loading.gif';

export default function FavoritesPopup({open, setOpen, itemData,
  comments,
  popupHandler,
  toggleLike,
  postComment,
  isLiked,
  setMessage,
  likes,
  truncateTitle,
  borderColor,
  shadowColor,
  isLoading
}) {
    

    return (
        <>
        <Popup open={open} onClose={() => setOpen(false)} modal nested>
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          > 
          <div 
            style={{ 
              padding: '20px', 
              backgroundColor: 'black',
              width: '75vw',
              height: '50vw',
              overflowY: 'auto', 
              color: 'white',
              boxShadow: '0px 0px 70vw rgba(188, 113, 223, 0.6)',
              border: '2px solid rgba(188, 113, 223, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>

            <Typography component="h1" variant="h5" className="h1">
              Your Favorites
            </Typography>
            {isLoading ? <img src={loader.src} alt="loading..." style={{ maxWidth:"15vw", alignSelf: "center"}}/>:<></>}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            
            
             
            {typeof itemData !== 'undefined' ? <ImageList sx={{ width: '62vw', height: '42vw', gap: 0 }} cols={3} rowHeight={'15vw'}>
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
            
            <Button variant="outlined" onClick={() => setOpen(false)} style={{ maxWidth: '20vw', alignSelf: 'center' }}>Close</Button>
          </div>
          </motion.div>
        </Popup>
        </>
    )
}

