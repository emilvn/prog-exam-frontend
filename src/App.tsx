import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import PageLayout from "./components/PageLayout.tsx";
import { useState } from "react";
import Participants from "./containers/Participants.tsx";
import Disciplines from "./containers/Disciplines.tsx";
import Results from "./containers/Results.tsx";

function App() {
    const [search, setSearch] = useState<string>("");

    return (
        <BrowserRouter>
            <PageLayout
                search={search}
                setSearch={setSearch}
            >
                <Routes>
                    <Route
                        index
                        element={
                            <>
                                {search === "" && <Home />}
                                {search !== "" && (
                                    <Participants search={search} />
                                )}
                            </>
                        }
                    />
                    <Route
                        path={"/participants"}
                        element={<Participants search={search} />}
                    />
                    <Route
                        path={"/disciplines"}
                        element={<Disciplines />}
                    />
                    <Route
                        path={"/results"}
                        element={<Results />}
                    />
                </Routes>
            </PageLayout>
        </BrowserRouter>
    );
}

export default App;
