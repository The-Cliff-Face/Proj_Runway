'use client';


import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Popup from 'reactjs-popup';
import { motion } from 'framer-motion';
import heartOutline from "/public/heartOutline.png";
import heartClicked from "/public/heartClicked.png";
import { useState } from 'react';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Carousel from 'react-material-ui-carousel'
import { AuthContext } from '/src/app/AuthContext.js';
import { useContext } from 'react';
import './styles.css';


export default function ForYou() {


   const { token } = useContext(AuthContext);
   const max_results = 100;
   const initialLikes = 1000;
   //const itemData = [];
   var bp = require('/src/app/Path.js');
   const [itemData, setData] = useState([]);
   const [itemId, setId] = useState(null);
   const [comments, setComments] = useState(["1","2"]);


   const searchTerm = "jeans";

   const truncateTitle = (title) => {
    if (title.length > 30) {
      return title.substring(0, 30) + '...';
    }
    return title;
  };


   const popupHandler = async (id) => {
       setId(id);
       //await viewComments();
       await fetchComments(id);
     };


    /*
   const viewComments = async (event) => {
       event.preventDefault();
       if (!itemId) {return;}
       setComments([]);
      
       var obj = {id: itemId};
       var js = JSON.stringify(obj);
       try {
           const response = await fetch(bp.buildPath('api/viewComments'), {
               method:'POST',
               body:js,
               headers:{
                   'Content-Type': 'application/json',
                   "authorization":token,
               }
           });
           var txt = await response.text();
           var res = JSON.parse(txt);
               if (res.error != "") {
                   console.log(res.error);
               }
           console.log(res);
           var _results = res.ret.comments;
           console.log(_results);
           setComments(_results);
          
       } catch (error) {
           console.log(error);
       }
   }
    
  
   const set = (number) => (event) => {
       setId(number);
       viewComments(event);
   };
   */

   const fetchComments = async (id) => {
        if (!id) return;
        
        var obj = { id: id };
        var js = JSON.stringify(obj);
        
        try {
            const response = await fetch(bp.buildPath('api/viewComments'), {
                method:'POST',
                body: js,
                headers:{
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });
            var txt = await response.text();
            var res = JSON.parse(txt);
            if (res.error !== "") {
                console.log(res.error);
            }
            console.log(res);
            var _results = res.ret.comments;
            console.log(_results);
            setComments(_results);
            
        } catch (error) {
            console.log(error);
        }
    };

   


   const retreive = async event => {
       event.preventDefault();
       var obj = {search:searchTerm,max_results};
       var js = JSON.stringify(obj);
       try
           {
               const response = await fetch(bp.buildPath('api/search'),
               {method:'POST',body:js ,
                   headers:{
                       'Content-Type': 'application/json',
                       "authorization": token,
                   }});
  
               var txt = await response.text();
               var res = JSON.parse(txt);
               if (res.error != "") {
                   console.log(res.error);
               }
               var _results = res.results.ret;
               console.log(_results);
               var entries = [];
               for( var i=0; i<_results.length; i++ )
               {  
                  


                   const product = _results[i];
                   // i hate this so much, idk what is going on
                   let images = "";
                   if (Array.from(product.images)[0] == '[') {
                       images = product.images.slice(1, -1).split(',').map(item => item.slice(1, -1));;
                       for (let j=0;j<images.length;j++) {
                           const temp = images[j];
                           if (temp[0] == "'") {
                               let h = temp.split("'");
                               images[j] = h[1];
                           }
                       }
                   } else {
                       images = [product.images];
                   }
                   const image = images;
                   const entry = {
                       "img":image,
                       "title":product.name,
                       "id":product.id,
                   }
                   entries.push(entry);
                   console.log("run");
               }
               setData(entries);
              
           }
           catch(e)
           {
               console.log(e.toString());
              
           }
       };


       const [isClicked, setIsClicked] = useState(false);
       const [likes, setLikes] = useState(initialLikes);


       const handleClick = () => {
           setIsClicked(!isClicked);
           if (!isClicked) {
            setLikes(likes + 1); 
          } else {
            setLikes(likes - 1); 
          }
       };


       const useMousePosition = () => {
           const [
             mousePosition,
             setMousePosition
           ] = React.useState({ x: null, y: null });
           React.useEffect(() => {
             const updateMousePosition = ev => {
               setMousePosition({ x: ev.clientX, y: ev.clientY });
             };
             window.addEventListener('mousemove', updateMousePosition);
             return () => {
               window.removeEventListener('mousemove', updateMousePosition);
             };
           }, []);
           return mousePosition;
         };
      
         const mousePosition = useMousePosition();

    



   return (
       <>
       <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
            
          <Button onClick={retreive} >Search</Button>
       </Box>
           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          
         <ImageList sx={{ width: 2400, height: 1200, gap: 0 }} cols={4} rowHeight={343}>
           {itemData.map((item) => (
             <Popup
               trigger={
                  
                 <ImageListItem
                   key={item.img[0]}
                   sx={{
                     margin: 5,
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
                     subtitle={<span>by: {item.author}</span>}
                     position="below"
                   />
                  
                 </ImageListItem>
               }
               modal
               nested
             >
               {close => (
               <motion.div
                 initial={{ opacity: 0, scale: 0.3 , x: mousePosition.x-670, y: mousePosition.y-300}}
                 animate={{ opacity: 1, scale: 1, x:0, y:0 }}
                 transition={{ duration: 0.5 }}
               >
                 <Box sx={{
                   p: 3, 
                  
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   width: 600,
                   height: 600,
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
                           style={{ width: '100%', minWidth: "30vw", minHeight: "30vw", maxWidth:"35vw", maxHeight: "35vw"}}
                           //loading="eager"
                         />
                       </Paper>
                     ))}
                   </Carousel>
                  


                   <h2>{item.title}</h2>

                   <Box sx={{ backgroundColor: '#473651', padding: '10px' }}>
                        <p>Comments:</p>

                        <Box>
                        {comments.map((comment, index) => (
                                <p key={index}>
                                <span style={{ fontWeight: 'bold', color: '#BC72DF' }}>{comment.username}</span> : {comment.message}
                                </p>
                        ))}
                        <p>{item.id}</p>
                        </Box>

                        <Box
                            component="form"
                            sx={{
                            '& > :not(style)': {  width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="standard-basic" label="Add a Comment" variant="standard" />
                            <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ maxWidth: '2ch', marginTop: '16px'}}
                            >
                            Post
                            </Button>
                        </Box>
                   </Box>


                   <br></br>


                   <img
                     src={isClicked ? heartClicked.src : heartOutline.src}
                     onClick={handleClick}
                     loading="lazy"
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
               </motion.div>
               )}
             </Popup>
           ))}
         </ImageList>
       </Box>
       </>
   );
}

