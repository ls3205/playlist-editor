import React, { createContext, useState } from "react";

interface SongsContextProps {
    children: React.ReactNode;
}

interface OpenSongListType extends Song {
    playlists: {
        playlistID: string,
        addedAt: string,
    }[];
}

interface SongsContextTypes {
    openedSongs: OpenSongListType[];
    setOpenedSongs: React.Dispatch<React.SetStateAction<OpenSongListType[]>>;
}

const SongsContextDefaultValues: SongsContextTypes = {
    openedSongs: [],
    setOpenedSongs: () => {},
};

export const OpenedSongs = createContext<SongsContextTypes>(
    SongsContextDefaultValues,
);

const SongsContext: React.FC<SongsContextProps> = ({ children }) => {
    const [openedSongs, setOpenedSongs] = useState<OpenSongListType[]>([]);

    return (
        <OpenedSongs.Provider value={{ openedSongs, setOpenedSongs }}>
            {children}
        </OpenedSongs.Provider>
    );
};

export default SongsContext;
