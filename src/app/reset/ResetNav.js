'use client';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useState } from 'react';

import VerifyCode from './VerifyCode';
import SendCode from './SendCode';


export default function ResetNav() {
    
    //const [pageNumber, setPageIndex] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [email, setEmail] = useState("");

    //const MAX_QUIZ_PAGES = 2;
    

    /*
    const buttonHandler = () => {
        if (pageNumber < MAX_QUIZ_PAGES) {
            setPageIndex(pageNumber + 1);
        }
    }
    */

    return (
        
        <>
            {pageNumber === 0 && <SendCode setPageNumber={setPageNumber} email={email} setEmail={setEmail}/>}
            {pageNumber === 1 && <VerifyCode setPageNumber={setPageNumber} email={email} setEmail={setEmail}/>}
        </>
            
        
    );
}
