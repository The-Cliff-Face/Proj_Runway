'use client';

import * as React from 'react';
import Profile from './Profile';
import { ConnectProvider } from '../home/Connectors';
import RunwayAppBar from '../RunwayAppBar';

export default function ProfileWrapper() {
    return (
        <>  
        <RunwayAppBar></RunwayAppBar>
        <ConnectProvider>
            <Profile></Profile>
        </ConnectProvider>
        </>
    );
}