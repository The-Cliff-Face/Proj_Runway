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
    typography: {
        fontFamily: montserrat.style.fontFamily,
    },
});

export default theme;