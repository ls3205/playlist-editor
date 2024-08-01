"use client";

import React, { useContext } from "react";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedPlaylists } from "./context/PlaylistHistoryContext";
import { OpenedSongs } from "./context/SongsContext";
import { ResizablePanel } from "./ui/Resizable";
import { AlertCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/Table";
import { ScrollArea } from "./ui/ScrollArea";
import SongTableItem from "./SongTableItem";
import { EditorLoadingContext } from "./context/EditorContext";
import { Session } from "next-auth";

interface EditorProps {
    session: Session
}

const Editor: React.FC<EditorProps> = ({session}) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { playlistHistory, setPlaylistHistory } = useContext(OpenedPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);
    const { editorLoading, setEditorLoading } =
        useContext(EditorLoadingContext);

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
                                        <TableHead className="w-1/5">
                                            Song
                                        </TableHead>
                                        {openPlaylists.map((playlist, key) => {
                                            return (
                                                <TableHead key={key}>
                                                    {playlist.name}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="max-h-full">
                                    {openedSongs
                                        .sort((a, b) => {
                                            return a.name.localeCompare(b.name);
                                        })
                                        .map((song, key) => {
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
                                                        key={key}
                                                    />
                                                );
                                            }
                                        })}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <AlertCircle />
                        <h1>Open a Playlist to Get Started</h1>
                    </div>
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
