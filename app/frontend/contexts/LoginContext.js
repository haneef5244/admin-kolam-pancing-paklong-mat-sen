'use client';

const { createContext, useState } = require("react");

const LoginContext = createContext();

const LoginProvider = ({ children }) => {

    const [displayLogin, setDisplayLogin] = useState(false);

    return <LoginContext.Provider value={({ displayLogin, setDisplayLogin })}>
        {children}
    </LoginContext.Provider>
}

export { LoginContext, LoginProvider }