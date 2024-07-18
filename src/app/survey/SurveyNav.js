'use client';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useState } from 'react';
import Clothes from './quizzes/Clothes';
import Colors from './quizzes/Colors';
import Gender from './quizzes/Gender';
import WelcomeLogin from './WelcomeLogin';
import { clickedButtons } from './quizzes/Colors';
import Submission from './quizzes/Submission';

export default function SurveyNav() {
    const [showSurvey, setBool] = useState(false);
    const [pageNumber, setPageIndex] = useState(0);
    const [clickedOrder, setClickedOrder] = useState([]);
    const [clickedOrder1, setClickedOrder1] = useState([]);
    const [clickedOrder2, setClickedOrder2] = useState([]);
    const [error, setError] = useState('');
    const [userRes, setRes] = useState({});
    const arrow = ">";
    const MAX_QUIZ_PAGES = 5;

    let _USER_REC = {
        "recommendations": {
            "clothes":{},
            "colors":{},
            "other":{}
        } 
    };
    


    const buttonHandler = () => {
        if ((pageNumber === 1 && clickedOrder.length === 0) || (pageNumber === 2 && clickedOrder1.length === 0) || (pageNumber === 3 && clickedOrder2.length === 0)) {
            setError('Please select at least one option before continuing.');
        } else {
            setError('');
            if (pageNumber < MAX_QUIZ_PAGES) {
                setPageIndex(pageNumber + 1);
            }
        }
        
        let res = {
            "recommendations": {
                "clothes":{},
                "colors":{},
                "other":{}
            } 
        };

        /*
        Object.keys(clickedButtons).forEach((item) => {
            const userChoice = clickedOrder[item];
            let val = 0;
            if(userChoice) {
                val = 1;
            }
            res.recommendations.colors[item] = val;
        });

        console.log(res);
        */

        const colorOptions = ['red', 'blue', 'black', 'yellow', 'pink', 'white', 'brown', 'green', 'purple', 'orange', 'gray', 'teal'];
            colorOptions.forEach((color) => {
                res.recommendations.colors[color] = clickedOrder.includes(color) ? 1 : 0;
            });

        const clothesOptions = ['trousers', 'tshirts', 'blouses', 'dresses', 'jeans', 'shorts', 'tanks', 'skirts', 'sweatpants', 'hoodies', 'sweaters', 'coats'];
            clothesOptions.forEach((article) => {
                res.recommendations.clothes[article] = clickedOrder1.includes(article) ? 1 : 0;
            });

        const genderOptions = ['male', 'female', 'other'];
            genderOptions.forEach((gender) => {
              res.recommendations.other.gender = clickedOrder2[0];
            });
        setRes(res);
        console.log(res);

    };



    return (
        <>
            
                {pageNumber === 0 && <WelcomeLogin />}
                {pageNumber === 1 && <Colors setClickedOrder={setClickedOrder} />}
                {pageNumber === 2 && <Clothes setClickedOrder1={setClickedOrder1} />}
                {pageNumber === 3 && <Gender setClickedOrder2={setClickedOrder2} />}
                {pageNumber === 4 && <Submission userRes={userRes}/>}


                {pageNumber != 4 && <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2}>
                    {error && <p style={{ color: '#B284CC' }}>{error}</p>}
                    <Button onClick={buttonHandler} variant="outlined">Continue {arrow}</Button>
                </Box>}
            
        </>
    );
}
