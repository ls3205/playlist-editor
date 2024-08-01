"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useContext } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";

export type SongListItem = {
    song: Song;
} & {
    [playlists: string]: { playlistID: string; addedAt: string }[];
};

const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);

export const columns: ColumnDef<SongListItem>[] = [
    {
        accessorKey: "song",
        header: "Song",
    },
    ...openPlaylists.map((playlist) => {
        return {
            accessorKey: playlist.id,
            header: playlist.name,
        };
    }),
];
