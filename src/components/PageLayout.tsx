import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { Toaster } from "react-hot-toast";
import NavBar from "./NavBar.tsx";

interface PageLayoutProps extends PropsWithChildren {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}

function PageLayout({ children, search, setSearch }: PageLayoutProps) {
    return (
        <div className="container mx-auto min-h-screen">
            <header className={"shadow-lg"}>
                <div className={"flex items-center gap-20 py-4 px-8"}>
                    <div>
                        <h1 className="text-4xl font-semibold text-slate-900 py-2">
                            MVP
                        </h1>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Atletikstævne
                        </h2>
                    </div>
                    <img
                        alt={"logo"}
                        className="h-32 w-32 drop-shadow-xl"
                        src={"/Gold_medal_olympic.svg"}
                    />
                </div>
                <NavBar
                    search={search}
                    setSearch={setSearch}
                />
            </header>
            <main className={"mt-2"}>{children}</main>
            <Toaster position="bottom-left" />
        </div>
    );
}

export default PageLayout;
