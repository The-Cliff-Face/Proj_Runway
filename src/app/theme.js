'use client';

// see https://mui.com/material-ui/integrations/nextjs/#theming

import { Montserrat } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const montserrat = Montserrat({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

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
    // disable button ripple globally (see https://mui.com/material-ui/getting-started/faq/#how-can-i-disable-the-ripple-effect-globally)
    components: {
        // Name of the component
        MuiButtonBase: {
            defaultProps: {
                // The props to apply
                disableRipple: true, // No more ripple, on the whole application
            },
        },
    },

    typography: {
        fontFamily: montserrat.style.fontFamily,
    },
});

export default theme;