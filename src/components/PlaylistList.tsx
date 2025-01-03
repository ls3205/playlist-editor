"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import React from "react";
import { ScrollArea } from "./ui/ScrollArea";
import Playlist from "./Playlist";
import AddPlaylist from "./AddPlaylist";

interface PlaylistListProps {
    session: Session;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ session }) => {
    const {
        data,
        isLoading,
        error,
        refetch: RefetchPlaylists,
    } = useQuery({
        queryKey: ["GetPlaylists"],
        queryFn: async () => {
            const { data } = await axios.get(
                `https://api.spotify.com/v1/me/playlists?limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            return data as GetUserPlaylistsReturn;
        },
    });

    return (
        <div className="h-[calc(80%-8px)] w-full rounded-md bg-secondary py-2">
            {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : error ? (
                <div className="flex h-full w-full items-center justify-center">
                    <h1 className="text-xl font-semibold text-red-500">
                        We're sorry. An error occured fetching your playlists,
                        please try again.
                    </h1>
                </div>
            ) : (
                <ScrollArea className="h-full w-auto">
                    <div className="w-[351px] p-4">
                        <AddPlaylist refetch={RefetchPlaylists} session={session} />
                        {data?.items.map((playlist, key) => {
                            return (
                                <Playlist
                                    playlist={playlist}
                                    session={session}
                                    key={key}
                                />
                            );
                        })}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default PlaylistList;
