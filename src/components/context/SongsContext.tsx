import React, { createContext, useState } from "react";

interface SongsContextProps {
    children: React.ReactNode;
}

interface SongsContextTypes {
    openedSongs: Map<Song, { playlistID: string; addedAt: string }[]>;
    setOpenedSongs: React.Dispatch<
        React.SetStateAction<
            Map<Song, { playlistID: string; addedAt: string }[]>
        >
    >;
}

const SongsContextDefaultValues: SongsContextTypes = {
    openedSongs: new Map(),
    setOpenedSongs: () => {},
};

export const OpenedSongs = createContext<SongsContextTypes>(
    SongsContextDefaultValues,
);

const SongsContext: React.FC<SongsContextProps> = ({ children }) => {
    const [openedSongs, setOpenedSongs] = useState<
        Map<Song, { playlistID: string; addedAt: string }[]>
    >(new Map());

    return (
        <OpenedSongs.Provider value={{ openedSongs, setOpenedSongs }}>
            {children}
        </OpenedSongs.Provider>
    );
};

export default SongsContext;
