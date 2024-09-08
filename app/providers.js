'use client';

import { ThemeProvider, createTheme } from "@mui/material";
import { LoginProvider } from "./frontend/contexts/LoginContext";
import { UserProvider } from "./frontend/contexts/UserContext";


export function Providers({ children, font }) {
    const theme = createTheme({
        typography: {
            fontFamily: font.style.fontFamily
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <LoginProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </LoginProvider>
        </ThemeProvider>
    )
}