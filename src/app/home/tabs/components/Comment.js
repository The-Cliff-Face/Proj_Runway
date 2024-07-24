'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { AuthContext } from '@/app/AuthContext';

export default function Comment({ message, username, actualUsername, index, productId}) {
    var bp = require('/src/app/Path.js');
    const [newMessage , setMessage] = React.useState(message);
    const { token } = React.useContext(AuthContext);
    const [messageToDisplay, setMessageToDisplay ] = React.useState(message);
    const [ isEditable, setEditable ] = useState(false);
    const [ canEdit, setEdit ] = useState(actualUsername == username);

    const editComment = async () => {
        try {
            var obj = { index: index, message: newMessage, productId: productId  };
            var js = JSON.stringify(obj);

            const response = await fetch(bp.buildPath('api/editComment'), {
                method:'POST',
                body: js,
                headers:{
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });
            var txt = await response.text();
            console.log(txt);
            setMessageToDisplay(newMessage);
            setEditable(false);


        } catch (e) {
            console.log(e);
        }
    }

    const deleteComment = async () => {
        try {
            var obj = { index: index, message: "", productId: productId  };
            var js = JSON.stringify(obj);

            const response = await fetch(bp.buildPath('api/editComment'), {
                method:'POST',
                body: js,
                headers:{
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });
            var txt = await response.text();
            setMessageToDisplay("This comment was deleted");
            setEditable(false);
            setEdit(false);

        } catch (e) {
            console.log(e);
        }
    }

    
    return (
        <>
            <Box>
            <p key={index}>
            <span style={{ fontWeight: 'bold', color: '#BC72DF' }}>{username}</span> : {messageToDisplay}
            {isEditable ?<TextField sx={{padding:'10px'}} placeholder={messageToDisplay} onChange={(e) => { setMessage(e.target.value); }}></TextField> : <></>} 
            {((canEdit) & !isEditable) ? <Button style={{color: '#BC72DF' }} onClick={()=> setEditable(!isEditable)}>Edit</Button>: <></>}
            {isEditable ? <Button onClick={editComment}> Save </Button>: <></>}
            {isEditable ? <Button onClick={deleteComment}>Delete</Button>: <></>}
            {isEditable ? <Button onClick={()=> setEditable(!isEditable)}>Cancel</Button>: <></>}
            </p>
            </Box>
        </>
        
      
    );
  }
  
  