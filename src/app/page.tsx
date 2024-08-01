import { redirect } from "next/navigation";
import UserInfo from "~/components/UserInfo";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
    const session = await getServerAuthSession();

    return session?.user ? (
        <main className="relative flex h-screen min-h-screen w-screen flex-row items-center justify-center">
            <div className="m-0 h-full min-w-[375px] space-y-2 p-4 pr-2">
                <UserInfo />
                <div className="h-[calc(80%-8px)] w-full rounded-md bg-secondary"></div>
            </div>
            <div className="m-0 h-full w-full space-y-2 p-4 pl-2">
                <div className="h-2/3 w-full rounded-md bg-secondary"></div>
                <div className="h-[calc(33.33%-8px)] w-full rounded-md bg-secondary"></div>
            </div>
        </main>
    ) : (
        redirect("/sign-in")
    );
}
