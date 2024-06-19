import type { PropsWithChildren } from "react";

function PageLayout({ children }: PropsWithChildren) {
    return <main className="container mx-auto">{children}</main>;
}

export default PageLayout;
