'use client';
import * as React from 'react';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/AuthContext';
import RadarChart from './RadarChart';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import "./styles.css";

export default function Submission({ userRes }) {
    const router = useRouter();
    var bp = require('/src/app/Path.js');
    let { token, refreshToken } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [didSubmit, setBool] = useState(false);

    const goHome = async () => {
        router.push('/home');
    }

    useEffect(() => {
        const start = () => {
            updateRecommendations();
            grabRecommendedClusters();
        };
        start();
      }, []);

    const grabRecommendedClusters = async () => {
        if (!token) {
            const newToken = await refreshToken();
            token = newToken;
        }

        try {
            const response = await fetch(bp.buildPath('api/recommend'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });

            var txt = await response.text();
            var res = JSON.parse(txt);
            if (res.error != "") {
                console.log(res.error);
            }

            let clusNames = [];
            for (let i = 0; i < 3; i++) {
                var _results = res.results.ret[i].data.values;
                var score = res.results.ret[i].score;

                let searchString = "";
                for (var j = 0; j < _results.length && j < 3; j++) {
                    searchString += _results[j];
                    searchString += " ";
                }
                clusNames.push({ name: searchString, score: score });
            }
            setData(clusNames);
            setBool(true);

        } catch (e) {
            console.log(e.toString());
        }
    };

    const updateRecommendations = async () => {
        if (!token) {
            const newToken = await refreshToken();
            token = newToken;
        }
        var obj = { recommendation: userRes.recommendations };
        var js = JSON.stringify(obj);
        console.log(obj);

        try {
            const response = await fetch(bp.buildPath('api/updateRecommendations'), {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });
            var txt = await response.text();
            console.log(txt);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.0 }}
        >
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                flexDirection="column" 
                gap={2}
                height="100vh"
                textAlign="center"
                overflow="auto" 
            >
                <p2>Your Survey Results</p2>
                {didSubmit && (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <p1>Here is a radar chart of what we think will suit you based on your preferences.</p1>
                        <br></br>
                        <RadarChart data={data} />
                    </Box>
                )}
                <Button variant="outlined" onClick={goHome}>Done</Button>
            </Box>
        </motion.div>
    );
}
