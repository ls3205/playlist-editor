import React, { createContext, useState } from "react";

interface PlaylistHistoryContextProps {
    children: React.ReactNode;
}

interface PlaylistHistoryContextTypes {
    playlistHistory: string[];
    setPlaylistHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

const PlaylistHistoryContextDefaultValues: PlaylistHistoryContextTypes = {
    playlistHistory: [],
    setPlaylistHistory: () => {},
};

export const OpenedPlaylists = createContext<PlaylistHistoryContextTypes>(
    PlaylistHistoryContextDefaultValues,
);

const PlaylistHistoryContext: React.FC<PlaylistHistoryContextProps> = ({
    children,
}) => {
    const [playlistHistory, setPlaylistHistory] = useState<string[]>([]);

    return (
        <OpenedPlaylists.Provider value={{ playlistHistory, setPlaylistHistory }}>
            {children}
        </OpenedPlaylists.Provider>
    );
};

export default PlaylistHistoryContext;
