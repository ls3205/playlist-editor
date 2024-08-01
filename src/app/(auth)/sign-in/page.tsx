import React from "react";
import UserAuthForm from "~/components/UserAuthForm";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center">
            <UserAuthForm />
        </main>
    );
};

export default page;
