import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import PageLayout from "./components/generic/wrappers/PageLayout.tsx";
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
                {search !== "" && <Participants search={search} />}
              </>
            }
          />
          <Route
            path={"/participants"}
            element={
              <>
                {search === "" && <Participants />}
                {search !== "" && <Participants search={search} />}
              </>
            }
          />
          <Route
            path={"/disciplines"}
            element={
              <>
                {search === "" && <Disciplines />}
                {search !== "" && <Participants search={search} />}
              </>
            }
          />
          <Route
            path={"/results"}
            element={
              <>
                {search === "" && <Results />}
                {search !== "" && <Participants search={search} />}
              </>
            }
          />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
