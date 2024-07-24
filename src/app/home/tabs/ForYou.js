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
import { motion } from 'framer-motion';
import { AuthContext } from '@/app/AuthContext';

export default function ForYou() {

  const { toggleLike, fetchComments, postComment, grabRecommendedClusters, comments } = useContext(Connectors)
  const { isLiked,likes,truncateTitle, clusterNames,clusterItemData,setMessage   } = useContext(Connectors);
  const [ doExpand, setExpand ] = useState(false);
  const { errorMessage, isErrorPopupOpen, closeErrorPopup  } = useContext(Connectors);
  const [ whatToExpand, setWhatToExpand ] = useState(0);
  const [ isLoading, setLoading ] = useState(true);
  const { username ,getUsername} = useContext(AuthContext);

  const retrieve = async () => {
    if (!username) {
      await getUsername();
    }
    
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

       <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        sx={{ justifyContent: 'center', display: 'flex' }}
      >
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
          username={username}
          borderColor="rgba(188, 114, 223, 1)"
          shadowColor="rgba(188, 114, 223, 0.6)"
        >
       </ListCategory>: <></>}
       </motion.div>
      
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
          username={username}
          borderColor= {"rgba(188, 114, 223, 1)"}
          shadowColor= {"rgba(188, 114, 223, 0.6)"}

        >
        </ListFull>: <></>}
       </>
   );
}

