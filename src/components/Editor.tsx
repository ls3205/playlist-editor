"use client";

import React, { useContext, useEffect, useState } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedPlaylists } from "./context/PlaylistHistoryContext";
import { OpenedSongs, OpenSongListType } from "./context/SongsContext";
import { ResizablePanel } from "./ui/Resizable";
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/Table";
import { ScrollArea } from "./ui/ScrollArea";
import SongTableItem from "./SongTableItem";
import { EditorLoadingContext } from "./context/EditorContext";
import { Session } from "next-auth";

interface EditorProps {
    session: Session;
}

const Editor: React.FC<EditorProps> = ({ session }) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { playlistHistory, setPlaylistHistory } = useContext(OpenedPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);
    const { editorLoading, setEditorLoading } =
        useContext(EditorLoadingContext);
    const [sortingMode, setSortingMode] = useState<{
        mode: string;
        dir: "asc" | "desc";
    }>({ mode: "alphabetical", dir: "desc" });

    const sortSongs = (a: OpenSongListType, b: OpenSongListType) => {
        if (sortingMode.mode === "alphabetical") {
            if (sortingMode.dir === "desc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        } else {
            const aDate = a.playlists.find((playlist) => {
                return playlist.playlistID === sortingMode.mode;
            });

            const bDate = b.playlists.find((playlist) => {
                return playlist.playlistID === sortingMode.mode;
            });

            if (aDate && bDate) {
                if (sortingMode.dir === "desc") {
                    return (
                        new Date(aDate.addedAt).valueOf() -
                        new Date(bDate.addedAt).valueOf()
                    );
                } else {
                    return (
                        new Date(bDate.addedAt).valueOf() -
                        new Date(aDate.addedAt).valueOf()
                    );
                }
            } else {
                if (aDate) {
                    return -1;
                } else if (bDate) {
                    return 1;
                } else {
                    return 1;
                }
            }
        }
    };

    const handleSortingChange = (itemClicked: string) => {
        if (itemClicked === sortingMode.mode) {
            if (sortingMode.dir === "desc") {
                setSortingMode({ mode: itemClicked, dir: "asc" });
            } else {
                setSortingMode({ mode: itemClicked, dir: "desc" });
            }
        } else {
            setSortingMode({ mode: itemClicked, dir: "desc" });
        }
    };

    return (
        <ResizablePanel
            defaultSize={66}
            className="relative w-full rounded-md bg-secondary"
        >
            <div className="h-[calc(100%)] w-full">
                {openedSongs.length != 0 && openPlaylists.length != 0 ? (
                    <ScrollArea className="h-full w-auto">
                        <div>
                            <Table className="h-[calc(100%)] max-h-[calc(100%)] table-fixed overflow-hidden overflow-y-scroll">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="w-1/5"
                                            onClick={() => {
                                                handleSortingChange(
                                                    "alphabetical",
                                                );
                                            }}
                                        >
                                            <h1 className="flex flex-row">
                                                Song
                                                {sortingMode.mode ===
                                                "alphabetical" ? (
                                                    sortingMode.dir ===
                                                    "desc" ? (
                                                        <ChevronDown />
                                                    ) : (
                                                        <ChevronUp />
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </h1>
                                        </TableHead>
                                        {openPlaylists.map((playlist, key) => {
                                            return (
                                                <TableHead
                                                    key={key}
                                                    onClick={() => {
                                                        handleSortingChange(
                                                            playlist.id,
                                                        );
                                                    }}
                                                >
                                                    <h1 className="flex flex-row">
                                                        {playlist.name}
                                                        {sortingMode.mode ===
                                                        playlist.id ? (
                                                            sortingMode.dir ===
                                                            "desc" ? (
                                                                <ChevronDown />
                                                            ) : (
                                                                <ChevronUp />
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </h1>
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="max-h-full">
                                    {openedSongs
                                        .sort((a, b) => {
                                            return sortSongs(a, b);
                                        })
                                        .map((song, index) => {
                                            if (
                                                song.playlists
                                                    .map(
                                                        (playlist) =>
                                                            playlist.playlistID,
                                                    )
                                                    .some((id) =>
                                                        openPlaylists
                                                            .map(
                                                                (playlist) =>
                                                                    playlist.id,
                                                            )
                                                            .includes(id),
                                                    )
                                            ) {
                                                return (
                                                    <SongTableItem
                                                        song={song}
                                                        session={session}
                                                        index={index}
                                                    />
                                                );
                                            }
                                        })}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                ) : (
                    <>
                        {sortingMode.mode !== "alphabetical"
                            ? setSortingMode({
                                  mode: "alphabetical",
                                  dir: "desc",
                              })
                            : ""}
                        <div className="flex h-full w-full flex-col items-center justify-center">
                            <AlertCircle />
                            <h1>Open a Playlist to Get Started</h1>
                        </div>
                    </>
                )}
            </div>
            {editorLoading ? (
                <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-md bg-background/80">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                ""
            )}
        </ResizablePanel>
    );
};

export default Editor;
