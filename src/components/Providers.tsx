"use client";

import React from "react";
import PlaylistContext from "./context/PlaylistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SongsContext from "./context/SongsContext";
import PlaylistHistoryContext from "./context/PlaylistHistoryContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <PlaylistContext>
                <PlaylistHistoryContext>
                    <SongsContext>{children}</SongsContext>
                </PlaylistHistoryContext>
            </PlaylistContext>
        </QueryClientProvider>
    );
};

export default Providers;
