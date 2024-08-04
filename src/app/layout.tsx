import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Providers from "~/components/Providers";

export const metadata: Metadata = {
    title: "Spotify Playlist Editor",
    description: "A Spotify playlist editor.",
    icons: [
        { rel: "icon", url: "/favicon.ico", type: "image/png", sizes: "32x32" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
