import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { getServerAuthSession } from "~/server/auth";
import { ExternalLink, InfoIcon, LogOutIcon, UserIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "./ui/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";
import { signOut } from "next-auth/react";
import SignOut from "./SignOut";

interface UserInfoProps {}

const UserInfo: React.FC<UserInfoProps> = async ({}) => {
    const session = await getServerAuthSession();

    return session?.user ? (
        <div className="h-1/5 w-full rounded-md bg-secondary p-4">
            <div className="flex h-3/5 w-full flex-row">
                <Avatar className="h-full w-auto">
                    <AvatarImage
                        src={session.user.image!}
                        alt="Profile Picture"
                    />
                    <AvatarFallback>
                        <UserIcon className="h-full w-full" />
                    </AvatarFallback>
                </Avatar>
                <div className="ml-4 flex h-full w-full flex-col items-start justify-center">
                    <h1 className="text-2xl font-bold text-primary">
                        {session.user.name}
                    </h1>
                    <h3 className="text-md font-semibold">
                        {session.user.email}
                    </h3>
                </div>
            </div>
            <div className="flex h-2/5 w-full flex-row items-center justify-center space-x-4">
                <Link
                    href={"https://www.spotify.com/account/apps/"}
                    className={cn(
                        "my-2",
                        buttonVariants({ variant: "outline" }),
                    )}
                    target="_blank"
                >
                    <ExternalLink className="mr-2" />
                    Disconnect
                </Link>
                <SignOut />
            </div>
        </div>
    ) : (
        redirect("/sign-in")
    );
};

export default UserInfo;
