"use client";

import React, { useContext, useState } from "react";
import { TableCell, TableRow } from "./ui/Table";
import Image from "next/image";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedSongs } from "./context/SongsContext";
import { Checkbox } from "./ui/Checkbox";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import axios from "axios";
import { Loader2, Music } from "lucide-react";

interface SongTableItemProps {
    song: Song;
    session: Session;
    index: number;
}

const SongTableItem: React.FC<SongTableItemProps> = ({
    song,
    session,
    index,
}) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);

    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const { mutate: AddToPlaylist } = useMutation({
        mutationKey: ["AddToPlaylist"],
        mutationFn: async ({
            song,
            playlist,
        }: {
            song: Song;
            playlist: SimplifiedPlaylist;
        }) => {
            setLoadingIds((loadingIds) => [...loadingIds, playlist.id]);

            const { data } = await axios.post(
                `${playlist.href}/tracks`,
                {
                    uris: [song.uri],
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            return data as string;
        },
        onError: (err, variables) => {
            console.log(err);
            setLoadingIds(
                loadingIds?.filter((id) => id !== variables.playlist.id),
            );
        },
        onSuccess: (data, variables) => {
            if (
                openedSongs.map((song) => song.id).includes(variables.song.id)
            ) {
                const index = openedSongs
                    .map((song) => song.id)
                    .indexOf(variables.song.id);
                setOpenedSongs((openedSongs) => [
                    ...openedSongs.slice(0, index),
                    {
                        ...variables.song,
                        playlists: [
                            ...(openedSongs[index]?.playlists as []),
                            {
                                playlistID: variables.playlist.id,
                                addedAt: new Date(Date.now()).toISOString(),
                            },
                        ],
                    },
                    ...openedSongs.slice(index + 1),
                ]);
            } else {
                setOpenedSongs((openedSongs) => [
                    ...openedSongs,
                    {
                        ...variables.song,
                        playlists: [
                            {
                                playlistID: variables.playlist.id,
                                addedAt: new Date(Date.now()).toISOString(),
                            },
                        ],
                    },
                ]);
            }
            setLoadingIds(
                loadingIds?.filter((id) => id !== variables.playlist.id),
            );
        },
    });

    const { mutate: RemoveFromPlaylist } = useMutation({
        mutationKey: ["RemoveFromPlaylist"],
        mutationFn: async ({
            song,
            playlist,
        }: {
            song: Song;
            playlist: SimplifiedPlaylist;
        }) => {
            setLoadingIds((loadingIds) => [...loadingIds, playlist.id]);

            const { data } = await axios.delete(`${playlist.href}/tracks`, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                    "Content-Type": "application/json",
                },
                data: {
                    tracks: [{ uri: song.uri }],
                    snapshot_id: playlist.snapshot_id,
                },
            });

            return data as string;
        },
        onError: (err, variables) => {
            console.log(err);
            setLoadingIds(
                loadingIds?.filter((id) => id !== variables.playlist.id),
            );
        },
        onSuccess: (data, variables) => {
            const index = openedSongs
                .map((song) => song.id)
                .indexOf(variables.song.id);
            const subindex = openedSongs[index]!.playlists.map(
                (playlist) => playlist.playlistID,
            ).indexOf(variables.playlist.id);
            setOpenedSongs((openedSongs) => [
                ...openedSongs.slice(0, index),
                {
                    ...song,
                    playlists: [
                        ...(openedSongs[index]?.playlists.slice(
                            0,
                            subindex,
                        ) as []),
                        ...(openedSongs[index]?.playlists.slice(
                            subindex + 1,
                        ) as []),
                    ],
                },
                ...openedSongs.slice(index + 1),
            ]);
            setLoadingIds(
                loadingIds?.filter((id) => id !== variables.playlist.id),
            );
        },
    });

    return (
        <TableRow>
            <TableCell className="flex flex-row">
                <div className="mr-4 flex h-full min-w-8 items-center justify-center">
                    <h1 className="h-full align-middle text-lg leading-[36px] text-neutral-400">
                        {index + 1}
                    </h1>
                </div>
                {song.album.images[1]?.url ? (
                    <Image
                        src={song.album.images[1]?.url!}
                        alt="Playlist Cover"
                        width={40}
                        height={40}
                    />
                ) : (
                    <div className="h-[40px] min-w-[40px]">
                        <Music className="h-full w-full" />
                    </div>
                )}

                <div className="ml-2 flex w-full flex-col overflow-hidden">
                    <h1 className="min-w-0 max-w-[calc(100%)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                        {song.name}
                    </h1>
                    <h3 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-neutral-400">
                        {song.is_local ? "Local File" : song.artists[0]?.name}
                    </h3>
                </div>
            </TableCell>
            {openPlaylists.map((playlist, key) => {
                return (
                    <TableCell key={key}>
                        {loadingIds?.includes(playlist.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Checkbox
                                checked={openedSongs
                                    .find(
                                        (openedSong) =>
                                            openedSong.id === song.id,
                                    )
                                    ?.playlists.map(
                                        (playlist) => playlist.playlistID,
                                    )
                                    .includes(playlist.id)}
                                onCheckedChange={(state) => {
                                    state
                                        ? AddToPlaylist({
                                              song,
                                              playlist,
                                          })
                                        : RemoveFromPlaylist({
                                              song,
                                              playlist,
                                          });
                                }}
                            />
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export default SongTableItem;
