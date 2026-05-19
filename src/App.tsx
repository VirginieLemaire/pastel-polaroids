import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContestProvider } from "@/context/ContestContext";
import Index from "./pages/Index";
import SubmitPhoto from "./pages/SubmitPhoto";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const App = () => (
  <ContestProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/submit" element={<SubmitPhoto />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ContestProvider>
);

export default App;
