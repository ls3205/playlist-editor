"use client";

import React, { useContext } from "react";
import { TableCell, TableRow } from "./ui/Table";
import Image from "next/image";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedSongs } from "./context/SongsContext";
import { Checkbox } from "./ui/checkbox";

interface SongTableItemProps {
    song: Song;
}

const SongTableItem: React.FC<SongTableItemProps> = ({ song }) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);

    return (
        <TableRow>
            <TableCell className="flex flex-row">
                <Image
                    src={song.album.images[1]?.url!}
                    alt="Playlist Cover"
                    width={40}
                    height={40}
                />
                <div className="ml-2 flex w-full flex-col overflow-hidden">
                    <h1 className="min-w-0 max-w-[calc(100%)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                        {song.name}
                    </h1>
                    <h3 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-neutral-400">
                        {song.artists[0]?.name}
                    </h3>
                </div>
            </TableCell>
            {openPlaylists.map((playlist, key) => {
                return (
                    <TableCell key={key}>
                        <Checkbox
                            checked={openedSongs
                                .find((openedSong) => openedSong.id === song.id)
                                ?.playlists.map(
                                    (playlist) => playlist.playlistID,
                                )
                                .includes(playlist.id)}
                        />
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export default SongTableItem;
