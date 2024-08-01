"use client"

import React from "react";
import { Button } from "./ui/Button";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

interface SignOutProps {}

const SignOut: React.FC<SignOutProps> = ({}) => {
    return (
        <Button
            className="my-2 h-[38px]"
            variant={"destructive"}
            onClick={(e) => {
                e.preventDefault();
                signOut({
                    callbackUrl: "/sign-in",
                });
            }}
        >
            <LogOutIcon className="mr-2" />
            Sign Out
        </Button>
    );
};

export default SignOut;
