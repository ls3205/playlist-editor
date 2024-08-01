"use client";

import React, { useContext } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";

interface TestThingProps {}

const TestThing: React.FC<TestThingProps> = ({}) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);

    return (
        <div>
            {openPlaylists.map((playlist) => {
                return <h1>{playlist.name}</h1>;
            })}
        </div>
    );
};

export default TestThing;
