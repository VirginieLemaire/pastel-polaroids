import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContestProvider } from "./context/ContestContext";
import Home from "./pages/Home";
import Contest from "./pages/Contest";

const App = () => (
  <ContestProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contest/:id" element={<Contest />} />
      </Routes>
    </BrowserRouter>
  </ContestProvider>
);

export default App;
