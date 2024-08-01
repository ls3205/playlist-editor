import React, { createContext, useState } from "react";

interface PlaylistContextProps {
    children: React.ReactNode;
}

interface PlaylistContextTypes {
    openPlaylists: SimplifiedPlaylist[];
    setOpenPlaylists: React.Dispatch<
        React.SetStateAction<SimplifiedPlaylist[]>
    >;
}

const PlaylistContextDefaultValues: PlaylistContextTypes = {
    openPlaylists: [],
    setOpenPlaylists: () => {},
};

export const OpenPlaylists = createContext<PlaylistContextTypes>(
    PlaylistContextDefaultValues,
);

const PlaylistContext: React.FC<PlaylistContextProps> = ({ children }) => {
    const [openPlaylists, setOpenPlaylists] = useState<SimplifiedPlaylist[]>(
        [],
    );

    return (
        <OpenPlaylists.Provider value={{ openPlaylists, setOpenPlaylists }}>
            {children}
        </OpenPlaylists.Provider>
    );
};

export default PlaylistContext;
