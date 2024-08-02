"use client";

import React, { useContext, useEffect, useState } from "react";
import { ResizablePanel } from "./ui/Resizable";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { OpenPlaylists } from "./context/PlaylistContext";
import { OpenedPlaylists } from "./context/PlaylistHistoryContext";
import { OpenedSongs } from "./context/SongsContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/Table";
import { AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/ScrollArea";
import SongTableItem from "./SongTableItem";

interface SearchProps {
    session: Session;
}

const Search: React.FC<SearchProps> = ({ session }) => {
    const { openPlaylists, setOpenPlaylists } = useContext(OpenPlaylists);
    const { playlistHistory, setPlaylistHistory } = useContext(OpenedPlaylists);
    const { openedSongs, setOpenedSongs } = useContext(OpenedSongs);

    const [filter, setFilter] = useState<"song" | "artist" | "genre">("song");
    const [searchValue, setSearchValue] = useState("");
    const [searchData, setSearchData] = useState<
        SongsSearchReturn | undefined
    >();
    var inputTimer: ReturnType<typeof setTimeout>;

    const inputTimoutHandler = () => {
        if (inputTimer) {
            clearTimeout(inputTimer);
        }

        inputTimer = setTimeout(() => {
            const input = (
                document.getElementById("searchInput") as HTMLSelectElement
            ).value;

            if (input !== "") {
                SearchSongs();
            } else {
                setSearchData(undefined);
            }
        }, 1000);
    };

    useEffect(() => {
        const input = (
            document.getElementById("searchInput") as HTMLSelectElement
        ).value;
        if (input !== "") {
            SearchSongs();
        } else {
            setSearchData(undefined);
        }
    }, [filter]);

    const { mutate: SearchSongs, isPending: searchLoading } = useMutation({
        mutationKey: ["SearchSongs"],
        mutationFn: async () => {
            const createQuery = () => {
                const input = (
                    document.getElementById("searchInput") as HTMLSelectElement
                ).value;
                const query = () => {
                    if (filter === "song") {
                        return `track:${input}`;
                    } else if (filter === "artist") {
                        return `artist:${input}`;
                    } else if (filter === "genre") {
                        return `genre:${input}`;
                    } else {
                        return "";
                    }
                };

                return new URLSearchParams({ q: query() });
            };

            const { data } = await axios.get(
                `https://api.spotify.com/v1/search?type=track&limit=25&` +
                    createQuery(),
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            return data;
        },
        onError: (err) => {
            console.log(err);
        },
        onSuccess(data, variables) {
            setSearchData(data);
        },
    });

    return (
        <ResizablePanel
            defaultSize={33}
            className="relative w-full rounded-md bg-secondary"
        >
            <div className="flex w-full flex-row p-2">
                <Input
                    className="w-72"
                    onInput={inputTimoutHandler}
                    id="searchInput"
                    placeholder="Search..."
                />
                <Select
                    value={filter}
                    onValueChange={(filter: "song" | "artist" | "genre") =>
                        setFilter(filter)
                    }
                >
                    <SelectTrigger className="ml-4 w-32">
                        <SelectValue placeholder="Search for..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="song">Song</SelectItem>
                            <SelectItem value="artist">Artist</SelectItem>
                            <SelectItem value="genre">Genre</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {searchData !== undefined ? (
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
                                {searchData.tracks.items.map((song, key) => {
                                    return (
                                        <SongTableItem
                                            song={song}
                                            session={session}
                                            key={key}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <AlertCircle />
                    <h1>Search a Song to Get Started</h1>
                </div>
            )}
            {searchLoading ? (
                <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-md bg-background/80">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                ""
            )}
        </ResizablePanel>
    );
};

export default Search;
