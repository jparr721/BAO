import React, { createContext, useState, useContext } from "react";

interface FrameContextType {
    frame: number;
    setFrame: React.Dispatch<React.SetStateAction<number>>;
}


const FrameContext = createContext<FrameContextType>({ frame: 0, setFrame: () => { } });

interface FrameProviderProps {
    children: React.ReactNode;
}

export const FrameProvider = ({ children }: FrameProviderProps) => {
    const [frame, setFrame] = useState(0);
    return (
        <FrameContext.Provider value={{ frame, setFrame }}>
            {children}
        </FrameContext.Provider>
    );
};

export const useFrame = () => useContext(FrameContext);