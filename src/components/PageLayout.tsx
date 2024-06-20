import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

function PageLayout({ children }: PropsWithChildren) {
    return (
        <>
            <main className="container mx-auto">{children}</main>
            <Toaster position="bottom-left" />
        </>
    );
}

export default PageLayout;
