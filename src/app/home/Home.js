'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Explore from './tabs/Explore';
import { useState } from 'react';
import WhatsHot from './tabs/WhatsHot';
import ForYou from './tabs/ForYou';
import { ConnectProvider } from './Connectors';
import RunwayAppBar from '../RunwayAppBar';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ExploreIcon from '@mui/icons-material/Explore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const [value, setValue] = React.useState(1);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    setIsClicked(!isClicked); 
  };


  return (
    <Box sx={{ width: '100%' }}>
      <RunwayAppBar></RunwayAppBar>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab icon={<ExploreIcon />} label="Explore" {...a11yProps(0)} />
          <Tab icon={<AutoAwesomeIcon/>} label="For You" {...a11yProps(1)} />
          <Tab icon={<WhatshotIcon />} label="What's Hot" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <ConnectProvider>
      <CustomTabPanel value={value} index={0}>
        <Explore />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <ForYou />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <WhatsHot />
      </CustomTabPanel>
      </ConnectProvider>
    </Box>
  );
}
