import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Home from "./containers/Home.tsx";

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route
                    index
                    element={<Home />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
