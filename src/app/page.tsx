import { redirect } from "next/navigation";
import Editor from "~/components/Editor";
import PlaylistList from "~/components/PlaylistList";
import Search from "~/components/Search";
import {
    ResizableHandle,
    ResizablePanelGroup,
} from "~/components/ui/Resizable";
import UserInfo from "~/components/UserInfo";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
    const session = await getServerAuthSession();

    return session?.user ? (
        <main className="relative flex h-screen min-h-screen w-screen flex-row items-center justify-center">
            <div className="m-0 h-full min-w-[375px] space-y-2 p-4 pr-2">
                <UserInfo session={session} />
                <PlaylistList session={session} />
            </div>

            <ResizablePanelGroup
                direction="vertical"
                className="m-0 h-full w-full space-y-2 p-4 pl-2"
            >
                <Editor session={session} />
                <ResizableHandle withHandle />
                <Search />
            </ResizablePanelGroup>
        </main>
    ) : (
        redirect("/sign-in")
    );
}
