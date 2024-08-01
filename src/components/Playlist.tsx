"use client";

import { Music } from "lucide-react";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";

interface PlaylistProps {
    playlist: SimplifiedPlaylist;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist }) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const [open, setOpen] = useState(false);

    const onOpenChange = () => {
        if (open) {
            onClose();
        } else {
            onOpen();
        }
    };

    const onOpen = () => {
        setOpen(true);
        setOpenPlaylists([...openPlaylists, playlist]);
    };

    const onClose = () => {
        setOpen(false);
        setOpenPlaylists([
            ...openPlaylists.slice(0, openPlaylists.indexOf(playlist)),
            ...openPlaylists.slice(openPlaylists.indexOf(playlist) + 1),
        ]);
    };

    return (
        <div
            className="flex w-full flex-row items-center justify-center rounded-md p-2 transition-colors duration-200 hover:bg-neutral-800"
            onClick={onOpenChange}
        >
            {playlist.images ? (
                <Image
                    src={playlist.images[0]?.url!}
                    alt="Playlist Cover"
                    width={40}
                    height={40}
                />
            ) : (
                <div className="h-[40px] w-[40px]">
                    <Music className="h-full w-full" />
                </div>
            )}
            <div className="ml-2 flex w-full flex-col overflow-hidden">
                <h1 className="min-w-0 max-w-[calc(100%-32px)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                    {playlist.name}
                </h1>
                <h3 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-neutral-400">
                    {playlist.owner.display_name ?? playlist.owner.id}
                </h3>
            </div>
        </div>
    );
};

export default Playlist;
