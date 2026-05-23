import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContestProvider } from "./context/ContestContext";
import Home from "./pages/Home";
import Contest from "./pages/Contest";
import DevMenu from "./dev/DevMenu";

const App = () => (
  <ContestProvider>
    <BrowserRouter>
      <DevMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contest/:id" element={<Contest />} />
      </Routes>
    </BrowserRouter>
  </ContestProvider>
);

export default App;
