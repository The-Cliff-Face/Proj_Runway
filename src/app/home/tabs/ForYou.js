'use client';


import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import './styles.css';
import ListCategory from './components/ListCategory';
import ListFull from './components/ListFull';
import { Connectors } from '/src/app/home/Connectors.js'
import { useEffect } from 'react';
import ErrorPopup from './components/ErrorPopup';
import loader from '/public/loading.gif';

export default function ForYou() {

  const { toggleLike, fetchComments, postComment, grabRecommendedClusters, comments } = useContext(Connectors)
  const { isLiked,likes,truncateTitle, clusterNames,clusterItemData,setMessage   } = useContext(Connectors);
  const [ doExpand, setExpand ] = useState(false);
  const { errorMessage, isErrorPopupOpen, closeErrorPopup  } = useContext(Connectors);
  const [ whatToExpand, setWhatToExpand ] = useState(0);
  const [ isLoading, setLoading ] = useState(true);

  const retrieve = async () => {
    const re = await grabRecommendedClusters();
    if (re) {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    const start = () => {
      retrieve();
    };
    start();
  }, []);

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
       <Box sx={{ display: 'flex', alignItems: 'flex-end',align:'center', justifyContent:"center"}}>
      
       {isLoading ? <img src={loader.src} alt="loading..." style={{ maxWidth:"15vw", alignSelf: "center"}}/>:<></>}
       <ErrorPopup message={errorMessage} open={isErrorPopupOpen} onClose={closeErrorPopup} />
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
          setMessage={setMessage}

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

