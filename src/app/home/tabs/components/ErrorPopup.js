'use client';
import Popup from 'reactjs-popup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ErrorPopup({ message, open, onClose }) {
    return (
      <Popup open={open} closeOnDocumentClick onClose={onClose}>
        <Box
        sx={{
            width: "14vw",
            height: "10vw",
            
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px solid rgba(188, 113, 223, 1)',
            backgroundColor: 'black',
            
          }}>
          <h2>Error</h2>
          <p>{message}</p>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Popup>
    );
  }
  
  