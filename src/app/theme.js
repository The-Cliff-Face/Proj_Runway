'use client';

// see https://mui.com/material-ui/integrations/nextjs/#theming

import { Montserrat } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const montserrat = Montserrat({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// This function call creates the theme that is used by the whole application.
// You can customize it by following the docs at mui.com.
// Especially helpful is https://mui.com/material-ui/customization/color/
const theme = createTheme({
    // colors ripped from https://zenoo.github.io/mui-theme-creator/
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#fc6399',
        },
        background: {
            default: '#2a1233',
            paper: '#2a1233',
        },
        error: {
            main: '#f64747',
        },
        warning: {
            main: '#f9bf3b',
        },
        info: {
            main: '#009fd4',
        },
        success: {
            main: '#00b16a',
        },
    },

    typography: {
        fontFamily: montserrat.style.fontFamily,
    },
});

export default theme;