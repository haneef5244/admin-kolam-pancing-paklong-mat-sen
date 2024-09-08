'use client';

import { getCookie } from "cookies-next";

const { createContext, useEffect, useState } = require("react");

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [token, setToken] = useState('');

    useEffect(() => {
        if (document && document.cookie) {
            const token = getCookie('token');

            if (token) {
                setToken(token);
            } else {
                setToken('');
            }
        } else setToken('');

    }, [])

    const getToken = () => {
        const cookie = getCookie('token');
        if (cookie == undefined) {
            setToken(null)
            return;
        }
        setToken(cookie);
        return;
    };

    return <UserContext.Provider value={({ token, getToken })}>
        {children}
    </UserContext.Provider>
}

export { UserContext, UserProvider }