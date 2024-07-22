'use client';

import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchLogo from "/public/searchlogo.png";
import Button from '@mui/material/Button';
import './styles.css';
import { Connectors } from '/src/app/home/Connectors.js';
import ListFull from './components/ListFull';
import ErrorPopup from './components/ErrorPopup';
import { useRouter } from 'next/navigation';
import { AuthContext } from '/src/app/AuthContext.js';

export default function Explore() {

  const router = useRouter();
  const { toggleLike, fetchComments, postComment, search,comments,genderedSearch } = useContext(Connectors);
  const { itemData,isLiked,likes,truncateTitle, setMessage  } = useContext(Connectors);
  const { errorMessage, isErrorPopupOpen, closeErrorPopup,setData  } = useContext(Connectors);
  const { token, refreshToken, setToken } = useContext(AuthContext);
  const [ gender, setGender ] = useState("all");
  const [ searchWord, setWord ] = useState(""); 
  

  const genderHandler = () => {
    if (gender == "all") {
      setGender("female");
    } else if (gender=="female") {
      setGender("male");
    } else {
      setGender("all");
    }
  }
  
  const popupHandler = async (id) => {
      const dLike = await fetchComments(id);
      if (dLike && !isLiked) {
        toggleLike();
      } else if (isLiked && !dLike) {
        toggleLike();

      }
  };
  const searchWrapper = async (searchword) => {
    if (gender == "all") {
      const data = await search(searchword);
      setData(data);
    } else {
      const data = await genderedSearch(searchWord, 100, gender);
      setData(data);
    }
    
  }

  const refresh = async () => {
    if (!token) {
      const newToken = await refreshToken();
      if (!newToken) {
        router.push('/signin');
      }
      setToken(newToken);
    }
  }
  
  React.useEffect(() => {
    const start = () => {
      refresh();
    };
    start();
  }, []);
  
  
    

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
               <img
                   src={SearchLogo.src}
                   loading="lazy"
                   style={{ width: 32, height: 32, marginRight: 5 }}
               />
           <TextField id="input-with-sx" label="Search" variant="standard"  onChange={(e) => { setWord(e.target.value); }}/>
           <Button onClick={() => searchWrapper(searchWord)} >Search</Button>
           <Button onClick={genderHandler}>
                {gender}
              </Button>
        </Box>

        <ErrorPopup message={errorMessage} open={isErrorPopupOpen} onClose={closeErrorPopup} />

        
        
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
            setMessage={setMessage}
            borderColor="rgba(255, 255, 255, 1)"
            shadowColor="rgba(255, 255, 255, 0.6)"

          >
          </ListFull>
        
        
      </>
        
    );
}