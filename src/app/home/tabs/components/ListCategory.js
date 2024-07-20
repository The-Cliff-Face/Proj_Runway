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
    setMessage
    
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
            
            <p>Category 1: {toClusterName(clusterNames[0])}</p>
            <Button onClick={ ()=>expand(0) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={itemData[0].length} rowHeight={'15vw'}>
              {itemData[0].map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    truncateTitle={truncateTitle}
                    ></ProductPopup>
              ))}
            </ImageList>
        </Box>
        
        <Box>
            <p>Category 2: {toClusterName(clusterNames[1])}</p>
            <Button onClick={ ()=>expand(1) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={itemData[1].length} rowHeight={'15vw'}>
              {itemData[1].map((item) => (
                    <ProductPopup 
                    item={item} 
                    comments={comments} 
                    popupHandler={popupHandler}
                    toggleLike={toggleLike}
                    postComment={postComment}
                    isLiked={isLiked}
                    likes={likes}
                    truncateTitle={truncateTitle}
                    ></ProductPopup>
              ))}
            </ImageList>
        </Box>
        <Box>
            <p>Category 3: {toClusterName(clusterNames[2])}</p>
            <Button onClick={ ()=>expand(2) }>Expand</Button>
            <ImageList sx={{ width: '90vw', height: '21vw', gap: 0 }} cols={itemData[2].length} rowHeight={'15vw'}>
              {itemData[2].map((item) => (
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
        </Stack>
          </Box>
          : <></>}
        
        </>
    );

}
