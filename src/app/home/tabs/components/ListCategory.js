'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ProductPopup from './ProductPopup.js';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ListCategory({itemData,comments,popupHandler,
    toggleLike,
    postComment,
    isLiked,
    likes,
    truncateTitle,
    clusterNames,
    doExpand,
    setExpand,
    whatToExpand,
    setWhatToExpand,
    setMessage,
    username,
    borderColor,
    shadowColor

    
}) {
    const toClusterName = (clusterArray) => {
        let res = "";
        for (let i = 0;i<clusterArray.length && i<3; i++) {
            res+= clusterArray[i];
            res+= " ";
        }
        return res;
    };

    const expand = (index) => {
        setWhatToExpand(index);
        setExpand(true);
    }

    
    // itemData will have [3][post.length]


    return (
        <>
        
        {itemData[0] ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stack
        spacing = {2}
        >
        <Box>
            
            <p><strong>Category 1: {toClusterName(clusterNames[0])}</strong></p>
            <Button variant="outlined" onClick={ ()=>expand(0) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={Math.min(itemData[0].length, 10)} rowHeight={'15vw'}>
              {itemData[0].slice(0, 10).map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    truncateTitle={truncateTitle}
                    shadowColor={shadowColor}
                    borderColor={borderColor}
                    setMessage={setMessage}
                    username={username}
                    ></ProductPopup>
              ))}
            </ImageList>
        </Box>
        
        <Box>
            <p><strong>Category 2: {toClusterName(clusterNames[1])}</strong></p>
            <Button variant="outlined" onClick={ ()=>expand(1) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={Math.min(itemData[1].length, 10)} rowHeight={'15vw'}>
              {itemData[1].slice(0, 10).map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    setMessage={setMessage}
                    shadowColor={shadowColor}
                    borderColor={borderColor}
                    truncateTitle={truncateTitle}
                    username={username}
                    ></ProductPopup>
              ))}
            </ImageList>
        </Box>
        <Box>
            <p><strong>Category 3: {toClusterName(clusterNames[2])}</strong></p>
            <Button variant="outlined" onClick={ ()=>expand(2) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={Math.min(itemData[2].length, 10)} rowHeight={'15vw'}>
              {itemData[2].slice(0, 10).map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    truncateTitle={truncateTitle}
                    shadowColor={shadowColor}
                    borderColor={borderColor}
                    setMessage={setMessage}
                    username={username}
                    ></ProductPopup>
              ))}
            </ImageList>
        </Box>
        </Stack>
          </Box>
          : <></>}
        
        </>
    );

}
