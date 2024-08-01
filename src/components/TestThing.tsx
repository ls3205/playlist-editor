"use client";

import React, { useContext } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedSongs } from "./context/SongsContext";

interface TestThingProps {}

const TestThing: React.FC<TestThingProps> = ({}) => {
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);

    return (
        <div className="flex flex-col">
            {[...openedSongs.keys()].map((song) => {
                return (
                    <h1>
                        {song.name} {`${openedSongs.get(song)}`}
                    </h1>
                );
            })}
        </div>
    );
};

export default TestThing;
