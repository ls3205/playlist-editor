"use client";

import { Check, Loader2, Music } from "lucide-react";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";
import { cn } from "~/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { OpenedSongs } from "./context/SongsContext";
import { Session } from "next-auth";
import { OpenedPlaylists } from "./context/PlaylistHistoryContext";
import { EditorLoadingContext } from "./context/EditorContext";

interface PlaylistProps {
    playlist: SimplifiedPlaylist;
    session: Session;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist, session }) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { playlistHistory, setPlaylistHistory } = useContext(OpenedPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);
    const { editorLoading, setEditorLoading } = useContext(EditorLoadingContext);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { mutate: OpenSongs } = useMutation({
        mutationKey: ["OpenSongs"],
        mutationFn: async (playlist: SimplifiedPlaylist) => {
            setLoading(true);
            setEditorLoading(true);

            let songs: PlaylistTrackObject[] = [];
            const { data }: { data: GetPlaylistSongsReturn } = await axios.get(
                `${playlist.tracks.href}?limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            data.items.map((TrackObject) => {
                songs.push(TrackObject);
            });

            if (data.next) {
                await getMoreData(songs, data.next);
            }

            return songs;
        },
        onError: (err) => {
            setLoading(false);
            setEditorLoading(false);
        },
        onSuccess: (data) => {
            data.map((TrackObject) => {
                if (openedSongs.map(song => song.id).includes(TrackObject.track.id)) {
                    const index = openedSongs.map(song => song.id).indexOf(TrackObject.track.id)
                    setOpenedSongs((openedSongs) => [...openedSongs.slice(0, index), {...TrackObject.track, playlists: [...(openedSongs[index]?.playlists as []), {playlistID: playlist.id, addedAt: TrackObject.added_at}]}, ...openedSongs.slice(index + 1)])
                } else {
                    setOpenedSongs((openedSongs) => [...openedSongs, {...TrackObject.track, playlists:[{playlistID: playlist.id, addedAt: TrackObject.added_at}]}])
                }
            })
            setLoading(false);
            setEditorLoading(false);
        },
    });

    const getMoreData = async (
        songsArray: PlaylistTrackObject[],
        href: string,
    ) => {
        const { data }: { data: GetPlaylistSongsReturn } = await axios.get(
            href,
            {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    "Content-Type": "application/json",
                },
            },
        );

        data.items.map((TrackObject) => {
            songsArray.push(TrackObject);
        });

        if (data.next) {
            await getMoreData(songsArray, data.next);
        }
    };

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
        if (!playlistHistory.includes(playlist.id)) {
            setPlaylistHistory([...playlistHistory, playlist.id]);
            OpenSongs(playlist);
        }
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
            className="flex w-full flex-row items-center justify-center rounded-md p-2 transition-all duration-200 hover:bg-neutral-800"
            onClick={onOpenChange}
        >
            <div
                className={cn(
                    "flex h-[40px] items-center justify-center",
                    open ? "w-[40px]" : "w-0",
                )}
            >
                <div
                    className={cn(
                        "h-5 w-5 items-center justify-center rounded-full",
                        open ? "flex" : "hidden",
                        loading ? "bg-transparent" : "bg-primary",
                    )}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Check />}
                </div>
            </div>
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
                <h1 className="min-w-0 max-w-[calc(100%)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
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
