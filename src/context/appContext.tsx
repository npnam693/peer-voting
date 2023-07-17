'use client'
import { createContext, useContext, useState } from "react";

type appContextType = {
    web3: any;
    address: string;
    login: (address: string) => void;
    setWeb3: (web3: any) => void;
};

const appContextDefault: appContextType = {
    web3: null,
    address: '',
    login: () => {},
    setWeb3: () => {}
};

const AppContext = createContext<appContextType>(appContextDefault);


type Props = {
    children: React.ReactNode;
};

export function AuthProvider({children}: Props) {
    const [address, setAddress] = useState<string>(appContextDefault.address);
    const [web3, setWeb3] = useState<any>(appContextDefault.web3)

    const login = (address: string) => {
        setAddress(address);
    };



    const value : appContextType = {
        address,
        web3,
        login,
        setWeb3
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}