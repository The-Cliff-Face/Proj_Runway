'use client';

import * as React from 'react';
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
import Explore from './tabs/Explore';
//import IconButton from '@mui/joy/IconButton';
//import FavoriteBorder from '@mui/icons-material/FavoriteBorder';


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

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Coffee',
    author: '@danielcgold',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
  },
];

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Explore" {...a11yProps(0)} />
          <Tab label="For You" {...a11yProps(1)} />
          <Tab label="What's Hot" {...a11yProps(2)} />
        </Tabs>
      </Box>


      <CustomTabPanel value={value} index={0}>
        <Explore/>
      </CustomTabPanel>


      <CustomTabPanel value={value} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>  {/* Center the ImageList */}
          <ImageList sx={{ width: 1200, height: 650, gap: 16 }} cols={4} rowHeight={260}>
            {itemData.map((item) => (
              <ImageListItem
                key={item.img}
                sx={{
                  margin: 5, // Add margin to create spacing around each image
                  // boxShadow: '0px 0px 30px rgba(188, 113, 223, 0.6)', // Apply shadow here
                }}
              >
                <img
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    border: '2px solid rgba(188, 113, 223, 1)',
                    boxShadow: '0px 0px 30px rgba(188, 113, 223, 0.6)',
                  }}
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={<span>by: {item.author}</span>}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </CustomTabPanel>


      <CustomTabPanel value={value} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>  {/* Center the ImageList */}
          <ImageList sx={{ width: 1200, height: 650, gap: 16 }} cols={4} rowHeight={260}>
            {itemData.map((item) => (
              <ImageListItem
                key={item.img}
                sx={{
                  margin: 5, // Add margin to create spacing around each image
                  // boxShadow: '0px 0px 30px rgba(188, 113, 223, 0.6)', // Apply shadow here
                }}
              >
                <img
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    border: '2px solid rgba(214, 178, 108, 1)',
                    boxShadow: '0px 0px 30px rgba(214, 178, 108, 0.6)',
                  }}
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={<span>by: {item.author}</span>}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </CustomTabPanel>
    </Box>
  );
}