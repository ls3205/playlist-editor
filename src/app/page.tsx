import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function HomePage() {
    const session = await getServerAuthSession();

    return session?.user ? (
        <main className="relative flex min-h-screen flex-col items-center justify-center"></main>
    ) : (
        redirect("/sign-in")
    );
}
