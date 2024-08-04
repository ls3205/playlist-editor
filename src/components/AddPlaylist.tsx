"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/Dialog";
import AddPlaylistForm, { formSchema } from "./AddPlaylistForm";
import { z } from "zod";
import axios from "axios";
import { Session } from "next-auth";

interface AddPlaylistProps {
    refetch: () => void;
    session: Session;
}

const AddPlaylist: React.FC<AddPlaylistProps> = ({ refetch, session }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setLoading(true);
    };

    const { mutate: AddPlaylistMutation, isPending: addLoading } = useMutation({
        mutationKey: ["AddPlaylist"],
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const { data } = await axios.post(
                `https://api.spotify.com/v1/users/${session.user.sub}/playlists`,
                {
                    name: values.name,
                    description: values.description,
                    public: values.public,
                },
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
            setOpen(false);
            setLoading(false);
        },
        onSuccess(data, variables) {
            setOpen(false);
            setLoading(false);
            refetch();
        },
    });

    useEffect(() => {
        if (!open) {
            setLoading(false);
        }
    }, [open]);

    return (
        <>
            <div
                className="flex h-[56px] w-full flex-row items-center justify-center rounded-md p-2 transition-all duration-200 hover:bg-neutral-800"
                onClick={handleOpen}
            >
                <div className="h-[40px] min-w-[40px] p-1.5">
                    {loading ? (
                        <Loader2 className="h-full w-full animate-spin" />
                    ) : (
                        <PlusCircle className="h-full w-full" />
                    )}
                </div>
                <div className="ml-2 flex w-full flex-col overflow-hidden">
                    <h1 className="min-w-0 max-w-[calc(100%)] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                        Add Playlist
                    </h1>
                    <h3 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-neutral-400">
                        Click to add a playlist...
                    </h3>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Add a New Playlist</DialogTitle>
                    </DialogHeader>
                    <AddPlaylistForm mutation={AddPlaylistMutation} />
                </DialogContent>
                {addLoading ? (
                    <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-md bg-background/80">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    ""
                )}
            </Dialog>
        </>
    );
};

export default AddPlaylist;
