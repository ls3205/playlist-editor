"use client";

import React from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface UserAuthFormProps {}

const UserAuthForm: React.FC<UserAuthFormProps> = ({}) => {
    const loginWithSpotify = async () => {
        try {
            await signIn("spotify");
        } catch (err) {
            console.error(err);
        } finally {
        }
    };

    return (
        <Button variant={"ghost"} onClick={loginWithSpotify}>
            <Image
                src={
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png"
                }
                alt="spotify-svg"
                width={25}
                height={25}
            />
            <p className="ml-2 text-lg">Login with Spotify</p>
        </Button>
    );
};

export default UserAuthForm;
