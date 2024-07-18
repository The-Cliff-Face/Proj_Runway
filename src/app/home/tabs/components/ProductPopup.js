
'use client';


import * as React from 'react';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Popup from 'reactjs-popup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Carousel from 'react-material-ui-carousel';
import Paper from '@mui/material/Paper';
import heartOutline from "/public/heartOutline.png";
import heartClicked from "/public/heartClicked.png";




export default function ProductPopup({item,
  comments,
  popupHandler,
  toggleLike,
  postComment,
  isLiked,
  likes,truncateTitle}) {
    

    return (
        <>
            <Popup
                  trigger={
                    <ImageListItem
                      key={item.img[0]}
                      sx={{
                        margin: 1.5,
                        padding: 2,
                      }}
                    >
                      <img
                        srcSet={`${item.img[0]}?w=248&fit=scale&auto=format&dpr=2 2x`}
                        src={`${item.img[0]}?w=248&fit=scale&auto=format`}
                        alt={item.title}
                        loading="lazy"
                        className="responsive-image"
                        style={{
                           border: '2px solid rgba(188, 113, 223, 1)',
                           boxShadow: '0px 0px 30px rgba(188, 113, 223, 0.6)',
                        }}
                        
                        onClick={() => popupHandler(item.id)}
                       
                       
                      />
                     
                      <ImageListItemBar
                        title={truncateTitle(item.title)}
                        position="below"
                      />
                     
                    </ImageListItem>
                  }
                  modal
                  nested
                >
                  {close => (
                  
                    <Box sx={{
                      p: 3, 
                     
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: "40vw",
                      height: "40vw",
                      overflowY: 'auto', //scroll
                      backgroundColor: 'black',
                      color: 'white',
                      boxShadow: '0px 0px 500px rgba(188, 113, 223, 0.6)',
                       border: '2px solid rgba(188, 113, 223, 1)',
                      position: 'relative'
                    }}>
                     
                     
                      <Carousel>
                        {item.img.map((image, i) => (
                          <Paper key={i}>
                            <img
                              src={image}
                              alt={item.title}
                              style={{ width: '100%', minWidth: "40vw", minHeight: "40vw", maxWidth:"40vw", maxHeight: "40vw"}}
                              //loading="eager"
                            />
                          </Paper>
                        ))}
                      </Carousel>
            
                      <h2>{item.title}</h2>
   
                      <Box sx={{ backgroundColor: '#473651', padding: '10px' }}>
                           <p>Comments:</p>
                           <p>{item.id}</p>
   
                           <Box>
                           {comments.map((comment, index) => (
                                   <p key={index}>
                                   <span style={{ fontWeight: 'bold', color: '#BC72DF' }}>{comment.username}</span> : {comment.message}
                                   </p>
                           ))} 
                           </Box>
                           <Box
                               component="form"
                               sx={{
                               '& > :not(style)': {  width: '25ch' },
                               }}
                               noValidate
                               autoComplete="off"
                           >
                               <TextField id="standard-basic" label="Add a Comment" variant="standard" onChange={(e) => { setMessage({e:e, message:e.target.value}); }} />
                               <Button
                               variant="outlined"
                               color="primary"
                               size="small"
                               sx={{ maxWidth: '2ch', marginTop: '16px'}}
                               onClick={() => postComment(item.id)}
                               >
                               Post
                               </Button>
                           </Box>
                      </Box>
                      <br></br>
                      <img
                        src={isLiked ? heartClicked.src : heartOutline.src}
                        onClick={() => toggleLike(item.id)}
                        loading="strict"
                        style={{ width: '3vw', cursor: 'pointer' }}
                        alt="Heart"
                      />
   
                       <p>This product has {likes} {likes === 1 ? 'like' : 'likes'}!</p>
   
                      <Box sx={{ bottom: 0, right: 0 }}>
                          <Button
                            variant="outlined"
                           
                            onClick={close}
                          >
                            Close
                          </Button>
                      </Box>
                    </Box>
                  
                  )}
                </Popup>
        </>
    );

}

