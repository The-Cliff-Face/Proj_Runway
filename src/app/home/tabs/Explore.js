'use client';

import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
//import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import SearchLogo from "/public/searchlogo.png";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { AuthContext } from '/src/app/AuthContext.js';
import './styles.css';
//import IconButton from '@mui/joy/IconButton';
//import FavoriteBorder from '@mui/icons-material/FavoriteBorder';



export default function Explore() {
    let { token } = useContext(AuthContext);
    const { setToken } = useContext(AuthContext);
    const { refreshToken } = useContext(AuthContext);

    const max_results = 100;
    //const itemData = [];
    var bp = require('/src/app/Path.js');
    const [searchTerm, setSearch] = useState("");
    const [itemData, setData] = useState([]);

    const truncateTitle = (title) => {
      if (title.length > 30) {
        return title.substring(0, 30) + '...';
      }
      return title;
    };

    

  
    const search = async event => 
        {
            if (!token) {
              const newToken = await refreshToken();
              setToken(newToken);
              token = newToken;
              
            }
            
            setData([]);
            event.preventDefault();
            
            var obj = {search:searchTerm,max_results};
            var js = JSON.stringify(obj);
            

            try
            {
              console.log( token );
                let response = await fetch(bp.buildPath('api/search'),
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
               
                var entries = [];
                for( var i=0; i<_results.length; i++ )
                {   
                    

                    const product = _results[i];
                    // i hate this so much, idk what is going on
                    let images = "";
                    if (Array.from(product.images)[0] == '[') {
                        images = product.images.slice(1, -1).split(',').map(item => item.slice(1, -1));;
                    } else {
                        images = [product.images];
                    }
                    
                    const image = images[0];
                    const entry = {
                        "img":image,
                        "title":product.name,
                        "author":product.price,
                    }
                    entries.push(entry);
                  
                }
                console.log(entries);
                setData(entries);
                //setResults('Card(s) have been retrieved');
                //setCardList(resultText);
            }
            catch(e)
            {
                console.log(e.toString());
                //setResults(e.toString());
                //storage.storeToken( res.jwtToken );
            }
        };

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
               <img
                   src={SearchLogo.src}
                   loading="lazy"
                   style={{ width: 32, height: 32, marginRight: 5 }}
               />
           <TextField id="input-with-sx" label="Search" variant="standard"  onChange={(e) => { setSearch(e.target.value); }}/>
           <Button onClick={search} >Search</Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>  {/* Center the ImageList */}
          <ImageList sx={{ width: 2400, height: 1200, gap: 0 }} cols={4} rowHeight={343}>
            {itemData.map((item) => (
              <ImageListItem
                key={item.img}
                sx={{
                  margin: 5, // Add margin to create spacing around each image
                  // boxShadow: '0px 0px 30px rgba(188, 113, 223, 0.6)', // Apply shadow here
                }}
              >
                <img
                  srcSet={`${item.img}?w=248&fit=scale&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=scale&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  className="responsive-image"
                />
                <ImageListItemBar
                  title={truncateTitle(item.title)}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        </>
    );
}