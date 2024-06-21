import { Inter } from "next/font/google";
import "./globals.css";

import AppBar from '@mui/material/AppBar';

// see https://mui.com/material-ui/integrations/nextjs/
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';

import RunwayAppBar from './RunwayAppBar.js';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Runway",
  description: "Find what speaks to you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <RunwayAppBar />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
